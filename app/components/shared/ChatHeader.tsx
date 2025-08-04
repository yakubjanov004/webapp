"use client"

export default function ChatHeader({ user, chat, onBack, onClose, onCloseChat, isDarkMode, isReadOnly, isCompact }) {
  const getSessionDuration = () => {
    const start = new Date(chat.createdAt)
    const end = chat.status === "closed" ? new Date(chat.closedAt) : new Date()
    const diffInMinutes = Math.floor((end - start) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes}m`
    const hours = Math.floor(diffInMinutes / 60)
    const minutes = diffInMinutes % 60
    return `${hours}h ${minutes}m`
  }

  return (
    <div
      className={`px-4 py-3 border-b flex items-center justify-between ${
        isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
      } ${isCompact ? "px-3 py-2" : ""}`}
    >
      <div className="flex items-center space-x-3">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={user?.avatar || "/placeholder.svg?height=32&width=32&text=" + user?.name?.[0]}
              alt={user?.name}
              className={`${isCompact ? "w-8 h-8" : "w-10 h-10"} rounded-full object-cover`}
            />
            <div
              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 ${
                isDarkMode ? "border-gray-800" : "border-white"
              } ${user?.status === "online" ? "bg-green-500" : "bg-gray-400"}`}
            ></div>
          </div>
          <div>
            <h3
              className={`font-semibold ${isCompact ? "text-sm" : "text-base"} ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {user?.name || "Unknown User"}
            </h3>
            {!isCompact && (
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {chat.subject} • {getSessionDuration()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Status Badge */}
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            chat.status === "active"
              ? isDarkMode
                ? "bg-green-900/30 text-green-400"
                : "bg-green-100 text-green-800"
              : isDarkMode
                ? "bg-gray-700 text-gray-400"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          {chat.status === "active" ? "Active" : "Closed"}
        </span>

        {/* Close Chat Button */}
        {!isReadOnly && chat.status === "active" && (
          <button
            onClick={onCloseChat}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              isDarkMode ? "bg-red-900/30 text-red-400 hover:bg-red-900/50" : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
          >
            Close Chat
          </button>
        )}

        {/* Window Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
