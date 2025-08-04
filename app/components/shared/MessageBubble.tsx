"use client"

import { useState, useEffect } from "react"

export default function MessageBubble({ message, isOwnMessage, isDarkMode, isNew, senderName }) {
  const [isVisible, setIsVisible] = useState(!isNew)

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setIsVisible(true), 100)
      return () => clearTimeout(timer)
    }
  }, [isNew])

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div
        className={`max-w-[280px] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-sm relative group ${
          isOwnMessage
            ? isDarkMode
              ? "bg-blue-600 text-white"
              : "bg-blue-500 text-white"
            : isDarkMode
              ? "bg-gray-700 text-white"
              : "bg-white text-gray-800 border border-gray-200"
        } ${isOwnMessage ? "rounded-br-md" : "rounded-bl-md"}`}
      >
        {/* Sender Name (for group chats or multi-agent) */}
        {!isOwnMessage && senderName && (
          <p className={`text-xs font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>{senderName}</p>
        )}

        {/* Message Content */}
        <div className="space-y-2">
          {message.type === "text" && (
            <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{message.text}</p>
          )}

          {message.type === "image" && (
            <div className="rounded-lg overflow-hidden">
              <img src={message.imageUrl || "/placeholder.svg"} alt="Ulashilgan rasm" className="max-w-full h-auto" />
            </div>
          )}

          {message.type === "file" && (
            <div className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg ${isDarkMode ? "bg-gray-600" : "bg-gray-100"}`}>
              <div className="text-xl sm:text-2xl">📎</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{message.fileName}</p>
                <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{message.fileSize}</p>
              </div>
            </div>
          )}
        </div>

        {/* Timestamp and Status */}
        <div
          className={`flex items-center justify-end mt-2 space-x-1 text-xs opacity-70 group-hover:opacity-100 transition-opacity ${
            isOwnMessage ? "text-blue-100" : isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <span>{formatTime(message.timestamp)}</span>

          {/* Read Receipt for Own Messages */}
          {isOwnMessage && (
            <div className="flex space-x-1">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Message Tail */}
        <div
          className={`absolute top-2 sm:top-3 w-3 h-3 sm:w-4 sm:h-4 ${isOwnMessage ? "-right-1.5 sm:-right-2" : "-left-1.5 sm:-left-2"} ${
            isOwnMessage
              ? isDarkMode
                ? "bg-blue-600"
                : "bg-blue-500"
              : isDarkMode
                ? "bg-gray-700"
                : "bg-white border-l border-t border-gray-200"
          } transform ${isOwnMessage ? "rotate-45" : "-rotate-45"} ${isOwnMessage ? "" : "border-gray-200"}`}
        ></div>
      </div>
    </div>
  )
}
