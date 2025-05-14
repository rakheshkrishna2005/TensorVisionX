"use client"

import { useWebSocket } from "@/context/websocket-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function DetectionsTable() {
  const { objectCounts } = useWebSocket()

  const detections = Object.entries(objectCounts)
    .map(([className, count]) => ({
      className,
      count,
      density:
        Object.values(objectCounts).reduce((sum, c) => sum + c, 0) > 0
          ? Math.round((count / Object.values(objectCounts).reduce((sum, c) => sum + c, 0)) * 100)
          : 0,
    }))
    .sort((a, b) => b.count - a.count)

  const getCountBadgeVariant = (count: number) => {
    if (count >= 10) return "high"
    if (count >= 5) return "medium"
    return "low"
  }

  const getCountBadgeText = (count: number) => {
    if (count >= 10) return "High"
    if (count >= 5) return "Medium"
    return "Low"
  }

  const getBadgeStyles = (variant: string) => {
    switch (variant) {
      case "high":
        return "bg-rose-500 text-white hover:bg-rose-600"
      case "medium":
        return "bg-amber-500 text-white hover:bg-amber-600"
      case "low":
        return "bg-emerald-500 text-white hover:bg-emerald-600"
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Current Detections</CardTitle>
      </CardHeader>
      <CardContent>
        {detections.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Class Name</TableHead>
                  <TableHead className="w-[30%]">Count</TableHead>
                  <TableHead className="w-[30%]">Density</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detections.map((detection) => (
                  <TableRow key={detection.className}>
                    <TableCell className="font-medium capitalize">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                        {detection.className}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {detection.count}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="h-2 rounded-full bg-primary" style={{ width: `${detection.density}%` }}></div>
                        </div>
                        <Badge className={getBadgeStyles(getCountBadgeVariant(detection.count))}>
                          {getCountBadgeText(detection.count)}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
            <p className="text-muted-foreground">No detections yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
