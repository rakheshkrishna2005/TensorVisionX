"use client"

import { useWebSocket } from "@/context/websocket-context"
import { CardContent, CardHeader } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

import { chartConfig as historyChartConfig } from "@/components/detection-history-chart"

const CLASS_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(historyChartConfig)
    .filter(([key, value]) => key !== 'time')
    .map(([key, value]) => [key, (value as any)?.color || "hsl(201, 96%, 58%)"])
)

interface ChartDataEntry {
  name: string;
  value: number;
  fill: string;
}

export function DetectionChart() {
  const { objectCounts, isProcessing } = useWebSocket()
  const [animatedData, setAnimatedData] = useState<ChartDataEntry[]>([])
  const [targetData, setTargetData] = useState<ChartDataEntry[]>([])
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const newData = Object.entries(objectCounts)
      .map(([name, value]) => ({ 
        name, 
        value, 
        fill: CLASS_COLORS[name as keyof typeof CLASS_COLORS] || CLASS_COLORS.default 
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)

    const total = newData.reduce((sum, item) => sum + item.value, 0)
    setTotalCount(total)
    setTargetData(newData)
  }, [objectCounts])

  useEffect(() => {
    if (targetData.length === 0) {
      setAnimatedData([])
      return
    }

    const targetDataString = JSON.stringify(targetData)
    
    let animationFrameId: number | null = null
    let isAnimating = true

    if (animatedData.length === 0) {
      setAnimatedData(targetData.map(item => ({ ...item, value: 0 })))
      const timeoutId = setTimeout(() => {
        if (isAnimating) {
          setAnimatedData(targetData)
        }
      }, 50)
      return () => {
        clearTimeout(timeoutId)
        isAnimating = false
      }
    }

    const animate = () => {
      if (!isAnimating) return

      setAnimatedData(current => {
        const newData = [...current]
        let hasChanges = false

        targetData.forEach(target => {
          const existingItem = newData.find(item => item.name === target.name)
          if (existingItem) {
            const diff = target.value - existingItem.value
            if (Math.abs(diff) > 0.1) {
              existingItem.value += diff * 0.2
              hasChanges = true
            } else {
              existingItem.value = target.value
            }
          }
        })

        targetData.forEach(target => {
          if (!newData.some(item => item.name === target.name)) {
            newData.push({ ...target, value: 0 })
            hasChanges = true
          }
        })

        const result = newData
          .filter(item => targetData.some(t => t.name === item.name))
          .sort((a, b) => b.value - a.value)

        if (hasChanges && isAnimating) {
          animationFrameId = requestAnimationFrame(animate)
        }

        return result
      })
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      isAnimating = false
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [targetData.length, JSON.stringify(targetData)])

  const chartConfig = {
    value: {
      label: "Count",
      color: "hsl(346, 84%, 61%)",
    },
  }

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="flex justify-center pb-2">
        <Badge 
          variant="outline" 
          className="inline-flex justify-center min-w-[180px] px-4 py-1.5 text-sm bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
        >
          Object Distribution
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 p-2 min-h-[250px]">
        {animatedData.length > 0 || isProcessing ? (
          <ChartContainer config={chartConfig} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={animatedData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={2}
                >
                  {animatedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg shadow-sm border bg-white/50 backdrop-blur-sm">
                          <div className="p-2" style={{ backgroundColor: `${data.fill}2` }}>
                            <div className="flex flex-wrap gap-2">
                              <Badge 
                                className="px-3 py-1 font-medium"
                                style={{ 
                                  backgroundColor: `${data.fill}15`,
                                  color: `${data.fill}95`
                                }}
                              >
                                {data.name} • {Math.round(data.value)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-current font-bold text-2xl"
                >
                  {totalCount}
                </text>
                <text
                  x="50%"
                  y="60%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-current text-sm opacity-70"
                >
                  Objects
                </text>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">No detection data</p>
          </div>
        )}
      </CardContent>
    </div>
  )
}
