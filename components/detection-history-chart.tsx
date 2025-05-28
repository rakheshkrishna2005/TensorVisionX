"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useWebSocket } from "@/context/websocket-context"
import { Badge } from "@/components/ui/badge"

export const chartConfig: Record<string, any> = {person: {label: "Person", color: "hsl(262, 83%, 58%)"}, bicycle: {label: "Bicycle", color: "hsl(221, 83%, 53%)"}, car: {label: "Car", color: "hsl(142, 71%, 45%)"}, motorcycle: {label: "Motorcycle", color: "hsl(346, 84%, 61%)"}, airplane: {label: "Airplane", color: "hsl(43, 96%, 58%)"}, bus: {label: "Bus", color: "hsl(168, 76%, 42%)"}, train: {label: "Train", color: "hsl(201, 96%, 58%)"}, truck: {label: "Truck", color: "hsl(30, 100%, 50%)"}, boat: {label: "Boat", color: "hsl(120, 100%, 25%)"}, "traffic light": {label: "Traffic Light", color: "hsl(60, 100%, 50%)"}, "fire hydrant": {label: "Fire Hydrant", color: "hsl(0, 100%, 50%)"}, "stop sign": {label: "Stop Sign", color: "hsl(300, 100%, 25%)"}, "parking meter": {label: "Parking Meter", color: "hsl(150, 100%, 25%)"}, bench: {label: "Bench", color: "hsl(210, 100%, 25%)"}, bird: {label: "Bird", color: "hsl(330, 100%, 25%)"}, cat: {label: "Cat", color: "hsl(90, 100%, 25%)"}, dog: {label: "Dog", color: "hsl(270, 100%, 25%)"}, horse: {label: "Horse", color: "hsl(30, 100%, 25%)"}, sheep: {label: "Sheep", color: "hsl(180, 100%, 25%)"}, cow: {label: "Cow", color: "hsl(0, 100%, 25%)"}, elephant: {label: "Elephant", color: "hsl(120, 100%, 25%)"}, bear: {label: "Bear", color: "hsl(240, 100%, 25%)"}, zebra: {label: "Zebra", color: "hsl(60, 100%, 25%)"}, giraffe: {label: "Giraffe", color: "hsl(300, 100%, 25%)"}, backpack: {label: "Backpack", color: "hsl(150, 100%, 25%)"}, umbrella: {label: "Umbrella", color: "hsl(210, 100%, 25%)"}, handbag: {label: "Handbag", color: "hsl(330, 100%, 25%)"}, tie: {label: "Tie", color: "hsl(90, 100%, 25%)"}, suitcase: {label: "Suitcase", color: "hsl(270, 100%, 25%)"}, frisbee: {label: "Frisbee", color: "hsl(30, 100%, 25%)"}, skis: {label: "Skis", color: "hsl(180, 100%, 25%)"}, snowboard: {label: "Snowboard", color: "hsl(0, 100%, 25%)"}, "sports ball": {label: "Sports Ball", color: "hsl(120, 100%, 25%)"}, kite: {label: "Kite", color: "hsl(240, 100%, 25%)"}, "baseball bat": {label: "Baseball Bat", color: "hsl(60, 100%, 25%)"}, "baseball glove": {label: "Baseball Glove", color: "hsl(300, 100%, 25%)"}, skateboard: {label: "Skateboard", color: "hsl(150, 100%, 25%)"}, surfboard: {label: "Surfboard", color: "hsl(210, 100%, 25%)"}, "tennis racket": {label: "Tennis Racket", color: "hsl(330, 100%, 25%)"}, bottle: {label: "Bottle", color: "hsl(90, 100%, 25%)"}, "wine glass": {label: "Wine Glass", color: "hsl(270, 100%, 25%)"}, cup: {label: "Cup", color: "hsl(30, 100%, 25%)"}, fork: {label: "Fork", color: "hsl(180, 100%, 25%)"}, knife: {label: "Knife", color: "hsl(0, 100%, 25%)"}, spoon: {label: "Spoon", color: "hsl(120, 100%, 25%)"}, bowl: {label: "Bowl", color: "hsl(240, 100%, 25%)"}, banana: {label: "Banana", color: "hsl(60, 100%, 25%)"}, apple: {label: "Apple", color: "hsl(300, 100%, 25%)"}, sandwich: {label: "Sandwich", color: "hsl(150, 100%, 25%)"}, orange: {label: "Orange", color: "hsl(210, 100%, 25%)"}, broccoli: {label: "Broccoli", color: "hsl(330, 100%, 25%)"}, carrot: {label: "Carrot", color: "hsl(90, 100%, 25%)"}, "hot dog": {label: "Hot Dog", color: "hsl(270, 100%, 25%)"}, pizza: {label: "Pizza", color: "hsl(30, 100%, 25%)"}, donut: {label: "Donut", color: "hsl(180, 100%, 25%)"}, cake: {label: "Cake", color: "hsl(0, 100%, 25%)"}, chair: {label: "Chair", color: "hsl(120, 100%, 25%)"}, couch: {label: "Couch", color: "hsl(240, 100%, 25%)"}, "potted plant": {label: "Potted Plant", color: "hsl(60, 100%, 25%)"}, bed: {label: "Bed", color: "hsl(300, 100%, 25%)"}, "dining table": {label: "Dining Table", color: "hsl(150, 100%, 25%)"}, toilet: {label: "Toilet", color: "hsl(210, 100%, 25%)"}, tv: {label: "TV", color: "hsl(330, 100%, 25%)"}, laptop: {label: "Laptop", color: "hsl(90, 100%, 25%)"}, mouse: {label: "Mouse", color: "hsl(270, 100%, 25%)"}, remote: {label: "Remote", color: "hsl(30, 100%, 25%)"}, keyboard: {label: "Keyboard", color: "hsl(180, 100%, 25%)"}, "cell phone": {label: "Cell Phone", color: "hsl(0, 100%, 25%)"}, microwave: {label: "Microwave", color: "hsl(120, 100%, 25%)"}, oven: {label: "Oven", color: "hsl(240, 100%, 25%)"}, toaster: {label: "Toaster", color: "hsl(60, 100%, 25%)"}, sink: {label: "Sink", color: "hsl(300, 100%, 25%)"}, refrigerator: {label: "Refrigerator", color: "hsl(150, 100%, 25%)"}, book: {label: "Book", color: "hsl(210, 100%, 25%)"}, clock: {label: "Clock", color: "hsl(330, 100%, 25%)"}, vase: {label: "Vase", color: "hsl(90, 100%, 25%)"}, scissors: {label: "Scissors", color: "hsl(270, 100%, 25%)"}, "teddy bear": {label: "Teddy Bear", color: "hsl(30, 100%, 25%)"}, "hair drier": {label: "Hair Drier", color: "hsl(180, 100%, 25%)"}, toothbrush: {label: "Toothbrush", color: "hsl(0, 100%, 25%)"}, time: {label: "Time"}};

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
