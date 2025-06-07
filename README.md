# 🎯 TensorVision X - Real-Time Object Detection Platform

- 🌐 [**Live Deployed Website**](https://tensor-vision-x.vercel.app/)
- 📺 [**TensorVisionX Web App Demo Video**](https://youtu.be/5M3eyTGb-W4)

## 📚 Table of Contents

- [Key Features](https://github.com/rakheshkrishna2005/TensorVisionX?tab=readme-ov-file#-key-features)
- [Tech Stack](https://github.com/rakheshkrishna2005/TensorVisionX?tab=readme-ov-file#️-tech-stack)
- [Core Modules](https://github.com/rakheshkrishna2005/TensorVisionX?tab=readme-ov-file#-core-modules)
- [System Architecture](https://github.com/rakheshkrishna2005/TensorVisionX?tab=readme-ov-file#️-system-architecture)
- [UI Snapshots](https://github.com/rakheshkrishna2005/TensorVisionX?tab=readme-ov-file#-ui-snapshots)
  
## 🚀 Key Features

* 📸 **Real-Time Detection** — Powered by **TensorFlow.js** COCO-SSD model
* 🎥 **Multi-Source Input** — Support for webcam, image upload, and video upload
* 📊 **Rich Analytics** — Real-time statistics, distribution charts, and historical data
* 🎨 **Modern UI** — Built with **Next.js**, **Tailwind CSS**, and **shadcn/ui**

## ⚙️ Tech Stack

| Layer      | Technologies                                               |
|------------|----------------------------------------------------------|
| 🧠 Computer Vision   | `TensorFlow.js`                         |
| 🖥️ Frontend| `Next.js`, `TypeScript`, `TailwindCSS`, `shadcn/ui`    |
| 🔒 Auth    | `JWT`, `HTTP-only Cookies`, `MongoDB`                     |
| 📊 Charts  | `Recharts`, `Custom Canvas Rendering`                     |

## 🧩 Core Modules

### 🎯 Object Detection Engine
* Real-time inference using TensorFlow.js
* Custom canvas rendering pipeline
* Playback on uploaded video feed

### 📊 Analytics Module
* Real-time metrics calculation
* Historical data aggregation
* Interactive visualization components
* Custom charting algorithms

### 🔒 Authentication System
* JWT token management
* Secure cookie handling
* Route protection middleware
* MongoDB user sessions

### 🎨 UI Components
* Responsive dashboard layout
* Real-time updates via React Context
* Dark/Light theme support
* Accessible design patterns

## 🏗️ System Architecture

```mermaid
flowchart TD
    Client["Client Browser"] --> Middleware["NextJS Middleware"]
    Middleware --> Auth{"JWT Authentication"}

    Auth -- Valid Token --> Dashboard["Dashboard Page"]
    Auth -- Invalid Token --> Login["Login Page"]

    Login -- Submit Credentials --> AuthAPI["Auth API"]
    AuthAPI -- "Set HTTP-only Cookie" --> Dashboard

    Dashboard --> ReactContextProvider["React Context API Provider"]

    WebcamFeed["Webcam Feed"] --> ObjectDetection["Object Detection Panel"]
    ImageUpload["Image Upload"] --> ObjectDetection
    VideoUpload["Video Upload"] --> ObjectDetection

    ObjectDetection --> TensorFlow["TensorFlow.js Model"]
    TensorFlow --> Canvas["Canvas Rendering"] & Detection{"Object Detection"}

    Detection --> ReactContextProvider

    ReactContextProvider --> UpdateCounts["Update Object Counts"]
    ReactContextProvider --> KPICards["KPI Cards"]
    ReactContextProvider --> DetectionChart["Object Distribution Chart"]
    ReactContextProvider --> HistoryChart["Detection History Chart"]
    ReactContextProvider --> DetectionTable["Detection Table"]

    UpdateCounts --> DetectionHistory["Detection History"]

    KPICards --> TrackedObjects["Tracked Objects"]
    KPICards --> FrameRate["Frame Rate"]
    KPICards --> DetectedClasses["Detected Classes"]

    AuthAPI --> MongoDB[("MongoDB")]

    %% Class Assignments
    class Auth,Login,AuthAPI auth
    class WebcamFeed,ImageUpload,VideoUpload input
    class ObjectDetection,TensorFlow,Canvas,Detection processing
    class KPICards,TrackedObjects,FrameRate,DetectedClasses kpi
    class DetectionChart,HistoryChart,DetectionTable visualization

    %% Updated Class Definitions for Dark/Light Mode Visibility
    classDef auth fill:#e0b3ff,stroke:#6a1b9a,color:#000,font-weight:bold
    classDef input fill:#bbdefb,stroke:#1e88e5,color:#000,font-weight:bold
    classDef processing fill:#c8e6c9,stroke:#388e3c,color:#000,font-weight:bold
    classDef visualization fill:#fff59d,stroke:#fbc02d,color:#000,font-weight:bold
    classDef kpi fill:#f8bbd0,stroke:#c2185b,color:#000,font-weight:bold
```

## 📸 UI Snapshots

![Auth](https://github.com/rakheshkrishna2005/TensorVisionX/blob/master/public/1.jpg)
![Dashboard](https://github.com/rakheshkrishna2005/TensorVisionX/blob/master/public/2.png)
![Detection Table](https://github.com/rakheshkrishna2005/TensorVisionX/blob/master/public/3.png)
