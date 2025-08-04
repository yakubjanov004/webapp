"use client"

import { useState } from "react"
import { useChat } from "../../context/ChatContext"
import ChatList from "../shared/ChatList"
import ChatWindow from "../shared/ChatWindow"
import ClosedChats from "../shared/ClosedChats"

interface TelegramUser {
  first_name: string
  last_name: string
  username: string
  id: number
}

interface ClientDashboardProps {
  user: TelegramUser
  isDarkMode: boolean
  onRoleChange: () => void
}

export default function ClientDashboard({ user, isDarkMode, onRoleChange }: ClientDashboardProps) {
  const { chatSessions, users, startNewChat } = useChat()
  const [activeView, setActiveView] = useState("active")
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [newChatSubject, setNewChatSubject] = useState("")
  const [selectedChatType, setSelectedChatType] = useState("general")
  const [showFAB, setShowFAB] = useState(false)

  // Filter chats for this client
  const clientChats = chatSessions.filter((chat) => chat.clientId === user.id.toString())
  const activeChats = clientChats.filter((chat) => chat.status === "active")
  const closedChats = clientChats.filter((chat) => chat.status === "closed")

  const selectedChat = selectedChatId ? chatSessions.find((chat) => chat.id === selectedChatId) : null

  const chatTypes = [
    { id: "general", label: "Umumiy yordam", icon: "💬", description: "Umumiy savollar va yordam" },
    { id: "technical", label: "Texnik muammo", icon: "🔧", description: "Texnik muammolar va xatolar" },
    { id: "billing", label: "To'lov savoli", icon: "💰", description: "To'lov va hisob-kitob muammolari" },
    { id: "feature", label: "Funksiya so'rovi", icon: "💡", description: "Takliflar va funksiya so'rovlari" },
  ]

  const getDefaultSubject = (type: string) => {
    const typeInfo = chatTypes.find(t => t.id === type)
    return typeInfo ? `${typeInfo.label} - ${user.first_name}` : "Yangi yordam chat"
  }

  const handleCreateNewChat = () => {
    if (!newChatSubject.trim()) return
    
    const subject = newChatSubject.trim() || getDefaultSubject(selectedChatType)
    const newChatId = startNewChat(user.id.toString(), subject)
    setSelectedChatId(newChatId)
    setShowNewChatModal(false)
    setNewChatSubject("")
    setSelectedChatType("general")
    setActiveView("active")
  }

  const handleChatTypeSelect = (type: string) => {
    setSelectedChatType(type)
    if (!newChatSubject.trim()) {
      setNewChatSubject(getDefaultSubject(type))
    }
  }

  const quickActions = [
    { 
      icon: "💬", 
      label: "Yangi chat", 
      action: () => setShowNewChatModal(true),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    { 
      icon: "📋", 
      label: "Chat tarixi", 
      action: () => setActiveView("closed"),
      color: "bg-purple-500 hover:bg-purple-600"
    },
    { 
      icon: "🔄", 
      label: "Rolni o'zgartirish", 
      action: onRoleChange,
      color: "bg-gray-600 hover:bg-gray-700"
    },
  ]

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <div
        className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b sticky top-0 z-10`}
      >
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                {user.first_name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className={`text-lg sm:text-xl font-bold truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>Mening yordam chatlarim</h1>
                <p className={`text-xs sm:text-sm truncate ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {user.first_name} {user.last_name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* New Chat Button */}
              <button
                onClick={() => setShowNewChatModal(true)}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  isDarkMode
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                <span className="flex items-center space-x-1 sm:space-x-2">
                  <span>➕</span>
                  <span className="hidden sm:inline">Yangi chat</span>
                  <span className="sm:hidden">Yangi</span>
                </span>
              </button>
              <button
                onClick={onRoleChange}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
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
              { id: "active", label: "Faol chatlar", count: activeChats.length },
              { id: "closed", label: "Chat tarixi", count: closedChats.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveView(tab.id)
                  setSelectedChatId(null)
                }}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base whitespace-nowrap ${
                  activeView === tab.id
                    ? isDarkMode
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-blue-500 text-white shadow-lg"
                    : isDarkMode
                      ? "text-gray-400 hover:text-white hover:bg-gray-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 rounded-full text-xs ${
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
            className={`max-w-sm sm:max-w-lg w-full p-4 sm:p-6 rounded-xl shadow-2xl ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className={`text-lg sm:text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Yangi yordam chat yaratish
              </h3>
              <button
                onClick={() => {
                  setShowNewChatModal(false)
                  setNewChatSubject("")
                  setSelectedChatType("general")
                }}
                className={`p-1 sm:p-2 rounded-lg transition-colors ${
                  isDarkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Chat Type Selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 sm:mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Chat turi
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {chatTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleChatTypeSelect(type.id)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        selectedChatType === type.id
                          ? isDarkMode
                            ? "border-blue-500 bg-blue-900/20"
                            : "border-blue-500 bg-blue-50"
                          : isDarkMode
                            ? "border-gray-600 hover:border-gray-500 bg-gray-700"
                            : "border-gray-200 hover:border-gray-300 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <span className="text-xl sm:text-2xl">{type.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className={`font-medium text-sm sm:text-base truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            {type.label}
                          </div>
                          <div className={`text-xs truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {type.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Subject */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Chat mavzusi
                </label>
                <input
                  type="text"
                  value={newChatSubject}
                  onChange={(e) => setNewChatSubject(e.target.value)}
                  placeholder="Chat mavzusini kiriting..."
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 text-sm sm:text-base ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500"
                  }`}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleCreateNewChat()
                    }
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 sm:space-x-3 pt-2 sm:pt-4">
                <button
                  onClick={handleCreateNewChat}
                  disabled={!newChatSubject.trim()}
                  className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    newChatSubject.trim()
                      ? isDarkMode
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                      : isDarkMode
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Chat yaratish
                </button>
                <button
                  onClick={() => {
                    setShowNewChatModal(false)
                    setNewChatSubject("")
                    setSelectedChatType("general")
                  }}
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
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {selectedChat ? (
          <div className="animate-fade-in">
            <ChatWindow
              chat={selectedChat}
              currentUserId={user.id.toString()}
              onBack={() => setSelectedChatId(null)}
              onClose={() => setSelectedChatId(null)}
              isDarkMode={isDarkMode}
              isReadOnly={selectedChat.status === "closed"}
            />
          </div>
        ) : (
          <div className="animate-slide-in">
            {activeView === "active" ? (
              <div>
                <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Faol yordam chatlari
                </h2>
                {activeChats.length === 0 ? (
                  <div className={`text-center py-8 sm:py-12 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <div className="text-4xl sm:text-6xl mb-4">💬</div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Faol chatlar yo'q</h3>
                    <p className="text-sm sm:text-base">Yordam suhbatini boshlaganingizda, u bu yerda ko'rinadi.</p>
                    <button
                      onClick={() => setShowNewChatModal(true)}
                      className={`mt-4 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                        isDarkMode
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      Yangi chat boshlash
                    </button>
                  </div>
                ) : (
                  <ChatList
                    chats={activeChats}
                    users={users}
                    onChatSelect={setSelectedChatId}
                    isDarkMode={isDarkMode}
                    currentUserId={user.id.toString()}
                  />
                )}
              </div>
            ) : (
              <ClosedChats
                chats={closedChats}
                users={users}
                onChatSelect={setSelectedChatId}
                isDarkMode={isDarkMode}
                currentUserId={user.id.toString()}
              />
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
        {/* Quick Actions */}
        {showFAB && (
          <div className="absolute bottom-12 sm:bottom-16 right-0 space-y-2 sm:space-y-3 animate-scale-in">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`
                  flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 text-white text-sm sm:text-base
                  ${action.color}
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-base sm:text-lg">{action.icon}</span>
                <span className="font-medium whitespace-nowrap">{action.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Main FAB */}
        <button
          onClick={() => setShowFAB(!showFAB)}
          className={`
            w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 active:scale-95
            ${isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"}
            text-white text-lg sm:text-xl font-bold
            ${showFAB ? "rotate-45" : "rotate-0"}
          `}
        >
          {showFAB ? "✕" : "⚡"}
        </button>
      </div>
    </div>
  )
}
