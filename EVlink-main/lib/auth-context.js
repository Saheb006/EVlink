"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem("ev-app-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password, userType) => {
    // Mock authentication - in real app, this would call an API
    const mockUser = {
      id: Date.now(),
      email,
      userType, // 'ev-owner' or 'charger-owner'
      name: email.split("@")[0],
      createdAt: new Date().toISOString(),
    }

    setUser(mockUser)
    localStorage.setItem("ev-app-user", JSON.stringify(mockUser))
    return mockUser
  }

  const signup = async (email, password, userType, name) => {
    // Mock signup - in real app, this would call an API
    const mockUser = {
      id: Date.now(),
      email,
      userType,
      name,
      createdAt: new Date().toISOString(),
    }

    setUser(mockUser)
    localStorage.setItem("ev-app-user", JSON.stringify(mockUser))
    return mockUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("ev-app-user")
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem("ev-app-user", JSON.stringify(updatedUser))
  }

  const value = {
    user,
    login,
    signup,
    logout,
    updateUser, // Added updateUser to context value
    loading,
    isAuthenticated: !!user,
    isEVOwner: user?.userType === "ev-owner",
    isChargerOwner: user?.userType === "charger-owner",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
