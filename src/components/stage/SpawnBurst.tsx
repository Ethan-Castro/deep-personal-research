"use client"

import { useRef } from "react"
import Lottie, { type LottieRefCurrentProps } from "lottie-react"
import spawnBurst from "../../../public/lottie/spawn-burst.json"

interface SpawnBurstProps {
  size?: number
}

/**
 * One-shot Lottie burst that plays on mount and self-destructs.
 * Overlay this on top of an agent avatar when it first spawns.
 */
export function SpawnBurst({ size = 96 }: SpawnBurstProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null)

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={spawnBurst}
        loop={false}
        autoplay
        style={{ width: size * 1.5, height: size * 1.5 }}
        onComplete={() => {
          lottieRef.current?.destroy()
        }}
      />
    </div>
  )
}
