"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import type { AvatarState } from "./types"

interface RiveAvatarProps {
  state: AvatarState
  teamColor: string
  size: number
}

// Check once at module level whether the .riv file exists
let riveFileExists: boolean | null = null
let riveCheckPromise: Promise<boolean> | null = null

function checkRiveFile(): Promise<boolean> {
  if (riveCheckPromise) return riveCheckPromise
  riveCheckPromise = fetch("/rive/agent-avatar.riv", { method: "HEAD" })
    .then((res) => {
      riveFileExists = res.ok
      return res.ok
    })
    .catch(() => {
      riveFileExists = false
      return false
    })
  return riveCheckPromise
}

export function RiveAvatar({ state, teamColor, size }: RiveAvatarProps) {
  const [useRive, setUseRive] = useState(riveFileExists === true)
  const [checked, setChecked] = useState(riveFileExists !== null)

  useEffect(() => {
    if (riveFileExists !== null) {
      setUseRive(riveFileExists)
      setChecked(true)
      return
    }
    checkRiveFile().then((exists) => {
      setUseRive(exists)
      setChecked(true)
    })
  }, [])

  // Until we know, render the canvas avatar immediately (no shimmer delay)
  if (!checked || !useRive) {
    return <CanvasAvatar state={state} teamColor={teamColor} size={size} />
  }

  return <RiveWrapper state={state} teamColor={teamColor} size={size} />
}

// Lazy-loaded Rive wrapper — only imported if .riv file actually exists
function RiveWrapper({ state, teamColor, size }: RiveAvatarProps) {
  const [RiveMod, setRiveMod] = useState<typeof import("./useRiveStateMachine") | null>(null)

  useEffect(() => {
    import("./useRiveStateMachine").then(setRiveMod)
  }, [])

  if (!RiveMod) {
    return <CanvasAvatar state={state} teamColor={teamColor} size={size} />
  }

  return <RiveInner mod={RiveMod} state={state} teamColor={teamColor} size={size} />
}

function RiveInner({
  mod,
  state,
  teamColor,
  size,
}: RiveAvatarProps & { mod: typeof import("./useRiveStateMachine") }) {
  const { RiveComponent, containerRef, isLoaded } = mod.useRiveStateMachine({ state, teamColor, size })

  return (
    <div ref={containerRef} style={{ width: size, height: size }} className="relative">
      {!isLoaded && (
        <div className="absolute inset-0">
          <CanvasAvatar state={state} teamColor={teamColor} size={size} />
        </div>
      )}
      <RiveComponent style={{ width: size, height: size, opacity: isLoaded ? 1 : 0 }} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// CanvasAvatar — polished animated avatar rendered on HTML canvas
// State-machine-driven: aura, eyes, mouth all respond to AvatarState
// ---------------------------------------------------------------------------

function CanvasAvatar({ state, teamColor, size }: RiveAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const stateRef = useRef<AvatarState>(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  const hexToRgb = useCallback((hex: string) => {
    const n = parseInt(hex.replace("#", ""), 16)
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const r = size / 2 - 3

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

      // --- Inner gradient highlight ---
      const grad = ctx!.createRadialGradient(cx - r * 0.2, cy - r * 0.3, 0, cx, cy, r - 2)
      grad.addColorStop(0, `rgba(${col},0.12)`)
      grad.addColorStop(1, `rgba(${col},0.02)`)
      ctx!.beginPath()
      ctx!.arc(cx, cy, r - 3, 0, Math.PI * 2)
      ctx!.fillStyle = grad
      ctx!.fill()

      // --- Eyes ---
      const eyeSpacing = size * 0.14
      const eyeRx = size * 0.055
      const eyeRy = size * 0.07
      const eyeY = cy - size * 0.06

      if (s === "error") {
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
        // Happy closed eyes (arcs, not lines)
        ctx!.strokeStyle = `rgba(${col},0.8)`
        ctx!.lineWidth = 2
        ctx!.lineCap = "round"
        for (const ex of [cx - eyeSpacing, cx + eyeSpacing]) {
          ctx!.beginPath()
          ctx!.arc(ex, eyeY + eyeRy * 0.3, eyeRx, Math.PI, 0)
          ctx!.stroke()
        }
      } else {
        let scaleY = 1
        if (s === "searching") scaleY = 0.55
        else if (s === "found") scaleY = 1.3

        let offsetX = 0
        if (s === "thinking") offsetX = 2.5 * Math.sin(t * 2)

        // Blink every ~3s
        const blinkCycle = t % 3.5
        if (blinkCycle > 3.3 && blinkCycle < 3.5 && s !== "searching") {
          scaleY *= 0.1
        }

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

        // Pupils (small highlight dot)
        if (s !== "searching") {
          ctx!.fillStyle = `rgba(255,255,255,0.5)`
          for (const ex of [cx - eyeSpacing, cx + eyeSpacing]) {
            ctx!.beginPath()
            ctx!.arc(ex + offsetX - eyeRx * 0.3, eyeY - eyeRy * 0.3, eyeRx * 0.3, 0, Math.PI * 2)
            ctx!.fill()
          }
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
        ctx!.stroke()
      } else if (s === "searching") {
        // Small "o" mouth
        ctx!.beginPath()
        ctx!.arc(cx, mouthY, 3.5, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${col},0.2)`
        ctx!.fill()
        ctx!.strokeStyle = `rgba(${col},0.4)`
        ctx!.lineWidth = 1
        ctx!.stroke()
      } else if (s === "found" || s === "complete") {
        ctx!.moveTo(cx - 6, mouthY - 1)
        ctx!.quadraticCurveTo(cx, mouthY + 5, cx + 6, mouthY - 1)
        ctx!.stroke()
      } else if (s === "error") {
        ctx!.moveTo(cx - 5, mouthY + 2)
        ctx!.quadraticCurveTo(cx, mouthY - 3, cx + 5, mouthY + 2)
        ctx!.stroke()
      } else {
        // Neutral — slight curve
        ctx!.moveTo(cx - 5, mouthY)
        ctx!.quadraticCurveTo(cx, mouthY + 1, cx + 5, mouthY)
        ctx!.stroke()
      }
    }

    let start: number | null = null
    function loop(ts: number) {
      if (!start) start = ts
      draw((ts - start) / 1000)
      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [size, teamColor, hexToRgb])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="rounded-full"
    />
  )
}
