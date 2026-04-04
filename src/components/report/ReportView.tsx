"use client"

import { useResearchState } from "@/hooks/useResearchState"
import { DomainSection } from "./DomainSection"
import { MethodologyPanel } from "./MethodologyPanel"
import { ExportButtons } from "./ExportButtons"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText } from "lucide-react"

export function ReportView() {
  const sections = useResearchState((s) => s.reportSections)
  const findings = useResearchState((s) => s.findings)
  const status = useResearchState((s) => s.status)

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

  const title = `Personal PI Report`

  // Build methodology from findings
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

  const overviewSections = sections.filter((s) => s.domain === "overview")
  const healthSections = sections.filter((s) => s.domain === "health")
  const careerSections = sections.filter((s) => s.domain === "career")
  const methodSections = sections.filter((s) => s.domain === "methodology")

  return (
    <div className="flex h-full flex-col">
      {/* Sticky header */}
      <div className="flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur-sm">
        <h2 className="text-sm font-semibold">{title}</h2>
        <ExportButtons sections={sections} title={title} />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4">
          {overviewSections.map((s, i) => (
            <DomainSection key={`overview-${i}`} section={s} />
          ))}

          {healthSections.length > 0 && (
            <div>
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-emerald-500">
                Health & Fitness
              </h3>
              <div className="space-y-4">
                {healthSections.map((s, i) => (
                  <DomainSection key={`health-${i}`} section={s} />
                ))}
              </div>
            </div>
          )}

          {careerSections.length > 0 && (
            <div>
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-blue-500">
                Career & Education
              </h3>
              <div className="space-y-4">
                {careerSections.map((s, i) => (
                  <DomainSection key={`career-${i}`} section={s} />
                ))}
              </div>
            </div>
          )}

          {methodSections.map((s, i) => (
            <DomainSection key={`method-${i}`} section={s} />
          ))}

          <MethodologyPanel methodology={methodology} />
        </div>
      </ScrollArea>
    </div>
  )
}
