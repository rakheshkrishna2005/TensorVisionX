"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import * as cocoSsd from "@tensorflow-models/coco-ssd"
import "@tensorflow/tfjs"
import { Camera, ImageUp, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClassSelector } from "@/components/class-selector"
import { useWebSocket } from "@/context/websocket-context"

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

export function ObjectDetection() {
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("webcam")
  const [selectedClasses, setSelectedClasses] = useState<string[]>(COCO_CLASSES)
  const [isDetecting, setIsDetecting] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function loadModel() {
      try {
        const loadedModel = await cocoSsd.load()
        setModel(loadedModel)
        setLoading(false)
      } catch (error) {
        console.error("Failed to load model:", error)
        setLoading(false)
      }
    }

    loadModel()

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        const tracks = stream.getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  useEffect(() => {
    if (activeTab === "webcam" && !loading && model) {
      setupWebcam()
    }
  }, [activeTab, loading, model])

  async function setupWebcam() {
    if (!videoRef.current) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })

      videoRef.current.srcObject = stream
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
          videoRef.current.play()

          if (canvasRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth
            canvasRef.current.height = videoRef.current.videoHeight
          }

          detectFromVideo()
        }
      }
    } catch (error) {
      console.error("Error accessing webcam:", error)
    }
  }

  async function detectFromVideo() {
    if (!model || !videoRef.current || !canvasRef.current || !videoRef.current.videoWidth) {
      return
    }

    setIsDetecting(true)

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    const { updateObjectCounts } = useWebSocket()

    const detect = async () => {
      if (!model || !video || !canvas || activeTab !== "webcam") {
        setIsDetecting(false)
        return
      }

      const predictions = await model.detect(video)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      const filteredPredictions = predictions.filter((prediction) => selectedClasses.includes(prediction.class))

      drawPredictions(ctx, filteredPredictions)

      const counts: Record<string, number> = {}
      filteredPredictions.forEach((prediction) => {
        counts[prediction.class] = (counts[prediction.class] || 0) + 1
      })
      updateObjectCounts(counts)

      requestAnimationFrame(detect)
    }

    detect()
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      if (imageRef.current && e.target?.result) {
        imageRef.current.src = e.target.result as string
        imageRef.current.onload = () => detectFromImage()
      }
    }
    reader.readAsDataURL(file)
  }

  async function detectFromImage() {
    if (!model || !imageRef.current || !canvasRef.current) return

    const image = imageRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    const { updateObjectCounts } = useWebSocket()

    canvas.width = image.width
    canvas.height = image.height

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    const predictions = await model.detect(image)

    const filteredPredictions = predictions.filter((prediction) => selectedClasses.includes(prediction.class))

    drawPredictions(ctx, filteredPredictions)

    const counts: Record<string, number> = {}
    filteredPredictions.forEach((prediction) => {
      counts[prediction.class] = (counts[prediction.class] || 0) + 1
    })
    updateObjectCounts(counts)
  }

  function drawPredictions(ctx: CanvasRenderingContext2D, predictions: cocoSsd.DetectedObject[]) {
    predictions.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox

      ctx.strokeStyle = "#10b981"
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, width, height)

      ctx.fillStyle = "#10b981"
      const textWidth = ctx.measureText(`${prediction.class} ${Math.round(prediction.score * 100)}%`).width
      ctx.fillRect(x, y - 20, textWidth + 10, 20)

      ctx.fillStyle = "#ffffff"
      ctx.font = "16px sans-serif"
      ctx.fillText(`${prediction.class} ${Math.round(prediction.score * 100)}%`, x + 5, y - 5)
    })
  }

  function handleTabChange(value: string) {
    setActiveTab(value)

    if (value !== "webcam" && videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsDetecting(false)
    }
  }

  function triggerFileInput() {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-3xl mb-6">
        <ClassSelector
          allClasses={COCO_CLASSES}
          selectedClasses={selectedClasses}
          setSelectedClasses={setSelectedClasses}
        />
      </div>

      {loading ? (
        <Card className="w-full max-w-3xl aspect-video flex items-center justify-center">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Loading TensorFlow.js model...</p>
            <p className="text-sm text-muted-foreground">This may take a moment</p>
          </CardContent>
        </Card>
      ) : (
        <div className="w-full max-w-3xl">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="webcam" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Webcam
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <ImageUp className="h-4 w-4" />
                Upload Image
              </TabsTrigger>
            </TabsList>

            <TabsContent value="webcam" className="mt-0">
              <Card className="overflow-hidden">
                <CardContent className="p-0 relative">
                  <video ref={videoRef} className="hidden" playsInline />
                  <canvas ref={canvasRef} className="w-full aspect-video object-cover" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload" className="mt-0">
              <Card className="overflow-hidden">
                <CardContent className="p-6 flex flex-col items-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Button onClick={triggerFileInput} className="mb-4" variant="outline">
                    <ImageUp className="mr-2 h-4 w-4" />
                    Select Image
                  </Button>
                  <div className="relative w-full">
                    <img ref={imageRef} className="hidden" />
                    <canvas
                      ref={canvasRef}
                      className={cn(
                        "w-full object-contain mx-auto border border-dashed rounded-lg",
                        activeTab === "upload" && "min-h-[300px]",
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
