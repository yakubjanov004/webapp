"use client"

import { useState, useRef } from "react"

export default function InputBar({ onSendMessage, isDarkMode, isCompact = false }) {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const inputRef = useRef(null)

  const emojis = ["😊", "😂", "❤️", "👍", "👎", "😢", "😮", "😡", "🤔", "👋", "🙏", "✅", "❌", "🎉", "⚡", "🔥"]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim() || isSending) return

    setIsSending(true)
    const messageText = message.trim()
    setMessage("")

    // Add haptic feedback if available
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("light")
    }

    // Play notification sound
    try {
      const audio = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhCSd+zO/FfC8HIoHN8tiSNBgSaLzttZ1OGShIod7qvGYbCTPD8NqNP",
      )
      audio.volume = 0.1
      audio.play().catch(() => {}) // Ignore if audio fails
    } catch {}

    try {
      await onSendMessage(messageText)
    } finally {
      setIsSending(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const addEmoji = (emoji) => {
    setMessage((prev) => prev + emoji)
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  return (
    <div
      className={`${isCompact ? "p-2 sm:p-3" : "p-3 sm:p-4"} border-t transition-colors duration-300 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className={`mb-2 sm:mb-3 p-2 sm:p-3 rounded-lg grid grid-cols-8 gap-1 sm:gap-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
          {emojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => addEmoji(emoji)}
              className={`p-1 sm:p-2 rounded-lg hover:scale-110 transition-transform text-sm sm:text-base ${
                isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end space-x-2 sm:space-x-3">
        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`${isCompact ? "w-7 h-7 sm:w-8 sm:h-8" : "w-8 h-8 sm:w-10 sm:h-10"} rounded-full flex items-center justify-center transition-colors text-sm sm:text-base ${
            isDarkMode
              ? "text-gray-400 hover:text-white hover:bg-gray-700"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          }`}
        >
          😊
        </button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Xabar yozing..."
            rows={1}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-2xl resize-none transition-all duration-200 focus:outline-none focus:ring-2 text-sm sm:text-base ${
              isDarkMode
                ? "bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 border border-gray-600"
                : "bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-blue-500 border border-gray-300"
            }`}
            style={{
              minHeight: "40px",
              maxHeight: "120px",
            }}
            disabled={isSending}
          />

          {/* Character Counter (optional) */}
          {message.length > 100 && (
            <div className={`absolute -top-6 right-2 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {message.length}/1000
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() || isSending}
          className={`${isCompact ? "w-7 h-7 sm:w-8 sm:h-8" : "w-8 h-8 sm:w-10 sm:h-10"} rounded-full flex items-center justify-center transition-all duration-200 transform active:scale-95 ${
            message.trim() && !isSending
              ? isDarkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl"
              : isDarkMode
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSending ? (
            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </form>

      {/* WebSocket Status Indicator */}
      <div
        className={`flex items-center justify-center mt-2 text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
      >
        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-pulse"></div>
        <span className="hidden sm:inline">Local mode (WebSocket ready for integration)</span>
        <span className="sm:hidden">Local mode</span>
      </div>
    </div>
  )
}
