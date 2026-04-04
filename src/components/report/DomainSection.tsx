"use client"

import { EvidenceBadge } from "./EvidenceBadge"
import type { ReportSection, EvidenceGrade } from "@/lib/types"

interface DomainSectionProps {
  section: ReportSection
}

export function DomainSection({ section }: DomainSectionProps) {
  const domainColor =
    section.domain === "health"
      ? "border-emerald-500/30"
      : section.domain === "career"
        ? "border-blue-500/30"
        : section.domain === "methodology"
          ? "border-muted"
          : "border-amber-500/30"

  return (
    <div className={`border-l-2 ${domainColor} pl-4 py-2`}>
      <h3 className="mb-2 text-sm font-semibold">{section.sectionName}</h3>

      <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed">
        {section.content.split("\n").map((para, i) => (
          <p key={i} className="mb-2">
            {para}
          </p>
        ))}
      </div>

      {section.citations.length > 0 && (
        <div className="mt-3 space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Sources
          </p>
          {section.citations.map((cite, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <EvidenceBadge grade={cite.evidenceGrade as EvidenceGrade} size="sm" />
              {cite.url ? (
                <a
                  href={cite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground hover:underline"
                >
                  {cite.title}
                </a>
              ) : (
                <span>{cite.title}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
