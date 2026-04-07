"use client"

import { useState } from "react"
import { useResearchState } from "@/hooks/useResearchState"
import { DomainSection } from "./DomainSection"
import { MethodologyPanel } from "./MethodologyPanel"
import { ExportButtons } from "./ExportButtons"
import { PaperView } from "./PaperView"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText } from "lucide-react"

export function ReportView() {
  const sections = useResearchState((s) => s.reportSections)
  const findings = useResearchState((s) => s.findings)
  const insights = useResearchState((s) => s.insights)
  const status = useResearchState((s) => s.status)
  const [viewMode, setViewMode] = useState<"dashboard" | "paper">("dashboard")

  if (sections.length === 0) {
    if (status === "writing") {
      return (
        <div className="flex h-full items-center justify-center p-4">
          <div className="text-center">
            <FileText className="mx-auto mb-2 h-8 w-8 animate-pulse text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Generating report...</p>
          </div>
        </div>
      )
    }
    return null
  }

  const title = `Personal PI Research Report`

  const methodology = {
    databasesSearched: [...new Set(findings.map((f) => f.sourceType))],
    papersReviewed: findings.length,
    searchQueries: [...new Set(findings.map((f) => f.source).filter(Boolean))].slice(0, 10),
    inclusionCriteria: [
      "Peer-reviewed publications",
      "Published within last 10 years (preferred)",
      "Relevant to user profile",
    ],
  }

  return (
    <div className="flex h-full flex-col">
      {/* Sticky header */}
      <div className="flex items-center justify-between border-b border-border bg-card/80 px-4 py-2 backdrop-blur-sm">
        <h2 className="text-xs font-semibold truncate mr-2">{title}</h2>
        <ExportButtons
          sections={sections}
          findings={findings}
          insights={insights}
          title={title}
          viewMode={viewMode}
          onViewChange={setViewMode}
        />
      </div>

      {/* View body */}
      {viewMode === "paper" ? (
        <PaperView />
      ) : (
        <ScrollArea className="flex-1">
          <div className="space-y-6 p-4">
            {sections
              .filter((s) => s.domain === "overview")
              .map((s, i) => (
                <DomainSection key={`overview-${i}`} section={s} />
              ))}

            {[
              { key: "health", label: "Health & Fitness", cls: "text-emerald-500" },
              { key: "career", label: "Career & Education", cls: "text-blue-500" },
              { key: "finance", label: "Finance & Investing", cls: "text-pink-500" },
              { key: "social", label: "Social & Relationships", cls: "text-cyan-500" },
            ].map(({ key, label, cls }) => {
              const domainSections = sections.filter((s) => s.domain === key)
              if (domainSections.length === 0) return null
              return (
                <div key={key}>
                  <h3 className={`mb-3 text-xs font-medium uppercase tracking-wider ${cls}`}>
                    {label}
                  </h3>
                  <div className="space-y-4">
                    {domainSections.map((s, i) => (
                      <DomainSection key={`${key}-${i}`} section={s} />
                    ))}
                  </div>
                </div>
              )
            })}

            {sections
              .filter((s) => s.domain === "methodology")
              .map((s, i) => (
                <DomainSection key={`method-${i}`} section={s} />
              ))}

            <MethodologyPanel methodology={methodology} />
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
