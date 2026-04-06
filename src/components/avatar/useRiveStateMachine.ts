"use client"

import { useEffect, useRef } from "react"
import { useRive, useStateMachineInput } from "@rive-app/react-canvas"
import { RIVE_ASSET_PATH, STATE_MACHINE_NAME, AVATAR_STATE_TO_NUMBER } from "./riveAssets"
import type { AvatarState } from "./types"

interface UseRiveStateMachineOptions {
  state: AvatarState
  teamColor: string
  size: number
}

export function useRiveStateMachine({ state, teamColor, size }: UseRiveStateMachineOptions) {
  const { rive, RiveComponent } = useRive({
    src: RIVE_ASSET_PATH,
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
  })

  const stateInput = useStateMachineInput(rive, STATE_MACHINE_NAME, "state")
  const isLoaded = !!rive

  // Update state machine input when avatar state changes
  useEffect(() => {
    if (stateInput) {
      stateInput.value = AVATAR_STATE_TO_NUMBER[state] ?? 0
    }
  }, [state, stateInput])

  // Apply team color via CSS hue-rotate fallback
  // (Rive setColorValue requires knowing artboard fill names which are asset-specific)
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!containerRef.current) return
    // Calculate hue-rotate from hex color
    const hue = hexToHue(teamColor)
    const canvas = containerRef.current.querySelector("canvas")
    if (canvas) {
      canvas.style.filter = `hue-rotate(${hue}deg) saturate(1.4)`
    }
  }, [teamColor, isLoaded])

  return { RiveComponent, containerRef, isLoaded }
}

/**
 * Very rough hue extraction from a hex color for CSS filter hue-rotate.
 * Base Rive asset is expected to use a blue/cyan palette (~210° hue).
 */
function hexToHue(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  if (d === 0) return 0
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  const targetHue = Math.round(h * 360)
  // Base asset hue is ~210 (blue). Rotate relative to that.
  return targetHue - 210
}
