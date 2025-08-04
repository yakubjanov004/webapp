"use client"

import { useState, useEffect } from "react"
import { ChatProvider } from "./context/ChatContext"
import { ThemeProvider } from "./context/ThemeContext"
import RoleSelector from "./components/RoleSelector"
import ClientDashboard from "./components/client/ClientDashboard"
import CallCenterDashboard from "./components/callcenter/CallCenterDashboard"

export default function App() {
  const [currentRole, setCurrentRole] = useState(null)
  const [telegramUser, setTelegramUser] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isWebAppReady, setIsWebAppReady] = useState(false)

  useEffect(() => {
    // Load Telegram WebApp SDK
    const script = document.createElement("script")
    script.src = "https://telegram.org/js/telegram-web-app.js"
    script.async = true
    script.onload = () => {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp
        tg.ready()
        tg.expand()

        // Get user info and detect role from initData
        const user = tg.initDataUnsafe?.user || {
          first_name: "Demo User",
          last_name: "",
          username: "demo_user",
          id: Math.floor(Math.random() * 1000000),
        }

        // Try to detect role from start_param or user data
        const startParam = tg.initDataUnsafe?.start_param
        const detectedRole =
          startParam === "callcenter" ? "callcenter" : user.username?.includes("support") ? "callcenter" : null

        setTelegramUser(user)
        setCurrentRole(detectedRole)
        setIsDarkMode(tg.colorScheme === "dark")
        setIsWebAppReady(true)

        // Set theme
        if (tg.colorScheme === "dark") {
          document.documentElement.classList.add("dark")
        }
      } else {
        // Fallback for development
        setTelegramUser({
          first_name: "Demo User",
          last_name: "",
          username: "demo_user",
          id: Math.floor(Math.random() * 1000000),
        })
        setIsWebAppReady(true)
      }
    }
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  if (!isWebAppReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading Telegram WebApp...</p>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider isDarkMode={isDarkMode}>
      <ChatProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
          {!currentRole ? (
            <RoleSelector onRoleSelect={setCurrentRole} user={telegramUser} isDarkMode={isDarkMode} />
          ) : currentRole === "client" ? (
            <ClientDashboard user={telegramUser} isDarkMode={isDarkMode} onRoleChange={() => setCurrentRole(null)} />
          ) : (
            <CallCenterDashboard
              user={telegramUser}
              isDarkMode={isDarkMode}
              onRoleChange={() => setCurrentRole(null)}
            />
          )}
        </div>
      </ChatProvider>
    </ThemeProvider>
  )
}
