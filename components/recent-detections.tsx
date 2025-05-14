"use client"

import { useWebSocket } from "@/context/websocket-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export function RecentDetections() {
  const { recentDetections } = useWebSocket()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Detections</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[220px]">
          {recentDetections.length > 0 ? (
            <div className="space-y-2">
              {recentDetections.map((detection, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">
                      {detection.count}
                    </Badge>
                    <span className="font-medium">{detection.class}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{detection.time}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No recent detections</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
