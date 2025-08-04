"use client"

import { useChat } from "../../context/ChatContext"

export default function ChatList({ chats, users, onChatSelect, isDarkMode, currentUserId, showOpenButton = false }) {
  const { typingUsers, unreadCounts } = useChat()

  const formatLastActivity = (timestamp) => {
    const now = new Date()
    const activity = new Date(timestamp)
    const diffInMinutes = Math.floor((now - activity) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return activity.toLocaleDateString()
  }

  const getOtherUserId = (chat) => {
    return currentUserId === chat.clientId ? chat.supportId : chat.clientId
  }

  return (
    <div className="space-y-4">
      {chats.map((chat, index) => {
        const otherUserId = getOtherUserId(chat)
        const otherUser = users.find((u) => u.id === otherUserId)
        const isTyping = typingUsers[chat.id]
        const unreadCount = unreadCounts[`${chat.id}-${currentUserId}`] || 0

        return (
          <div
            key={chat.id}
            onClick={() => onChatSelect(chat.id)}
            className={`
              p-4 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg
              ${isDarkMode ? "bg-gray-800 hover:bg-gray-750 border border-gray-700" : "bg-white hover:bg-gray-50 border border-gray-200"}
              animate-slide-in
            `}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={otherUser?.avatar || "/placeholder.svg?height=48&width=48&text=" + otherUser?.name?.[0]}
                  alt={otherUser?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
                    isDarkMode ? "border-gray-800" : "border-white"
                  } ${otherUser?.status === "online" ? "bg-green-500" : "bg-gray-400"}`}
                ></div>
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-semibold truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {otherUser?.name || "Unknown User"}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-medium">
                        {unreadCount}
                      </span>
                    )}
                    <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {formatLastActivity(chat.lastActivity)}
                    </span>
                  </div>
                </div>

                <p className={`text-sm mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{chat.subject}</p>

                <div className="flex items-center justify-between">
                  {isTyping ? (
                    <div className={`text-sm italic ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                      <span className="inline-flex space-x-1">
                        <span>Typing</span>
                        <span className="flex space-x-1">
                          <span className="w-1 h-1 bg-current rounded-full animate-bounce"></span>
                          <span
                            className="w-1 h-1 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></span>
                          <span
                            className="w-1 h-1 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></span>
                        </span>
                      </span>
                    </div>
                  ) : (
                    <p className={`text-sm truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {chat.lastMessage ? (
                        <>
                          {chat.lastMessage.senderId === currentUserId && "You: "}
                          {chat.lastMessage.text}
                        </>
                      ) : (
                        "No messages yet"
                      )}
                    </p>
                  )}

                  {/* Status Badge */}
                  <div className="flex items-center space-x-2">
                    {chat.status === "active" && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          isDarkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-800"
                        }`}
                      >
                        Active
                      </span>
                    )}
                    {showOpenButton && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onChatSelect(chat.id)
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          isDarkMode
                            ? "bg-purple-600 text-white hover:bg-purple-700"
                            : "bg-purple-500 text-white hover:bg-purple-600"
                        }`}
                      >
                        Open
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
