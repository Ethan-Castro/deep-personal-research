"use client"

import { useEffect, useRef, useState } from "react"
import { useRiveStateMachine } from "./useRiveStateMachine"
import type { AvatarState } from "./types"

interface RiveAvatarProps {
  state: AvatarState
  teamColor: string
  size: number
}

export function RiveAvatar({ state, teamColor, size }: RiveAvatarProps) {
  const { RiveComponent, containerRef, isLoaded } = useRiveStateMachine({ state, teamColor, size })
  const [riveError, setRiveError] = useState(false)

  // Detect if the .riv file failed to load (404) and fall back to canvas avatar
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) setRiveError(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [isLoaded])

  if (riveError) {
    return <CanvasAvatar state={state} teamColor={teamColor} size={size} />
  }

  return (
    <div ref={containerRef} style={{ width: size, height: size }} className="relative">
      {/* Loading shimmer */}
      {!isLoaded && (
        <div
          className="absolute inset-0 rounded-full animate-pulse bg-muted"
          style={{ borderRadius: "50%" }}
        />
      )}
      <RiveComponent style={{ width: size, height: size, opacity: isLoaded ? 1 : 0 }} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// CanvasAvatar — polished fallback rendered on an HTML canvas
// Mimics the Rive state machine: idle aura, animated eyes, mouth morphing
// ---------------------------------------------------------------------------

function CanvasAvatar({ state, teamColor, size }: RiveAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const timeRef = useRef<number>(0)
  const stateRef = useRef<AvatarState>(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Retina scaling
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const r = size / 2 - 3

    function hexToRgb(hex: string) {
      const n = parseInt(hex.replace("#", ""), 16)
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
    }

    function draw(t: number) {
      const s = stateRef.current
      ctx!.clearRect(0, 0, size, size)

      const rgb = hexToRgb(teamColor)
      const col = `${rgb.r},${rgb.g},${rgb.b}`

      // --- Aura ---
      let auraScale = 1
      let auraOpacity = 0.3
      if (s === "thinking") {
        auraScale = 1 + 0.08 * Math.sin(t * 2.5)
        auraOpacity = 0.3 + 0.2 * Math.sin(t * 2.5)
      } else if (s === "searching") {
        auraScale = 1 + 0.12 * Math.sin(t * 5)
        auraOpacity = 0.5 + 0.3 * Math.sin(t * 5)
      } else if (s === "spawned") {
        auraScale = 1 + 0.3 * Math.exp(-t * 1.5)
        auraOpacity = 0.6 * Math.exp(-t * 1.5) + 0.1
      } else if (s === "found") {
        auraScale = 1 + 0.2 * Math.exp(-t * 3)
        auraOpacity = 0.8 * Math.exp(-t * 3) + 0.15
      } else if (s === "complete") {
        auraOpacity = 0.1
      } else if (s === "error") {
        auraOpacity = 0.3 + 0.3 * Math.sin(t * 8)
      }

      ctx!.save()
      ctx!.translate(cx, cy)
      ctx!.scale(auraScale, auraScale)
      ctx!.beginPath()
      ctx!.arc(0, 0, r, 0, Math.PI * 2)
      ctx!.strokeStyle = s === "error" ? `rgba(239,68,68,${auraOpacity})` : `rgba(${col},${auraOpacity})`
      ctx!.lineWidth = 2.5
      ctx!.shadowBlur = s === "searching" ? 10 : 5
      ctx!.shadowColor = s === "error" ? `rgba(239,68,68,0.5)` : `rgba(${col},0.5)`
      ctx!.stroke()
      ctx!.restore()
      ctx!.shadowBlur = 0

      // --- Face plate ---
      ctx!.beginPath()
      ctx!.arc(cx, cy, r - 2, 0, Math.PI * 2)
      ctx!.fillStyle = `rgba(${col},0.08)`
      ctx!.fill()
      ctx!.strokeStyle = `rgba(${col},0.2)`
      ctx!.lineWidth = 1
      ctx!.stroke()

      // --- Eyes ---
      const eyeSpacing = size * 0.14
      const eyeRx = size * 0.055
      const eyeRy = size * 0.07
      const eyeY = cy - size * 0.06

      if (s === "error") {
        // X eyes
        ctx!.strokeStyle = `rgba(${col},0.8)`
        ctx!.lineWidth = 2
        ctx!.lineCap = "round"
        for (const ex of [cx - eyeSpacing, cx + eyeSpacing]) {
          ctx!.beginPath()
          ctx!.moveTo(ex - eyeRx, eyeY - eyeRy)
          ctx!.lineTo(ex + eyeRx, eyeY + eyeRy)
          ctx!.stroke()
          ctx!.beginPath()
          ctx!.moveTo(ex + eyeRx, eyeY - eyeRy)
          ctx!.lineTo(ex - eyeRx, eyeY + eyeRy)
          ctx!.stroke()
        }
      } else if (s === "complete") {
        // Closed (line) eyes
        ctx!.strokeStyle = `rgba(${col},0.8)`
        ctx!.lineWidth = 2
        ctx!.lineCap = "round"
        for (const ex of [cx - eyeSpacing, cx + eyeSpacing]) {
          ctx!.beginPath()
          ctx!.moveTo(ex - eyeRx, eyeY)
          ctx!.lineTo(ex + eyeRx, eyeY)
          ctx!.stroke()
        }
      } else {
        // Animated eyes
        let scaleY = 1
        if (s === "searching") scaleY = 0.55
        else if (s === "found") scaleY = 1.3
        // thinking: slight oscillation
        let offsetX = 0
        if (s === "thinking") offsetX = 2.5 * Math.sin(t * 2)

        ctx!.fillStyle = `rgba(${col},0.8)`
        for (const ex of [cx - eyeSpacing, cx + eyeSpacing]) {
          ctx!.save()
          ctx!.translate(ex + offsetX, eyeY)
          ctx!.scale(1, scaleY)
          ctx!.beginPath()
          ctx!.ellipse(0, 0, eyeRx, eyeRy, 0, 0, Math.PI * 2)
          ctx!.fill()
          ctx!.restore()
        }
      }

      // --- Mouth ---
      const mouthY = cy + size * 0.12
      ctx!.strokeStyle = `rgba(${col},0.6)`
      ctx!.lineWidth = 1.5
      ctx!.lineCap = "round"
      ctx!.beginPath()
      if (s === "thinking") {
        const wave = 2 * Math.sin(t * 3)
        ctx!.moveTo(cx - 6, mouthY)
        ctx!.bezierCurveTo(cx - 3, mouthY + wave, cx + 3, mouthY - wave, cx + 6, mouthY)
      } else if (s === "searching") {
        ctx!.arc(cx, mouthY - 2, 4, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${col},0.25)`
        ctx!.fill()
        return
      } else if (s === "found" || s === "complete") {
        ctx!.moveTo(cx - 6, mouthY - 1)
        ctx!.quadraticCurveTo(cx, mouthY + 5, cx + 6, mouthY - 1)
      } else if (s === "error") {
        ctx!.moveTo(cx - 6, mouthY + 2)
        ctx!.quadraticCurveTo(cx, mouthY - 3, cx + 6, mouthY + 2)
      } else {
        ctx!.moveTo(cx - 6, mouthY)
        ctx!.lineTo(cx + 6, mouthY)
      }
      ctx!.stroke()
    }

    let start: number | null = null
    function loop(ts: number) {
      if (!start) start = ts
      const elapsed = (ts - start) / 1000
      timeRef.current = elapsed
      draw(elapsed)
      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [size, teamColor]) // teamColor triggers re-init for new color

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="rounded-full"
    />
  )
}
