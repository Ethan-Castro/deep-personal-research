"use client"

import { useState, useEffect } from "react"
import { useReactFlow } from "@xyflow/react"

export type ZoomLevel = "far" | "mid" | "close"

export function useZoomLevel(): ZoomLevel {
  const { getZoom } = useReactFlow()
  const [level, setLevel] = useState<ZoomLevel>("mid")

  useEffect(() => {
    const interval = setInterval(() => {
      const zoom = getZoom()
      const next: ZoomLevel =
        zoom < 0.2 ? "far" : zoom < 0.5 ? "mid" : "close"
      setLevel((prev) => (prev === next ? prev : next))
    }, 200)

    return () => clearInterval(interval)
  }, [getZoom])

  return level
}
