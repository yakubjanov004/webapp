"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "../../context/ChatContext"
import MessageBubble from "./MessageBubble"
import InputBar from "./InputBar"
import ChatHeader from "./ChatHeader"

export default function ChatWindow({
  chat,
  currentUserId,
  onBack,
  onClose,
  isDarkMode,
  isReadOnly = false,
  isCompact = false,
  isFloating = false,
}) {
  const { users, sendMessage, closeChat, typingUsers } = useChat()
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  const otherUserId = currentUserId === chat.clientId ? chat.supportId : chat.clientId
  const otherUser = users.find((u) => u.id === otherUserId)
  const isTyping = typingUsers[chat.id]

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    })
  }

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }
  }

  const handleSendMessage = (text) => {
    sendMessage(chat.id, text, currentUserId)

    // Add haptic feedback if available
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("light")
    }
  }

  const handleCloseChat = () => {
    closeChat(chat.id)
    if (onBack) onBack()
    if (onClose) onClose()
  }

  useEffect(() => {
    scrollToBottom(false)
  }, [])

  useEffect(() => {
    scrollToBottom(true)
  }, [chat.messages])

  const windowClass = isFloating
    ? `${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl border shadow-2xl`
    : isCompact
      ? `${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl border`
      : `${isDarkMode ? "bg-gray-800" : "bg-white"}`

  return (
    <div className={`flex flex-col h-full ${windowClass} ${isFloating || isCompact ? "max-h-96" : "min-h-[600px]"}`}>
      {/* Chat Header */}
      <ChatHeader
        user={otherUser}
        chat={chat}
        onBack={onBack}
        onClose={onClose}
        onCloseChat={handleCloseChat}
        isDarkMode={isDarkMode}
        isReadOnly={isReadOnly}
        isCompact={isCompact || isFloating}
      />

      {/* Messages Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className={`flex-1 overflow-y-auto px-4 py-4 space-y-4 ${
            isDarkMode ? "bg-gray-900" : "bg-gray-50"
          } ${isFloating || isCompact ? "max-h-60" : ""}`}
        >
          {chat.messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={message.senderId === currentUserId}
              isDarkMode={isDarkMode}
              isNew={index === chat.messages.length - 1}
              senderName={message.senderId === currentUserId ? "You" : otherUser?.name}
            />
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl rounded-bl-md ${
                  isDarkMode ? "bg-gray-700 text-gray-300" : "bg-white text-gray-600"
                }`}
              >
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to Bottom Button */}
        {showScrollButton && (
          <button
            onClick={() => scrollToBottom(true)}
            className={`absolute bottom-20 right-4 w-10 h-10 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-10 ${
              isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-white hover:bg-gray-50 text-gray-600"
            }`}
          >
            <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}

        {/* Input Bar */}
        {!isReadOnly && (
          <InputBar onSendMessage={handleSendMessage} isDarkMode={isDarkMode} isCompact={isCompact || isFloating} />
        )}
      </div>
    </div>
  )
}
