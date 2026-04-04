"use client"

import { useState } from "react"
import Link from "next/link"
import { DomainSelector } from "@/components/intake/DomainSelector"
import { DynamicForm } from "@/components/intake/DynamicForm"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import type { ResearchType } from "@/lib/types"

export default function Home() {
  const [selectedType, setSelectedType] = useState<ResearchType | null>(null)

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight">Personal PI</h1>
        <p className="text-lg text-muted-foreground">
          AI-powered deep research, personalized to you.
          <br />
          Evidence-graded reports backed by PubMed, O*NET, and 100M+ sources.
        </p>
        <div className="mt-4">
          <Link href="/research/sim">
            <Button variant="outline" size="sm" className="gap-2">
              <Play className="h-3.5 w-3.5" />
              Watch Demo
            </Button>
          </Link>
        </div>
      </div>

      {!selectedType ? (
        <>
          <h2 className="mb-4 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
            What would you like to research?
          </h2>
          <DomainSelector onSelect={setSelectedType} />
        </>
      ) : (
        <DynamicForm researchType={selectedType} onBack={() => setSelectedType(null)} />
      )}
    </main>
  )
}
