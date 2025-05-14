"use client"

import { useWebSocket } from "@/context/websocket-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

type AnimationState = 'entering' | 'exiting' | 'stable'

interface Detection {
  class: string
  count: number
  percentage: number
  state: AnimationState
}

export function DetectionTable() {
  const { objectCounts } = useWebSocket()
  const [detections, setDetections] = useState<Detection[]>([])

  useEffect(() => {
    const totalObjects = Object.values(objectCounts).reduce((sum, count) => sum + count, 0)
    
    const newDetections = Object.entries(objectCounts)
      .map(([className, count]): Detection => ({
        class: className,
        count,
        percentage: totalObjects > 0 ? (count / totalObjects) * 100 : 0,
        state: 'entering'
      }))
      .sort((a, b) => b.count - a.count)

    const combinedDetections: Detection[] = [
      ...newDetections.map(det => ({
        ...det,
        state: detections.find(d => d.class === det.class) ? ('stable' as const) : ('entering' as const)
      })),
      ...detections
        .filter(prev => !newDetections.find(curr => curr.class === prev.class))
        .map(prev => ({ ...prev, state: 'exiting' as AnimationState }))
    ]

    setDetections(combinedDetections)

    // Clean up exited items after animation
    const timeoutId = setTimeout(() => {
      setDetections(prev => prev.filter(item => item.state !== 'exiting'))
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [objectCounts])

  const getDensityBadge = (percentage: number) => {
    if (percentage >= 40) {
      return (
        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 transition-colors">High</Badge>
      )
    } else if (percentage >= 20) {
      return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 transition-colors">Medium</Badge>
    } else {
      return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 transition-colors">Low</Badge>
    }
  }

  const getClassColor = (className: string) => {
    const colorMap: Record<string, string> = {
      person: "bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400",
      car: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      truck: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
      bus: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
      motorcycle: "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400",
      bicycle: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400",
    }

    return colorMap[className] || "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400"
  }

  return (
    <Card className="overflow-hidden bg-white dark:bg-blue-950/30 dark:border-blue-900/20">
      <CardHeader className="pb-6">
        <div className="flex justify-center">
          <Badge 
            variant="outline" 
            className="inline-flex justify-center min-w-[180px] px-4 py-1.5 text-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/30"
          >
            Detection Results
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-6">
        <div className="relative">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent dark:text-blue-100 border-blue-900/20">
                <TableHead className="text-center w-1/4 py-4">Class</TableHead>
                <TableHead className="text-center w-1/4 py-4">Count</TableHead>
                <TableHead className="text-center w-1/4 py-4">Percentage</TableHead>
                <TableHead className="text-center w-1/4 py-4">Density</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detections.map((item) => (
                <TableRow 
                  key={item.class}
                  className="transition-all duration-300 ease-in-out hover:bg-transparent"
                  style={{
                    opacity: item.state === 'exiting' ? 0 : 1,
                    transform: item.state === 'entering' 
                      ? 'translateY(-10px)' 
                      : item.state === 'exiting'
                        ? 'translateY(10px)'
                        : 'translateY(0)'
                  }}
                >
                  <TableCell className="text-center py-4">
                    <Badge className={`${getClassColor(item.class)} transition-colors`}>
                      {item.class}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-center py-4">
                    {item.count}
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <Badge 
                      variant="outline" 
                      className="bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400 transition-colors"
                    >
                      {item.percentage.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    {getDensityBadge(item.percentage)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {detections.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center rounded-md border border-dashed bg-background/50 backdrop-blur-sm">
              <p className="text-muted-foreground">No detections yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
