"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import * as cocoSsd from "@tensorflow-models/coco-ssd"
import "@tensorflow/tfjs"
import { Badge, Camera, Loader2, Video } from "lucide-react"
import { useWebSocket } from "@/context/websocket-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClassSelector } from "@/components/class-selector"

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

interface ObjectDetectionPanelProps {
  setDetectionHistory: React.Dispatch<React.SetStateAction<any[]>>
  selectedClasses?: string[]
  setSelectedClasses?: (classes: string[]) => void
  hideClassSelector?: boolean
  setFrameRate?: (frameRate: number) => void
  addObjectURL?: (url: string) => void
  clearCache?: () => void
}

export function ObjectDetectionPanel({
  setDetectionHistory,
  selectedClasses = COCO_CLASSES,
  setSelectedClasses,
  hideClassSelector = false,
  setFrameRate = () => {},
  addObjectURL = () => {},
  clearCache = () => {},
}: ObjectDetectionPanelProps) {
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("webcam")
  const [isDetecting, setIsDetecting] = useState(false)
  const [webcamActive, setWebcamActive] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const lastUpdateRef = useRef<number>(Date.now())
  const historyIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const videoFileInputRef = useRef<HTMLInputElement>(null)
  const uploadedVideoRef = useRef<HTMLVideoElement>(null)
  const videoObjectURLRef = useRef<string | null>(null)

  const frameTimesRef = useRef<number[]>([])
  const lastFrameTimeRef = useRef<number>(performance.now())
  const frameRateIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const { updateObjectCounts } = useWebSocket()

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
      stopWebcam()

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      if (historyIntervalRef.current) {
        clearInterval(historyIntervalRef.current)
      }

      if (frameRateIntervalRef.current) {
        clearInterval(frameRateIntervalRef.current)
      }

      if (videoObjectURLRef.current) {
        URL.revokeObjectURL(videoObjectURLRef.current)
      }
    }
  }, [])

  useEffect(() => {
    historyIntervalRef.current = setInterval(() => {
      setDetectionHistory((prev) => {
        const newHistory = [...prev]
        if (newHistory.length > 100) {
          newHistory.shift()
        }
        return newHistory
      })
    }, 60000)

    return () => {
      if (historyIntervalRef.current) {
        clearInterval(historyIntervalRef.current)
      }
    }
  }, [setDetectionHistory])

  useEffect(() => {
    frameRateIntervalRef.current = setInterval(() => {
      if (frameTimesRef.current.length > 0) {
        const now = performance.now()
        const recentFrames = frameTimesRef.current.filter((time) => now - time < 1000)

        if (recentFrames.length > 1) {
          const calculatedFPS = Math.round(recentFrames.length)
          setFrameRate(calculatedFPS)
        }

        frameTimesRef.current = recentFrames
      } else if (!isDetecting) {
        setFrameRate(0)
      }
    }, 1000)

    return () => {
      if (frameRateIntervalRef.current) {
        clearInterval(frameRateIntervalRef.current)
      }
    }
  }, [setFrameRate, isDetecting, activeTab])

  useEffect(() => {
    const handleClearFileInputs = () => {
      if (videoFileInputRef.current) {
        videoFileInputRef.current.value = ""
      }

      if (uploadedVideoRef.current) {
        uploadedVideoRef.current.src = ""
        uploadedVideoRef.current.pause()
      }

      if (videoObjectURLRef.current) {
        URL.revokeObjectURL(videoObjectURLRef.current)
        videoObjectURLRef.current = null
      }

      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        }
      }

      frameTimesRef.current = []
      setFrameRate(0)

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }

      setIsDetecting(false)
    }

    window.addEventListener("clearFileInputs", handleClearFileInputs)

    return () => {
      window.removeEventListener("clearFileInputs", handleClearFileInputs)
    }
  }, [setFrameRate])

  useEffect(() => {
    if (activeTab === "webcam" && webcamActive && !loading && model) {
      setupWebcam()
    }
  }, [activeTab, webcamActive, loading, model])

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
      setWebcamActive(false)
    }
  }

  function stopWebcam() {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsDetecting(false)
      setWebcamActive(false)

      frameTimesRef.current = []
      setFrameRate(0)
      
      clearCache()
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

    const detect = async () => {
      if (!model || !video || !canvas || activeTab !== "webcam" || !webcamActive) {
        setIsDetecting(false)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = null
        }
        return
      }

      const now = performance.now()
      frameTimesRef.current.push(now)
      lastFrameTimeRef.current = now

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

      const timeNow = Date.now()
      if (timeNow - lastUpdateRef.current > 2000) {
        lastUpdateRef.current = timeNow
        const time = new Date().toLocaleTimeString()
        setDetectionHistory((prev) => {
          const newEntry = { time, ...counts }
          return [...prev, newEntry]
        })
      }

      animationRef.current = requestAnimationFrame(detect)
    }

    detect()
  }

  async function detectFromUploadedVideo() {
    if (!model || !uploadedVideoRef.current || !canvasRef.current) return

    const video = uploadedVideoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    frameTimesRef.current = []

    const detectFrame = async () => {
      if (!model || !video || !canvas || activeTab !== "video" || video.paused || video.ended) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = null
        }
        return
      }

      const now = performance.now()
      frameTimesRef.current.push(now)
      lastFrameTimeRef.current = now

      const predictions = await model.detect(video)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const filteredPredictions = predictions.filter((prediction) => selectedClasses.includes(prediction.class))

      drawPredictions(ctx, filteredPredictions)

      const counts: Record<string, number> = {}
      filteredPredictions.forEach((prediction) => {
        counts[prediction.class] = (counts[prediction.class] || 0) + 1
      })
      updateObjectCounts(counts)

      const now2 = Date.now()
      if (now2 - lastUpdateRef.current > 2000) {
        lastUpdateRef.current = now2
        const time = new Date().toLocaleTimeString()
        setDetectionHistory((prev) => {
          const newEntry = { time, ...counts }
          return [...prev, newEntry]
        })
      }

      animationRef.current = requestAnimationFrame(detectFrame)
    }

    detectFrame()
  }

  function drawPredictions(ctx: CanvasRenderingContext2D, predictions: cocoSsd.DetectedObject[]) {
    predictions.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox

      ctx.strokeStyle = "#ef4444"
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, width, height)

      ctx.fillStyle = "#ef4444"
      const textWidth = ctx.measureText(`${prediction.class} ${Math.round(prediction.score * 100)}%`).width
      ctx.fillRect(x, y - 20, textWidth + 10, 20)

      ctx.fillStyle = "#ffffff"
      ctx.font = "16px sans-serif"
      ctx.fillText(`${prediction.class} ${Math.round(prediction.score * 100)}%`, x + 5, y - 5)
    })
  }

  function handleTabChange(value: string) {
    setActiveTab(value)

    if (value !== "webcam") {
      stopWebcam()
    }

    if (value !== "video" && uploadedVideoRef.current) {
      uploadedVideoRef.current.pause()
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    frameTimesRef.current = []
    if (value === "upload") {
      setFrameRate(0)
    }
  }

  function triggerVideoFileInput() {
    videoFileInputRef.current?.click()
  }

  function handleVideoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (videoObjectURLRef.current) {
      URL.revokeObjectURL(videoObjectURLRef.current)
    }

    const videoURL = URL.createObjectURL(file)
    videoObjectURLRef.current = videoURL

    addObjectURL(videoURL)

    if (uploadedVideoRef.current) {
      uploadedVideoRef.current.src = videoURL
      uploadedVideoRef.current.onloadedmetadata = () => {
        if (canvasRef.current && uploadedVideoRef.current) {
          canvasRef.current.width = uploadedVideoRef.current.videoWidth
          canvasRef.current.height = uploadedVideoRef.current.videoHeight
        }
      }
    }
  }

  function toggleWebcam() {
    if (webcamActive) {
      stopWebcam()
    } else {
      setWebcamActive(true)
    }
  }

  return (
    <div className="p-4 h-full flex flex-col">
      {!hideClassSelector && (
        <div className="mb-4">
          <ClassSelector
            allClasses={COCO_CLASSES}
            selectedClasses={selectedClasses}
            setSelectedClasses={setSelectedClasses || (() => {})}
          />
        </div>
      )}

      {loading ? (
        <div className="relative w-full aspect-video">
          <div className="absolute inset-0 flex items-center justify-center rounded-md border border-dashed bg-gray-50 dark:bg-gray-800">
            <div className="flex flex-col items-center justify-center p-6">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg font-bold text-black-900">Provisioning Model</p>
              <p className="text-sm text-muted-foreground">This may take a moment</p>
            </div>
          </div>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted/50">
            <TabsTrigger value="webcam" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Webcam
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Upload Video
            </TabsTrigger>
          </TabsList>

          <TabsContent value="webcam" className="mt-0">
            <div className="relative w-full aspect-video">
              <div className="absolute inset-0 overflow-hidden rounded-md border shadow-inner bg-black">
                <video ref={videoRef} className="hidden" playsInline />
                <canvas ref={canvasRef} className="w-full h-full object-contain" />
                {!webcamActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95">
                    <Camera className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-foreground">Webcam is turned off</p>
                    <p className="text-sm text-muted-foreground">Click the button below to start the webcam</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Button onClick={toggleWebcam} variant={webcamActive ? "destructive" : "default"}>
                {webcamActive ? "Stop Webcam" : "Start Webcam"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="video" className="mt-0">
            <div className="relative w-full aspect-video">
              <div className="absolute inset-0 overflow-hidden rounded-md border shadow-inner">
                <video
                  ref={uploadedVideoRef}
                  className="w-full h-full object-contain bg-black"
                  controls
                  crossOrigin="anonymous"
                  onPlay={() => detectFromUploadedVideo()}
                  onPause={() => {
                    if (animationRef.current) {
                      cancelAnimationFrame(animationRef.current)
                      animationRef.current = null
                    }
                    frameTimesRef.current = []
                    setFrameRate(0)
                  }}
                />
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <input
                type="file"
                ref={videoFileInputRef}
                accept="video/*"
                className="hidden"
                onChange={handleVideoUpload}
              />
              <Button onClick={triggerVideoFileInput} variant="outline">
                <Video className="mr-2 h-4 w-4" />
                Select Video
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
