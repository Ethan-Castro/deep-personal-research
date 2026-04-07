"use client"

import React, { useState } from "react"
import { Dumbbell, GraduationCap, Sparkles, FileQuestion } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { ResearchType } from "@/lib/types"

interface AccordionItemData {
  id: number
  title: string
  subtitle: string
  icon: LucideIcon
  gradient: string
  type: ResearchType
}

const accordionItems: AccordionItemData[] = [
  {
    id: 1,
    title: "Health & Fitness",
    subtitle: "Training protocols, nutrition, supplements, genetic heritage analysis",
    icon: Dumbbell,
    gradient: "from-emerald-600 to-emerald-900",
    type: "health",
  },
  {
    id: 2,
    title: "Career & Education",
    subtitle: "Career pathways, skill gaps, labor market trends, salary data",
    icon: GraduationCap,
    gradient: "from-blue-600 to-blue-900",
    type: "career",
  },
  {
    id: 3,
    title: "Full Analysis",
    subtitle: "Cross-domain insights connecting health, fitness, career, and education",
    icon: Sparkles,
    gradient: "from-amber-600 to-amber-900",
    type: "both",
  },
  {
    id: 4,
    title: "Submit an RFP",
    subtitle: "Ask any research question — AI generates directions, you pick one to investigate",
    icon: FileQuestion,
    gradient: "from-violet-600 to-violet-900",
    type: "rfp",
  },
]

function AccordionItem({
  item,
  isActive,
  onMouseEnter,
  onClick,
}: {
  item: AccordionItemData
  isActive: boolean
  onMouseEnter: () => void
  onClick: () => void
}) {
  const Icon = item.icon

  return (
    <div
      className={`relative h-[450px] cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} transition-all duration-700 ease-in-out ${
        isActive ? "w-[400px]" : "w-[70px]"
      }`}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />

      {/* Expanded content */}
      <div
        className={`absolute inset-0 flex flex-col justify-end p-8 transition-opacity duration-500 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      >
        <Icon className="mb-4 h-10 w-10 text-white/80" />
        <h3 className="text-2xl font-bold text-white">{item.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          {item.subtitle}
        </p>
        <span className="mt-4 text-xs font-medium uppercase tracking-wider text-white/50">
          Click to start &rarr;
        </span>
      </div>

      {/* Collapsed label */}
      <span
        className={`absolute whitespace-nowrap text-lg font-semibold text-white transition-all duration-300 ease-in-out ${
          isActive
            ? "bottom-6 left-1/2 -translate-x-1/2 rotate-0 opacity-0"
            : "bottom-28 left-1/2 w-auto -translate-x-1/2 rotate-90 text-left opacity-100"
        }`}
      >
        {item.title}
      </span>
    </div>
  )
}

export function LandingAccordion({
  onSelect,
}: {
  onSelect: (type: ResearchType) => void
}) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="flex flex-row items-center justify-center gap-3 p-4">
      {accordionItems.map((item, index) => (
        <AccordionItem
          key={item.id}
          item={item}
          isActive={index === activeIndex}
          onMouseEnter={() => setActiveIndex(index)}
          onClick={() => onSelect(item.type)}
        />
      ))}
    </div>
  )
}
