"use client"

import { Activity, Layers, Target } from "lucide-react"
import { useWebSocket } from "@/context/websocket-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface KpiCardsProps {
  frameRate: number
}

export function KpiCards({ frameRate }: KpiCardsProps) {
  const { objectCounts, uniqueClasses } = useWebSocket()

  const totalObjects = Object.values(objectCounts).reduce((sum, count) => sum + count, 0)

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-rose-50 dark:bg-rose-950/30 dark:border-rose-900/20 border-[1.5px]">
        <CardContent className="p-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-rose-700 dark:text-rose-400">Tracked Objects</p>
              <Target className="h-5 w-5 text-rose-500 dark:text-rose-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-rose-700 dark:text-rose-400">{totalObjects}</h3>
              <Badge
                variant="outline"
                className="bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-400 border-0"
              >
                {totalObjects > 10 ? "High" : totalObjects > 0 ? "Low" : "None"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900/20 border-[1.5px]">
        <CardContent className="p-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Frame Rate</p>
              <Activity className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                {frameRate} <span className="text-sm font-normal">FPS</span>
              </h3>
              <Badge
                variant="outline"
                className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400 border-0"
              >
                {frameRate > 25 ? "High" : frameRate > 15 ? "Medium" : frameRate > 0 ? "Low" : "None"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-violet-50 dark:bg-violet-950/30 dark:border-violet-900/20 border-[1.5px]">
        <CardContent className="p-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-violet-700 dark:text-violet-400">Detected Classes</p>
              <Layers className="h-5 w-5 text-violet-500 dark:text-violet-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-violet-700 dark:text-violet-400">{uniqueClasses}</h3>
              <Badge
                variant="outline"
                className="bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-400 border-0"
              >
                Types
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
