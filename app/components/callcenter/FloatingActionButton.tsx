"use client"

import { useState } from "react"

export default function FloatingActionButton({ isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false)

  const quickActions = [
    { icon: "➕", label: "New Chat", action: () => console.log("Start new chat") },
    { icon: "🔍", label: "Search", action: () => console.log("Search chats") },
    { icon: "📊", label: "Reports", action: () => console.log("View reports") },
  ]

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Quick Actions */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 space-y-3 animate-scale-in">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105
                ${isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-gray-800 hover:bg-gray-50"}
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-lg">{action.icon}</span>
              <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 active:scale-95
          ${isDarkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600"}
          text-white text-xl font-bold
          ${isOpen ? "rotate-45" : "rotate-0"}
        `}
      >
        {isOpen ? "✕" : "⚡"}
      </button>
    </div>
  )
}
