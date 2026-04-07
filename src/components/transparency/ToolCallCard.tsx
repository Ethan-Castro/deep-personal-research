"use client"

import { motion } from "framer-motion"
import Lottie from "lottie-react"
import { Database, Search } from "lucide-react"
import searchRadar from "../../../public/lottie/search-radar.json"

interface ToolCallCardProps {
  toolName: string
  query: string
  isActive?: boolean
}

const toolIcons: Record<string, typeof Database> = {
  pubmedSearch: Search,
  pubmedGetFullText: Database,
  exaSearch: Search,
  exaDeepResearch: Search,
  onetSearchOccupations: Search,
  onetGetOccupationDetails: Database,
  onetGetRelatedOccupations: Database,
}

export function ToolCallCard({ toolName, query, isActive }: ToolCallCardProps) {
  const Icon = toolIcons[toolName] ?? Search

  return (
    <motion.div
      className="flex items-start gap-1.5 rounded-md border border-border/60 bg-card/80 px-2 py-1.5 shadow-sm backdrop-blur-sm"
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <div className="mt-0.5 shrink-0">
        {isActive ? (
          <Lottie
            animationData={searchRadar}
            loop
            autoplay
            style={{ width: 12, height: 12 }}
          />
        ) : (
          <Icon className="h-3 w-3 text-muted-foreground" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-medium text-foreground/80 truncate">
          {toolName}
        </p>
        <p className="text-[8px] text-muted-foreground truncate">{query}</p>
      </div>
    </motion.div>
  )
}
