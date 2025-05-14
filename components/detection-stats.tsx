"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWebSocket } from "@/context/websocket-context"

export function DetectionStats() {
  const { objectCounts, totalDetections, uniqueClasses } = useWebSocket()

  let mostDetectedObject = { name: "None", count: 0 }
  Object.entries(objectCounts).forEach(([name, count]) => {
    if (count > mostDetectedObject.count) {
      mostDetectedObject = { name, count }
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detection Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <StatItem label="Total Detections" value={totalDetections} />
          <StatItem label="Unique Classes" value={uniqueClasses} />
          <StatItem
            label="Most Detected"
            value={mostDetectedObject.name !== "None" ? mostDetectedObject.name : "N/A"}
            subValue={mostDetectedObject.count > 0 ? `Count: ${mostDetectedObject.count}` : ""}
          />
          <StatItem
            label="Detection Rate"
            value={totalDetections > 0 ? "Active" : "Idle"}
            subValue={totalDetections > 10 ? "High" : totalDetections > 0 ? "Low" : "None"}
          />
        </div>
      </CardContent>
    </Card>
  )
}

interface StatItemProps {
  label: string
  value: string | number
  subValue?: string
}

function StatItem({ label, value, subValue }: StatItemProps) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-2xl font-bold">{value}</span>
      {subValue && <span className="text-xs text-muted-foreground">{subValue}</span>}
    </div>
  )
}
