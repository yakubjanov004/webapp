"use client"

export default function ClosedChats({ chats, users, onChatSelect, isDarkMode, currentUserId }) {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDuration = (createdAt, closedAt) => {
    const duration = new Date(closedAt) - new Date(createdAt)
    const minutes = Math.floor(duration / (1000 * 60))
    if (minutes < 60) return `${minutes}min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}soat ${remainingMinutes}min`
  }

  const getOtherUserId = (chat) => {
    return currentUserId === chat.clientId ? chat.supportId : chat.clientId
  }

  const groupedChats = chats.reduce((groups, chat) => {
    const date = formatDate(chat.closedAt)
    if (!groups[date]) groups[date] = []
    groups[date].push(chat)
    return groups
  }, {})

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Chat tarixi</h2>
        <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          {chats.length} ta yopilgan sessiya
        </span>
      </div>

      {Object.keys(groupedChats).length === 0 ? (
        <div className={`text-center py-12 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">Yopilgan chatlar yo'q</h3>
          <p>Tugatilgan suhbatlar ma'lumot uchun bu yerda ko'rinadi.</p>
        </div>
      ) : (
        Object.entries(groupedChats)
          .sort(([a], [b]) => new Date(b) - new Date(a))
          .map(([date, dateChats]) => (
            <div key={date} className="space-y-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{date}</h3>
              <div className="space-y-3">
                {dateChats.map((chat, index) => {
                  const otherUserId = getOtherUserId(chat)
                  const otherUser = users.find((u) => u.id === otherUserId)
                  return (
                    <div
                      key={chat.id}
                      onClick={() => onChatSelect(chat.id)}
                      className={`
                        p-4 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg
                        ${isDarkMode ? "bg-gray-800 hover:bg-gray-750 border border-gray-700" : "bg-white hover:bg-gray-50 border border-gray-200"}
                        animate-slide-in
                      `}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Avatar */}
                        <img
                          src={otherUser?.avatar || "/placeholder.svg?height=40&width=40&text=" + otherUser?.name?.[0]}
                          alt={otherUser?.name}
                          className="w-10 h-10 rounded-full object-cover opacity-75"
                        />

                        {/* Chat Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                              {otherUser?.name || "Noma'lum foydalanuvchi"}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {formatDuration(chat.createdAt, chat.closedAt)}
                              </span>
                            </div>
                          </div>

                          <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            {chat.subject}
                          </p>

                          <div className="flex items-center justify-between">
                            <p className={`text-sm truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              {chat.messages.length} ta xabar
                            </p>
                            <span className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                              Yopilgan {formatDate(chat.closedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
      )}
    </div>
  )
}
