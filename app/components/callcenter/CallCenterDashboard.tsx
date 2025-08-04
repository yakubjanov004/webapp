"use client"

import { useState } from "react"
import { useChat } from "../../context/ChatContext"
import ChatList from "../shared/ChatList"
import ChatWindow from "../shared/ChatWindow"
import ClosedChats from "../shared/ClosedChats"
import FloatingActionButton from "./FloatingActionButton"

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
  const { chatSessions, users, activeChats, addToActiveChats, removeFromActiveChats } = useChat()
  const [activeView, setActiveView] = useState("dashboard")
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [openChatWindows, setOpenChatWindows] = useState<string[]>([])

  const openChats = chatSessions.filter((chat) => chat.status === "active")
  const closedChats = chatSessions.filter((chat) => chat.status === "closed")
  const urgentChats = openChats.filter((chat) => {
    const timeSinceLastActivity = Date.now() - new Date(chat.lastActivity).getTime()
    return timeSinceLastActivity > 1800000 // 30 minutes
  })

  const handleOpenChatWindow = (chatId: string) => {
    if (!openChatWindows.includes(chatId)) {
      setOpenChatWindows((prev) => [...prev, chatId])
    }
    addToActiveChats(chatId)
  }

  const handleCloseChatWindow = (chatId: string) => {
    setOpenChatWindows((prev) => prev.filter((id) => id !== chatId))
    removeFromActiveChats(chatId)
  }

  const selectedChat = selectedChatId ? chatSessions.find((chat) => chat.id === selectedChatId) : null

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <div
        className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b sticky top-0 z-20`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                🎧
              </div>
              <div>
                <h1 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Call Center Dashboard
                </h1>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Support Agent: {user.first_name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Stats */}
              <div className="flex space-x-4">
                <div
                  className={`px-3 py-2 rounded-lg ${isDarkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-800"}`}
                >
                  <span className="text-sm font-medium">{openChats.length} Active</span>
                </div>
                {urgentChats.length > 0 && (
                  <div
                    className={`px-3 py-2 rounded-lg ${isDarkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-800"} animate-pulse`}
                  >
                    <span className="text-sm font-medium">{urgentChats.length} Urgent</span>
                  </div>
                )}
              </div>

              <button
                onClick={onRoleChange}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Switch Role
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mt-4">
            {[
              { id: "dashboard", label: "Dashboard", count: openChats.length },
              { id: "active", label: "Active Chats", count: activeChats.length },
              { id: "closed", label: "Chat History", count: closedChats.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveView(tab.id)
                  setSelectedChatId(null)
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
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
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {selectedChat ? (
          <div className="animate-fade-in">
            <ChatWindow
              chat={selectedChat}
              currentUserId="support"
              onBack={() => setSelectedChatId(null)}
              onClose={() => setSelectedChatId(null)}
              isDarkMode={isDarkMode}
              isReadOnly={selectedChat.status === "closed"}
            />
          </div>
        ) : (
          <div className="animate-slide-in">
            {activeView === "dashboard" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Urgent Chats */}
                {urgentChats.length > 0 && (
                  <div
                    className={`col-span-full p-6 rounded-xl border-l-4 border-red-500 ${
                      isDarkMode ? "bg-red-900/20 border-red-400" : "bg-red-50 border-red-500"
                    }`}
                  >
                    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-red-400" : "text-red-800"}`}>
                      🚨 Urgent Attention Required
                    </h3>
                    <div className="space-y-3">
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
                              <div className="flex items-center space-x-3">
                                <img
                                  src={client?.avatar || "/placeholder.svg"}
                                  alt={client?.name}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div>
                                  <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                    {client?.name}
                                  </p>
                                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                    {chat.subject}
                                  </p>
                                </div>
                              </div>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  isDarkMode ? "bg-red-900/50 text-red-400" : "bg-red-100 text-red-800"
                                }`}
                              >
                                {timeSinceLastActivity}m ago
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* All Open Chats */}
                <div className="col-span-full">
                  <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    All Open Support Chats
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
                <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  My Active Chat Windows
                </h2>
                {activeChats.length === 0 ? (
                  <div className={`text-center py-12 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <div className="text-6xl mb-4">💻</div>
                    <h3 className="text-xl font-semibold mb-2">No active chat windows</h3>
                    <p>Open chats from the dashboard to start managing conversations.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                            isCompact={true}
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

      {/* Chat Windows */}
      {openChatWindows.map((chatId) => {
        const chat = chatSessions.find((c) => c.id === chatId)
        if (!chat || activeView !== "dashboard") return null

        return (
          <div
            key={chatId}
            className="fixed bottom-4 right-4 w-80 h-96 z-30 animate-slide-up"
            style={{
              right: `${4 + openChatWindows.indexOf(chatId) * 320}px`,
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

      {/* Floating Action Button */}
      <FloatingActionButton isDarkMode={isDarkMode} />
    </div>
  )
}
