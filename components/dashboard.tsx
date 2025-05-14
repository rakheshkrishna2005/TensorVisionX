"use client"

import { CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { useState, useCallback, useRef } from "react"
import { WebSocketProvider } from "@/context/websocket-context"
import { Navbar } from "@/components/navbar"
import { KpiCards } from "@/components/kpi-cards"
import { ObjectDetectionPanel } from "@/components/object-detection-panel"
import { DetectionChart } from "@/components/detection-chart"
import { DetectionHistoryChart } from "@/components/detection-history-chart"
import { DetectionTable } from "@/components/detection-table"
import { Toaster } from "@/components/ui/toaster"

const COCO_CLASSES = [
  "person",
  "bicycle",
  "car",
  "motorcycle",
  "airplane",
  "bus",
  "train",
  "truck",
  "boat",
  "traffic light",
  "fire hydrant",
  "stop sign",
  "parking meter",
  "bench",
  "bird",
  "cat",
  "dog",
  "horse",
  "sheep",
  "cow",
  "elephant",
  "bear",
  "zebra",
  "giraffe",
  "backpack",
  "umbrella",
  "handbag",
  "tie",
  "suitcase",
  "frisbee",
  "skis",
  "snowboard",
  "sports ball",
  "kite",
  "baseball bat",
  "baseball glove",
  "skateboard",
  "surfboard",
  "tennis racket",
  "bottle",
  "wine glass",
  "cup",
  "fork",
  "knife",
  "spoon",
  "bowl",
  "banana",
  "apple",
  "sandwich",
  "orange",
  "broccoli",
  "carrot",
  "hot dog",
  "pizza",
  "donut",
  "cake",
  "chair",
  "couch",
  "potted plant",
  "bed",
  "dining table",
  "toilet",
  "tv",
  "laptop",
  "mouse",
  "remote",
  "keyboard",
  "cell phone",
  "microwave",
  "oven",
  "toaster",
  "sink",
  "refrigerator",
  "book",
  "clock",
  "vase",
  "scissors",
  "teddy bear",
  "hair drier",
  "toothbrush",
]

export function Dashboard() {
  const [detectionHistory, setDetectionHistory] = useState<any[]>([])
  const [selectedClasses, setSelectedClasses] = useState<string[]>(['person', 'car', 'bicycle'])
  const [frameRate, setFrameRate] = useState<number>(0)
  const objectURLsRef = useRef<string[]>([])

  const clearCache = useCallback(() => {
    setDetectionHistory([])

    setFrameRate(0)

    objectURLsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url)
      } catch (e) {
        console.error("Failed to revoke URL:", e)
      }
    })
    objectURLsRef.current = []

    if (window.caches) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName)
        })
      })
    }

    sessionStorage.clear()

    window.dispatchEvent(new CustomEvent("clearFileInputs"))

    console.log("Cache cleared")
  }, [])

  const addObjectURL = useCallback((url: string) => {
    objectURLsRef.current.push(url)
  }, [])

  return (
    <WebSocketProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar
          selectedClasses={selectedClasses}
          setSelectedClasses={setSelectedClasses}
          allClasses={COCO_CLASSES}
          clearCache={clearCache}
        />

        <main className="mx-auto px-6 md:px-8 py-6 space-y-6 flex flex-col" style={{ minHeight: "calc(100vh - 64px)" }}>
          <section>
            <KpiCards frameRate={frameRate} />
          </section>

          <section className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Card className="bg-white dark:bg-gray-900 shadow-sm lg:h-full min-h-[400px]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge 
                        variant="outline" 
                        className="inline-flex justify-center min-w-[200px] px-4 py-1.5 text-lg bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800"
                      >
                        <CardTitle className="text-base md:text-lg font-medium">Object Detection</CardTitle>
                      </Badge>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-0"
                    >
                      {frameRate > 0 ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ObjectDetectionPanel
                    setDetectionHistory={setDetectionHistory}
                    selectedClasses={selectedClasses}
                    setSelectedClasses={setSelectedClasses}
                    hideClassSelector={true}
                    setFrameRate={setFrameRate}
                    addObjectURL={addObjectURL}
                    clearCache={clearCache}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-4 grid gap-6">
              <Card className="bg-white dark:bg-gray-900 shadow-sm min-h-[300px]">
                <DetectionChart />
              </Card>
              <Card className="bg-white dark:bg-gray-900 shadow-sm min-h-[300px]">
                <DetectionHistoryChart detectionHistory={detectionHistory} />
              </Card>
            </div>
          </section>

          <section>
            <DetectionTable />
          </section>
        </main>
        <Toaster />
      </div>
    </WebSocketProvider>
  )
}