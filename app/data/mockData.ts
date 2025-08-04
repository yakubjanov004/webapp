export const mockUsers = [
  {
    id: "client",
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40&text=JD",
    status: "online",
    role: "client",
  },
  {
    id: "client2",
    name: "Sarah Wilson",
    avatar: "/placeholder.svg?height=40&width=40&text=SW",
    status: "offline",
    role: "client",
  },
  {
    id: "client3",
    name: "Mike Johnson",
    avatar: "/placeholder.svg?height=40&width=40&text=MJ",
    status: "online",
    role: "client",
  },
  {
    id: "support",
    name: "Support Team",
    avatar: "/placeholder.svg?height=40&width=40&text=ST",
    status: "online",
    role: "support",
  },
]

export const mockChatSessions = [
  {
    id: "1",
    clientId: "client",
    supportId: "support",
    subject: "Account Issues",
    status: "active",
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    lastActivity: new Date(Date.now() - 300000), // 5 minutes ago
    messages: [
      {
        id: "1",
        text: "Hello! I'm having trouble accessing my account.",
        senderId: "client",
        timestamp: new Date(Date.now() - 3600000),
        type: "text",
      },
      {
        id: "2",
        text: "Hi! I'd be happy to help you with your account access. Can you tell me what error message you're seeing?",
        senderId: "support",
        timestamp: new Date(Date.now() - 3540000),
        type: "text",
      },
      {
        id: "3",
        text: "It says 'Invalid credentials' even though I'm sure my password is correct.",
        senderId: "client",
        timestamp: new Date(Date.now() - 3480000),
        type: "text",
      },
      {
        id: "4",
        text: "Let me check your account status. Can you confirm your email address for me?",
        senderId: "support",
        timestamp: new Date(Date.now() - 3420000),
        type: "text",
      },
    ],
    lastMessage: {
      id: "4",
      text: "Let me check your account status. Can you confirm your email address for me?",
      senderId: "support",
      timestamp: new Date(Date.now() - 3420000),
      type: "text",
    },
  },
  {
    id: "2",
    clientId: "client2",
    supportId: "support",
    subject: "Billing Question",
    status: "active",
    createdAt: new Date(Date.now() - 7200000), // 2 hours ago
    lastActivity: new Date(Date.now() - 1800000), // 30 minutes ago
    messages: [
      {
        id: "1",
        text: "Hi, I have a question about my recent invoice.",
        senderId: "client2",
        timestamp: new Date(Date.now() - 7200000),
        type: "text",
      },
      {
        id: "2",
        text: "Hello! I'd be glad to help with your billing question. What would you like to know?",
        senderId: "support",
        timestamp: new Date(Date.now() - 7140000),
        type: "text",
      },
      {
        id: "3",
        text: "I was charged twice for the same service this month.",
        senderId: "client2",
        timestamp: new Date(Date.now() - 7080000),
        type: "text",
      },
    ],
    lastMessage: {
      id: "3",
      text: "I was charged twice for the same service this month.",
      senderId: "client2",
      timestamp: new Date(Date.now() - 7080000),
      type: "text",
    },
  },
  {
    id: "3",
    clientId: "client3",
    supportId: "support",
    subject: "Technical Support",
    status: "closed",
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    lastActivity: new Date(Date.now() - 3600000), // 1 hour ago
    closedAt: new Date(Date.now() - 3600000),
    messages: [
      {
        id: "1",
        text: "My app keeps crashing when I try to upload files.",
        senderId: "client3",
        timestamp: new Date(Date.now() - 86400000),
        type: "text",
      },
      {
        id: "2",
        text: "I'm sorry to hear about the crashes. Let's troubleshoot this issue. What device are you using?",
        senderId: "support",
        timestamp: new Date(Date.now() - 86340000),
        type: "text",
      },
      {
        id: "3",
        text: "I'm using an iPhone 12 with iOS 16.4",
        senderId: "client3",
        timestamp: new Date(Date.now() - 86280000),
        type: "text",
      },
      {
        id: "4",
        text: "Thank you for that information. Please try updating to the latest version of the app and let me know if the issue persists.",
        senderId: "support",
        timestamp: new Date(Date.now() - 86220000),
        type: "text",
      },
      {
        id: "5",
        text: "That worked! Thank you so much for your help.",
        senderId: "client3",
        timestamp: new Date(Date.now() - 3660000),
        type: "text",
      },
    ],
    lastMessage: {
      id: "5",
      text: "That worked! Thank you so much for your help.",
      senderId: "client3",
      timestamp: new Date(Date.now() - 3660000),
      type: "text",
    },
  },
  {
    id: "4",
    clientId: "client",
    supportId: "support",
    subject: "Feature Request",
    status: "closed",
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    lastActivity: new Date(Date.now() - 86400000), // 1 day ago
    closedAt: new Date(Date.now() - 86400000),
    messages: [
      {
        id: "1",
        text: "Is there a way to export my data?",
        senderId: "client",
        timestamp: new Date(Date.now() - 172800000),
        type: "text",
      },
      {
        id: "2",
        text: "Yes! You can export your data from the Settings > Privacy section. Would you like me to walk you through it?",
        senderId: "support",
        timestamp: new Date(Date.now() - 172740000),
        type: "text",
      },
      {
        id: "3",
        text: "Perfect, I found it. Thanks!",
        senderId: "client",
        timestamp: new Date(Date.now() - 86460000),
        type: "text",
      },
    ],
    lastMessage: {
      id: "3",
      text: "Perfect, I found it. Thanks!",
      senderId: "client",
      timestamp: new Date(Date.now() - 86460000),
      type: "text",
    },
  },
]
