"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { mockChatSessions, mockUsers } from "../data/mockData"

const ChatContext = createContext()

export function ChatProvider({ children }) {
  const [chatSessions, setChatSessions] = useState(mockChatSessions)
  const [users] = useState(mockUsers)
  const [activeChats, setActiveChats] = useState([]) // For callcenter multi-chat
  const [typingUsers, setTypingUsers] = useState({}) // userId -> isTyping
  const [unreadCounts, setUnreadCounts] = useState({})

  // WebSocket placeholder - where real-time connection would be established
  useEffect(() => {
    // TODO: Initialize WebSocket connection
    // const ws = new WebSocket('ws://localhost:8080/chat')
    // ws.onmessage = handleIncomingMessage
    // ws.onopen = () => console.log('Connected to chat server')
    // return () => ws.close()
  }, [])

  const sendMessage = (chatId, message, senderId) => {
    const newMessage = {
      id: Date.now().toString(),
      text: message,
      senderId,
      timestamp: new Date(),
      type: "text",
    }

    setChatSessions((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: newMessage,
            lastActivity: new Date(),
          }
        }
        return chat
      }),
    )

    // TODO: Send to WebSocket
    // ws.send(JSON.stringify({ type: 'message', chatId, message: newMessage }))

    // Simulate typing and response for demo
    simulateResponse(chatId, senderId)
  }

  const simulateResponse = (chatId, originalSenderId) => {
    // Show typing indicator
    setTypingUsers((prev) => ({ ...prev, [chatId]: true }))

    setTimeout(
      () => {
        const responses = [
          "Thanks for reaching out! How can I help you today?",
          "I understand your concern. Let me look into that for you.",
          "That's a great question! Here's what I can tell you...",
          "I'm here to help! Can you provide more details?",
          "Thank you for the information. I'll get back to you shortly.",
        ]

        const responseMessage = {
          id: (Date.now() + 1).toString(),
          text: responses[Math.floor(Math.random() * responses.length)],
          senderId: originalSenderId === "client" ? "support" : "client",
          timestamp: new Date(),
          type: "text",
        }

        setChatSessions((prev) =>
          prev.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: [...chat.messages, responseMessage],
                lastMessage: responseMessage,
                lastActivity: new Date(),
              }
            }
            return chat
          }),
        )

        // Remove typing indicator
        setTypingUsers((prev) => ({ ...prev, [chatId]: false }))
      },
      1500 + Math.random() * 2000,
    )
  }

  const closeChat = (chatId) => {
    setChatSessions((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            status: "closed",
            closedAt: new Date(),
          }
        }
        return chat
      }),
    )

    // Remove from active chats (callcenter)
    setActiveChats((prev) => prev.filter((id) => id !== chatId))

    // TODO: Notify server about chat closure
    // ws.send(JSON.stringify({ type: 'close_chat', chatId }))
  }

  const startNewChat = (clientId, subject = "New Chat") => {
    const newChat = {
      id: Date.now().toString(),
      clientId,
      supportId: "support",
      subject,
      status: "active",
      createdAt: new Date(),
      lastActivity: new Date(),
      messages: [
        {
          id: "welcome",
          text: "Hello! How can I help you today?",
          senderId: "support",
          timestamp: new Date(),
          type: "text",
        },
      ],
      lastMessage: null,
    }

    setChatSessions((prev) => [...prev, newChat])
    return newChat.id
  }

  const markAsRead = (chatId, userId) => {
    setUnreadCounts((prev) => ({
      ...prev,
      [`${chatId}-${userId}`]: 0,
    }))
  }

  const addToActiveChats = (chatId) => {
    setActiveChats((prev) => [...prev.filter((id) => id !== chatId), chatId])
  }

  const removeFromActiveChats = (chatId) => {
    setActiveChats((prev) => prev.filter((id) => id !== chatId))
  }

  return (
    <ChatContext.Provider
      value={{
        chatSessions,
        users,
        activeChats,
        typingUsers,
        unreadCounts,
        sendMessage,
        closeChat,
        startNewChat,
        markAsRead,
        addToActiveChats,
        removeFromActiveChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within ChatProvider")
  }
  return context
}
