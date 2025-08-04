"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { mockChatSessions, mockUsers } from "../data/mockData"

interface Message {
  id: string
  text: string
  senderId: string
  timestamp: Date
  type: string
}

interface ChatSession {
  id: string
  clientId: string
  supportId: string
  subject: string
  status: string
  createdAt: Date
  lastActivity: Date
  messages: Message[]
  lastMessage: Message | null
  closedAt?: Date
}

interface ChatContextType {
  chatSessions: ChatSession[]
  users: any[]
  activeChats: string[]
  typingUsers: Record<string, boolean>
  unreadCounts: Record<string, number>
  sendMessage: (chatId: string, message: string, senderId: string) => void
  closeChat: (chatId: string) => void
  startNewChat: (clientId: string, subject?: string) => string
  markAsRead: (chatId: string, userId: string) => void
  addToActiveChats: (chatId: string) => void
  removeFromActiveChats: (chatId: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

interface ChatProviderProps {
  children: ReactNode
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(mockChatSessions)
  const [users] = useState(mockUsers)
  const [activeChats, setActiveChats] = useState<string[]>([])
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({})
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})

  // WebSocket placeholder - where real-time connection would be established
  useEffect(() => {
    // TODO: Initialize WebSocket connection
    // const ws = new WebSocket('ws://localhost:8080/chat')
    // ws.onmessage = handleIncomingMessage
    // ws.onopen = () => console.log('Connected to chat server')
    // return () => ws.close()
  }, [])

  const sendMessage = (chatId: string, message: string, senderId: string) => {
    const newMessage: Message = {
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

  const simulateResponse = (chatId: string, originalSenderId: string) => {
    // Show typing indicator
    setTypingUsers((prev) => ({ ...prev, [chatId]: true }))

    setTimeout(
      () => {
        const responses = [
          "Xabar uchun rahmat! Bugun sizga qanday yordam bera olaman?",
          "Sizning muammongizni tushundim. Keling, buni hal qilaylik.",
          "Bu juda yaxshi savol! Mana sizga aytishim mumkin...",
          "Sizga yordam berishga tayyorman! Batafsil ma'lumot bera olasizmi?",
          "Ma'lumot uchun rahmat. Tez orada siz bilan bog'lanaman.",
        ]

        const responseMessage: Message = {
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

  const closeChat = (chatId: string) => {
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

  const startNewChat = (clientId: string, subject: string = "Yangi chat"): string => {
    const newChat: ChatSession = {
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
          text: "Salom! Bugun sizga qanday yordam bera olaman?",
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

  const markAsRead = (chatId: string, userId: string) => {
    setUnreadCounts((prev) => ({
      ...prev,
      [`${chatId}-${userId}`]: 0,
    }))
  }

  const addToActiveChats = (chatId: string) => {
    setActiveChats((prev) => [...prev.filter((id) => id !== chatId), chatId])
  }

  const removeFromActiveChats = (chatId: string) => {
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
