"use client"

export default function ChatHeader({ user, chat, onBack, onClose, onCloseChat, isDarkMode, isReadOnly, isCompact }) {
  const getSessionDuration = () => {
    const start = new Date(chat.createdAt)
    const end = chat.status === "closed" ? new Date(chat.closedAt) : new Date()
    const diffInMinutes = Math.floor((end - start) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes}min`
    const hours = Math.floor(diffInMinutes / 60)
    const minutes = diffInMinutes % 60
    return `${hours}soat ${minutes}min`
  }

  return (
    <div
      className={`px-3 sm:px-4 py-2 sm:py-3 border-b flex items-center justify-between ${
        isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
      } ${isCompact ? "px-2 sm:px-3 py-1 sm:py-2" : ""}`}
    >
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className={`p-1 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${
              isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* User Info */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div className="relative flex-shrink-0">
            <img
              src={user?.avatar || "/placeholder.svg?height=32&width=32&text=" + user?.name?.[0]}
              alt={user?.name}
              className={`${isCompact ? "w-6 h-6 sm:w-8 sm:h-8" : "w-8 h-8 sm:w-10 sm:h-10"} rounded-full object-cover`}
            />
            <div
              className={`absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 ${
                isDarkMode ? "border-gray-800" : "border-white"
              } ${user?.status === "online" ? "bg-green-500" : "bg-gray-400"}`}
            ></div>
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className={`font-semibold truncate ${isCompact ? "text-sm" : "text-sm sm:text-base"} ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {user?.name || "Noma'lum foydalanuvchi"}
            </h3>
            {!isCompact && (
              <p className={`text-xs truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {chat.subject} • {getSessionDuration()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
        {/* Status Badge */}
        <span
          className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
            chat.status === "active"
              ? isDarkMode
                ? "bg-green-900/30 text-green-400"
                : "bg-green-100 text-green-800"
              : isDarkMode
                ? "bg-gray-700 text-gray-400"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          {chat.status === "active" ? "Faol" : "Yopilgan"}
        </span>

        {/* Close Chat Button */}
        {!isReadOnly && chat.status === "active" && (
          <button
            onClick={onCloseChat}
            className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs font-medium transition-colors ${
              isDarkMode ? "bg-red-900/30 text-red-400 hover:bg-red-900/50" : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
          >
            <span className="hidden sm:inline">Chatni yopish</span>
            <span className="sm:hidden">Yopish</span>
          </button>
        )}

        {/* Window Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className={`p-1 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${
              isDarkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
