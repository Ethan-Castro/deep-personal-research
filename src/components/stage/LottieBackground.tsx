"use client"

import Lottie from "lottie-react"
import bgParticles from "../../../public/lottie/bg-particles.json"

export function LottieBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
      <Lottie
        animationData={bgParticles}
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
        rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
      />
    </div>
  )
}
