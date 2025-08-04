"use client"

import { useState } from "react"
import { useChat } from "../../context/ChatContext"
import ChatList from "../shared/ChatList"
import ChatWindow from "../shared/ChatWindow"
import ClosedChats from "../shared/ClosedChats"

export default function ClientDashboard({ user, isDarkMode, onRoleChange }) {
  const { chatSessions, users } = useChat()
  const [activeView, setActiveView] = useState("active")
  const [selectedChatId, setSelectedChatId] = useState(null)

  // Filter chats for this client
  const clientChats = chatSessions.filter((chat) => chat.clientId === user.id)
  const activeChats = clientChats.filter((chat) => chat.status === "active")
  const closedChats = clientChats.filter((chat) => chat.status === "closed")

  const selectedChat = selectedChatId ? chatSessions.find((chat) => chat.id === selectedChatId) : null

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <div
        className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b sticky top-0 z-10`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {user.first_name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h1 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>My Support Chats</h1>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {user.first_name} {user.last_name}
                </p>
              </div>
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

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mt-4">
            {[
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
      <div className="max-w-6xl mx-auto px-4 py-6">
        {selectedChat ? (
          <div className="animate-fade-in">
            <ChatWindow
              chat={selectedChat}
              currentUserId={user.id}
              onBack={() => setSelectedChatId(null)}
              isDarkMode={isDarkMode}
              isReadOnly={selectedChat.status === "closed"}
            />
          </div>
        ) : (
          <div className="animate-slide-in">
            {activeView === "active" ? (
              <div>
                <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Active Support Chats
                </h2>
                {activeChats.length === 0 ? (
                  <div className={`text-center py-12 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-semibold mb-2">No active chats</h3>
                    <p>When you start a support conversation, it will appear here.</p>
                  </div>
                ) : (
                  <ChatList
                    chats={activeChats}
                    users={users}
                    onChatSelect={setSelectedChatId}
                    isDarkMode={isDarkMode}
                    currentUserId={user.id}
                  />
                )}
              </div>
            ) : (
              <ClosedChats
                chats={closedChats}
                users={users}
                onChatSelect={setSelectedChatId}
                isDarkMode={isDarkMode}
                currentUserId={user.id}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
