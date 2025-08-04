"use client"

import { useState } from "react"
import { useChat } from "../../context/ChatContext"
import ChatList from "../shared/ChatList"
import ChatWindow from "../shared/ChatWindow"
import ClosedChats from "../shared/ClosedChats"
import FloatingActionButton from "./FloatingActionButton"
import StatisticsModal from "./StatisticsModal"
import SearchModal from "./SearchModal"

interface TelegramUser {
  first_name: string
  last_name: string
  username: string
  id: number
}

interface CallCenterDashboardProps {
  user: TelegramUser
  isDarkMode: boolean
  onRoleChange: () => void
}

export default function CallCenterDashboard({ user, isDarkMode, onRoleChange }: CallCenterDashboardProps) {
  const { chatSessions, users, activeChats, addToActiveChats, removeFromActiveChats, startNewChat } = useChat()
  const [activeView, setActiveView] = useState("dashboard")
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [openChatWindows, setOpenChatWindows] = useState<string[]>([])
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [showStatisticsModal, setShowStatisticsModal] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)

  const openChats = chatSessions.filter((chat) => chat.status === "active")
  const closedChats = chatSessions.filter((chat) => chat.status === "closed")
  const urgentChats = openChats.filter((chat) => {
    const timeSinceLastActivity = Date.now() - new Date(chat.lastActivity).getTime()
    return timeSinceLastActivity > 1800000 // 30 minutes
  })

  const handleOpenChatWindow = (chatId: string) => {
    // Chat oynasini to'liq ochish
    setSelectedChatId(chatId)
    
    // Pastki o'ng burchakdagi kichik oynani yopish
    setOpenChatWindows((prev) => prev.filter((id) => id !== chatId))
    removeFromActiveChats(chatId)
  }

  const handleCloseChatWindow = (chatId: string) => {
    setOpenChatWindows((prev) => prev.filter((id) => id !== chatId))
    removeFromActiveChats(chatId)
  }

  const selectedChat = selectedChatId ? chatSessions.find((chat) => chat.id === selectedChatId) : null

  const handleCreateNewChat = () => {
    const clients = users.filter(user => user.role === "client")
    const randomClient = clients[Math.floor(Math.random() * clients.length)]
    
    if (randomClient) {
      const chatTypes = [
        "Umumiy yordam so'rovi",
        "Texnik muammo",
        "To'lov savoli", 
        "Funksiya so'rovi"
      ]
      const randomType = chatTypes[Math.floor(Math.random() * chatTypes.length)]
      
      startNewChat(randomClient.id, randomType)
      setShowNewChatModal(false)
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <div
        className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b sticky top-0 z-20`}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                🎧
              </div>
              <div className="min-w-0 flex-1">
                <h1 className={`text-lg sm:text-xl font-bold truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Call Center
                </h1>
                <p className={`text-xs sm:text-sm truncate ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {user.first_name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Stats */}
              <div className="flex space-x-2 sm:space-x-4">
                <div
                  className={`px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm ${isDarkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-800"}`}
                >
                  <span className="font-medium">{openChats.length} Faol</span>
                </div>
                {urgentChats.length > 0 && (
                  <div
                    className={`px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm ${isDarkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-800"} animate-pulse`}
                  >
                    <span className="font-medium">{urgentChats.length} Shoshilinch</span>
                  </div>
                )}
              </div>

              <button
                onClick={onRoleChange}
                className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="hidden sm:inline">Rolni o'zgartirish</span>
                <span className="sm:hidden">🔄</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mt-2 sm:mt-4 overflow-x-auto">
            {[
              { id: "dashboard", label: "Dashboard", count: openChats.length },
              { id: "active", label: "Faol chatlar", count: activeChats.length },
              { id: "closed", label: "Chat tarixi", count: closedChats.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveView(tab.id)
                  setSelectedChatId(null)
                }}
                className={`px-3 py-2 sm:px-4 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base whitespace-nowrap ${
                  activeView === tab.id
                    ? isDarkMode
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-purple-500 text-white shadow-lg"
                    : isDarkMode
                      ? "text-gray-400 hover:text-white hover:bg-gray-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`ml-1 sm:ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                      activeView === tab.id ? "bg-white/20" : isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div
            className={`max-w-sm sm:max-w-md w-full p-4 sm:p-6 rounded-xl shadow-2xl ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <h3 className={`text-lg sm:text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Yangi chat yaratish
            </h3>
            <p className={`mb-6 text-sm sm:text-base ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Random mijoz bilan yangi chat yaratiladi.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleCreateNewChat}
                className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                  isDarkMode
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-purple-500 text-white hover:bg-purple-600"
                }`}
              >
                Yaratish
              </button>
              <button
                onClick={() => setShowNewChatModal(false)}
                className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {selectedChat ? (
          <div className="animate-fade-in">
            <ChatWindow
              chat={selectedChat}
              currentUserId="support"
              onBack={() => {
                setSelectedChatId(null)
                // Pastki o'ng burchakdagi kichik oynalarni ham yopish
                setOpenChatWindows([])
              }}
              onClose={() => {
                setSelectedChatId(null)
                // Pastki o'ng burchakdagi kichik oynalarni ham yopish
                setOpenChatWindows([])
              }}
              isDarkMode={isDarkMode}
              isReadOnly={selectedChat.status === "closed"}
            />
          </div>
        ) : (
          <div className="animate-slide-in">
            {activeView === "dashboard" ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Urgent Chats */}
                {urgentChats.length > 0 && (
                  <div
                    className={`p-4 sm:p-6 rounded-xl border-l-4 border-red-500 ${
                      isDarkMode ? "bg-red-900/20 border-red-400" : "bg-red-50 border-red-500"
                    }`}
                  >
                    <h3 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${isDarkMode ? "text-red-400" : "text-red-800"}`}>
                      🚨 Shoshilinch e'tibor kerak
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      {urgentChats.slice(0, 3).map((chat) => {
                        const client = users.find((u) => u.id === chat.clientId)
                        const timeSinceLastActivity = Math.floor(
                          (Date.now() - new Date(chat.lastActivity).getTime()) / 60000,
                        )
                        return (
                          <div
                            key={chat.id}
                            onClick={() => handleOpenChatWindow(chat.id)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 min-w-0 flex-1">
                                <img
                                  src={client?.avatar || "/placeholder.svg"}
                                  alt={client?.name}
                                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className={`font-medium text-sm sm:text-base truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                    {client?.name}
                                  </p>
                                  <p className={`text-xs sm:text-sm truncate ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                    {chat.subject}
                                  </p>
                                </div>
                              </div>
                              <span
                                className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                                  isDarkMode ? "bg-red-900/50 text-red-400" : "bg-red-100 text-red-800"
                                }`}
                              >
                                {timeSinceLastActivity}min oldin
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* All Open Chats */}
                <div>
                  <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Barcha ochiq yordam chatlari
                  </h2>
                  <ChatList
                    chats={openChats}
                    users={users}
                    onChatSelect={handleOpenChatWindow}
                    isDarkMode={isDarkMode}
                    currentUserId="support"
                    showOpenButton={true}
                  />
                </div>
              </div>
            ) : activeView === "active" ? (
              <div>
                <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Mening faol chat oynalarim
                </h2>
                {activeChats.length === 0 ? (
                  <div className={`text-center py-8 sm:py-12 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <div className="text-4xl sm:text-6xl mb-4">💻</div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Faol chat oynalari yo'q</h3>
                    <p className="text-sm sm:text-base">Dashboarddan chatlarni ochib, suhbatlarni boshqarishni boshlang.</p>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {activeChats.map((chatId) => {
                      const chat = chatSessions.find((c) => c.id === chatId)
                      if (!chat) return null
                      return (
                        <div key={chatId} className="animate-scale-in">
                          <ChatWindow
                            chat={chat}
                            currentUserId="support"
                            onBack={() => {}}
                            isDarkMode={isDarkMode}
                            isCompact={false}
                            onClose={() => handleCloseChatWindow(chatId)}
                          />
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              <ClosedChats
                chats={closedChats}
                users={users}
                onChatSelect={setSelectedChatId}
                isDarkMode={isDarkMode}
                currentUserId="support"
              />
            )}
          </div>
        )}
      </div>

      {/* Chat Windows - Only show in Dashboard and when no selected chat */}
      {activeView === "dashboard" && !selectedChatId && openChatWindows.map((chatId) => {
        const chat = chatSessions.find((c) => c.id === chatId)
        if (!chat) return null

        return (
          <div
            key={chatId}
            className="fixed bottom-4 right-4 w-72 h-80 sm:w-80 sm:h-96 z-30 animate-slide-up"
            style={{
              right: `${4 + openChatWindows.indexOf(chatId) * 280}px`,
              zIndex: 30 + openChatWindows.indexOf(chatId),
            }}
          >
            <ChatWindow
              chat={chat}
              currentUserId="support"
              onBack={() => {}}
              isDarkMode={isDarkMode}
              isFloating={true}
              onClose={() => handleCloseChatWindow(chatId)}
            />
          </div>
        )
      })}

      {/* Modals */}
      <StatisticsModal 
        isOpen={showStatisticsModal}
        onClose={() => setShowStatisticsModal(false)}
        isDarkMode={isDarkMode}
      />
      
      <SearchModal 
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        isDarkMode={isDarkMode}
      />

      {/* Floating Action Button */}
      <FloatingActionButton 
        isDarkMode={isDarkMode}
        onNewChat={() => setShowNewChatModal(true)}
        onSearch={() => setShowSearchModal(true)}
        onStatistics={() => setShowStatisticsModal(true)}
      />
    </div>
  )
}
