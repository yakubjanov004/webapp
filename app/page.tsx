"use client"

import { useState, useEffect } from "react"
import { ChatProvider } from "./context/ChatContext"
import { ThemeProvider } from "./context/ThemeContext"
import RoleSelector from "./components/RoleSelector"
import ClientDashboard from "./components/client/ClientDashboard"
import CallCenterDashboard from "./components/callcenter/CallCenterDashboard"

// Telegram WebApp type definitions
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void
        expand: () => void
        colorScheme: string
        initDataUnsafe?: {
          user?: {
            first_name: string
            last_name: string
            username: string
            id: number
          }
          start_param?: string
        }
      }
    }
  }
}

interface TelegramUser {
  first_name: string
  last_name: string
  username: string
  id: number
}

export default function App() {
  const [currentRole, setCurrentRole] = useState<string | null>(null)
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isWebAppReady, setIsWebAppReady] = useState(false)
  const [loadingError, setLoadingError] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const initializeApp = () => {
      // Check if we're in Telegram WebApp environment
      const isTelegramWebApp = window.Telegram?.WebApp || 
        window.location.search.includes('tgWebAppData') ||
        window.location.search.includes('tgWebAppStartParam')

      if (isTelegramWebApp && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp
        tg.ready()
        tg.expand()

        // Get user info and detect role from initData
        const user: TelegramUser = tg.initDataUnsafe?.user || {
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
        // Fallback for development or when not in Telegram WebApp
        const fallbackUser: TelegramUser = {
          first_name: "Demo User",
          last_name: "",
          username: "demo_user",
          id: Math.floor(Math.random() * 1000000),
        }
        setTelegramUser(fallbackUser)
        setIsWebAppReady(true)
      }
    }

    // Try to load Telegram WebApp SDK
    const script = document.createElement("script")
    script.src = "https://telegram.org/js/telegram-web-app.js"
    script.async = true
    script.onload = () => {
      // Give a small delay for the SDK to initialize
      setTimeout(() => {
        initializeApp()
      }, 100)
    }
    script.onerror = () => {
      console.log("Telegram WebApp SDK failed to load, using fallback")
      initializeApp()
    }
    document.head.appendChild(script)

    // Fallback timeout - if SDK doesn't load within 1 second, proceed anyway
    timeoutId = setTimeout(() => {
      if (!isWebAppReady) {
        console.log("Telegram WebApp SDK timeout, using fallback")
        initializeApp()
      }
    }, 1000)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
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
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Alfa Connect yuklanmoqda...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Iltimos, kuting</p>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider isDarkMode={isDarkMode}>
      <ChatProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
          {!currentRole ? (
            <RoleSelector onRoleSelect={setCurrentRole} user={telegramUser!} isDarkMode={isDarkMode} />
          ) : currentRole === "client" ? (
            <ClientDashboard user={telegramUser!} isDarkMode={isDarkMode} onRoleChange={() => setCurrentRole(null)} />
          ) : (
            <CallCenterDashboard
              user={telegramUser!}
              isDarkMode={isDarkMode}
              onRoleChange={() => setCurrentRole(null)}
            />
          )}
        </div>
      </ChatProvider>
    </ThemeProvider>
  )
}
