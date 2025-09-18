"use client"

import { createContext, useContext, useState } from "react"

const NavigationContext = createContext()

export function NavigationProvider({ children }) {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [navigationStack, setNavigationStack] = useState(["dashboard"])
  const [chargingFlow, setChargingFlow] = useState({
    selectedCharger: null,
    step: null, // 'quantity', 'payment', 'charging'
    quantity: 0,
    estimatedTime: 0,
    estimatedCost: 0,
  })

  const navigateTo = (page, data = null) => {
    setNavigationStack((prev) => [...prev, page])
    setCurrentPage(page)
    if (data) {
      if (page.includes("charging")) {
        setChargingFlow((prev) => ({ ...prev, ...data }))
      }
    }
  }

  const goBack = () => {
    if (navigationStack.length > 1) {
      const newStack = navigationStack.slice(0, -1)
      setNavigationStack(newStack)
      setCurrentPage(newStack[newStack.length - 1])
    }
  }

  const resetNavigation = () => {
    setNavigationStack(["dashboard"])
    setCurrentPage("dashboard")
    setChargingFlow({
      selectedCharger: null,
      step: null,
      quantity: 0,
      estimatedTime: 0,
      estimatedCost: 0,
    })
  }

  return (
    <NavigationContext.Provider
      value={{
        currentPage,
        navigationStack,
        chargingFlow,
        navigateTo,
        goBack,
        resetNavigation,
        setChargingFlow,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export const useNavigation = () => {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider")
  }
  return context
}
