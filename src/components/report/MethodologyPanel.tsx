"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Database, Search, FileCheck } from "lucide-react"

interface MethodologyPanelProps {
  methodology: {
    databasesSearched: string[]
    papersReviewed: number
    searchQueries: string[]
    inclusionCriteria: string[]
  }
}

export function MethodologyPanel({ methodology }: MethodologyPanelProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-lg border border-border bg-muted/30">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 p-3 text-left text-sm font-medium hover:bg-muted/50"
      >
        {open ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        Research Methodology
      </button>

      {open && (
        <div className="space-y-3 border-t border-border px-3 pb-3 pt-2">
          <div className="flex items-start gap-2">
            <Database className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium">Databases Searched</p>
              <p className="text-xs text-muted-foreground">
                {methodology.databasesSearched.join(", ")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <FileCheck className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium">
                {methodology.papersReviewed} Sources Reviewed
              </p>
              <p className="text-xs text-muted-foreground">
                Inclusion: {methodology.inclusionCriteria.join("; ")}
              </p>
            </div>
          </div>

          {methodology.searchQueries.length > 0 && (
            <div className="flex items-start gap-2">
              <Search className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium">Search Queries</p>
                <ul className="text-xs text-muted-foreground">
                  {methodology.searchQueries.slice(0, 10).map((q, i) => (
                    <li key={i}>• {q}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
