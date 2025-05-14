"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useWebSocket } from "@/context/websocket-context"
import { Badge } from "@/components/ui/badge"

export function DetectionHistoryChart({ detectionHistory }: { detectionHistory: any[] }) {
  const [chartData, setChartData] = useState<any[]>([])
  const { isProcessing } = useWebSocket()

  useEffect(() => {
    if (detectionHistory.length === 0) return

    const classCount: Record<string, number> = {}
    detectionHistory.forEach((entry) => {
      Object.keys(entry).forEach((key) => {
        if (key !== "time") {
          classCount[key] = (classCount[key] || 0) + 1
        }
      })
    })

    const topClasses = Object.entries(classCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([className]) => className)

    const processedData = detectionHistory.slice(-7).map((entry) => {
      const dataPoint: any = { time: entry.time }
      topClasses.forEach((className) => {
        dataPoint[className] = entry[className] || 0
      })
      return dataPoint
    })

    setChartData(processedData)
  }, [detectionHistory])

  const chartConfig: Record<string, any> = {
    person: {
      label: "Person",
      color: "hsl(262, 83%, 58%)", // Violet
    },
    car: {
      label: "Car",
      color: "hsl(221, 83%, 53%)", // Blue
    },
    truck: {
      label: "Truck",
      color: "hsl(142, 71%, 45%)", // Emerald
    },
    dog: {
      label: "Dog",
      color: "hsl(346, 84%, 61%)", // Rose
    },
    cat: {
      label: "Cat",
      color: "hsl(43, 96%, 58%)", // Amber
    },
    bottle: {
      label: "Bottle",
      color: "hsl(168, 76%, 42%)", // Teal
    },
    time: {
      label: "Time",
    },
  }

  const activeClasses = chartData.length > 0 ? Object.keys(chartData[0]).filter((key) => key !== "time") : []

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="flex justify-center pb-2">
        <Badge 
          variant="outline" 
          className="inline-flex justify-center min-w-[180px] px-4 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
        >
          Recent History
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 p-2 min-h-[250px]">
        {chartData.length > 0 || isProcessing ? (
          <ChartContainer config={chartConfig} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 10 }}>
                <XAxis 
                  dataKey="time" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                  padding={{ left: 20, right: 20 }}
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}`}
                  dx={-10}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg shadow-sm border bg-white/50 backdrop-blur-sm">
                          <div className="p-2 border-b" style={{ 
                              backgroundColor: `${payload[0].stroke}5`,
                              borderColor: `${payload[0].stroke}10`
                            }}>
                            <div className="text-xs font-medium" style={{ color: `${payload[0].stroke}90` }}>{label}</div>
                          </div>
                          <div className="p-2" style={{ backgroundColor: `${payload[0].stroke}2` }}>
                            <div className="flex flex-wrap gap-2">
                              {payload.map((entry: any, index: number) => (
                                <Badge 
                                  key={index}
                                  className="px-3 py-1 font-medium"
                                  style={{ 
                                    backgroundColor: `${entry.stroke}15`,
                                    color: `${entry.stroke}95`
                                  }}
                                >
                                  {entry.name} • {Math.round(entry.value)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  wrapperStyle={{
                    paddingTop: "10px",
                    marginTop: "10px"
                  }}
                />
                {activeClasses.map((className) => (
                  <Line
                    key={className}
                    type="monotone"
                    dataKey={className}
                    name={chartConfig[className]?.label || className}
                    stroke={chartConfig[className]?.color || `hsl(${Math.random() * 360}, 70%, 50%)`}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">No history data</p>
          </div>
        )}
      </CardContent>
    </div>
  )
}
