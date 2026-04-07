"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import Lottie, { type LottieRefCurrentProps } from "lottie-react"
import type { EvidenceGrade } from "@/lib/types"
import foundCelebration from "../../../public/lottie/found-celebration.json"

interface FindingCardProps {
  title: string
  evidenceGrade: EvidenceGrade
  sourceType: string
}

const gradeColors: Record<string, string> = {
  A: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30",
  B: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  C: "bg-amber-500/20 text-amber-600 border-amber-500/30",
  D: "bg-orange-500/20 text-orange-600 border-orange-500/30",
  F: "bg-red-500/20 text-red-600 border-red-500/30",
}

export function FindingCard({
  title,
  evidenceGrade,
  sourceType,
}: FindingCardProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null)

  return (
    <motion.div
      className="relative flex items-start gap-1.5 rounded-md border border-border/60 bg-card/80 px-2 py-1.5 shadow-sm backdrop-blur-sm overflow-hidden"
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {/* Celebration burst — plays once on mount, then disappears */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <Lottie
          lottieRef={lottieRef}
          animationData={foundCelebration}
          loop={false}
          autoplay
          style={{ width: 80, height: 80, opacity: 0.5 }}
          onComplete={() => {
            lottieRef.current?.destroy()
          }}
        />
      </div>

      <span
        className={`relative mt-0.5 shrink-0 inline-flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold border ${gradeColors[evidenceGrade] ?? gradeColors.F}`}
      >
        {evidenceGrade}
      </span>
      <div className="relative min-w-0">
        <p className="text-[9px] font-medium text-foreground/80 line-clamp-2 leading-tight">
          {title}
        </p>
        <p className="text-[8px] text-muted-foreground capitalize mt-0.5">
          {sourceType}
        </p>
      </div>
    </motion.div>
  )
}
