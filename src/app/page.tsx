"use client"

import { useState } from "react"
import Link from "next/link"
import { DynamicForm } from "@/components/intake/DynamicForm"
import { Button } from "@/components/ui/button"
import { LandingAccordion } from "@/components/ui/interactive-image-accordion"
import { Play } from "lucide-react"
import type { ResearchType } from "@/lib/types"

export default function Home() {
  const [selectedType, setSelectedType] = useState<ResearchType | null>(null)

  if (selectedType) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-12">
        <DynamicForm
          researchType={selectedType}
          onBack={() => setSelectedType(null)}
        />
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col">
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
          {/* Left: Text Content */}
          <div className="w-full text-center md:w-1/2 md:text-left">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
              AI-Powered Deep Research
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl">
              Personalized Research,{" "}
              <span className="text-primary">Evidence-Graded</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground md:mx-0">
              Multi-agent AI searches PubMed, O*NET, and 100M+ sources to build
              deep research reports tailored to your health, fitness, and career
              goals.
            </p>
            <div className="mt-8">
              <Link href="/research/sim">
                <Button variant="outline" size="lg" className="gap-2">
                  <Play className="h-4 w-4" />
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Accordion */}
          <div className="w-full md:w-1/2">
            <LandingAccordion onSelect={setSelectedType} />
          </div>
        </div>
      </section>
    </main>
  )
}
