"use client"

import { createContext, useContext, useState, type ReactNode, useCallback } from "react"

interface Detection {
  class: string
  count: number
  time: string
}

interface WebSocketContextType {
  objectCounts: Record<string, number>
  updateObjectCounts: (counts: Record<string, number>) => void
  recentDetections: Detection[]
  totalDetections: number
  uniqueClasses: number
  isProcessing: boolean
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [objectCounts, setObjectCounts] = useState<Record<string, number>>({})
  const [recentDetections, setRecentDetections] = useState<Detection[]>([])
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const totalDetections = Object.values(objectCounts).reduce((sum, count) => sum + count, 0)

  const uniqueClasses = Object.keys(objectCounts).length

  const updateObjectCounts = useCallback((counts: Record<string, number>) => {
    setIsProcessing(true)
    setObjectCounts(counts)

    const newDetections = Object.entries(counts).map(([className, count]) => ({
      class: className,
      count,
      time: new Date().toLocaleTimeString(),
    }))

    setRecentDetections((prev) => {
      const combined = [...newDetections, ...prev]
      return combined.slice(0, 10)
    })
  }, [])

  return (
    <WebSocketContext.Provider
      value={{
        objectCounts,
        updateObjectCounts,
        recentDetections,
        totalDetections,
        uniqueClasses,
        isProcessing,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}
