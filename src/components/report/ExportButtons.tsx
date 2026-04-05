"use client"

import { Copy, Check, FileText, LayoutDashboard, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"
import { createPortal } from "react-dom"
import type { ReportSection, Finding, Insight } from "@/lib/types"
import { paperToText } from "./PaperView"
import { exportPaper, type PaperFormat } from "@/lib/generatePaper"

interface ExportButtonsProps {
  sections: ReportSection[]
  findings: Finding[]
  insights: Insight[]
  title: string
  userName?: string
  viewMode: "dashboard" | "paper"
  onViewChange: (mode: "dashboard" | "paper") => void
}

export function ExportButtons({
  sections,
  findings,
  insights,
  title,
  userName,
  viewMode,
  onViewChange,
}: ExportButtonsProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [showFormats, setShowFormats] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  function copyMarkdown() {
    const markdown = [
      `# ${title}`,
      "",
      ...sections.map((s) => [`## ${s.sectionName}`, "", s.content, ""].join("\n")),
    ].join("\n")
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied("md")
      setTimeout(() => setCopied(null), 2000)
    })
  }

  function copyPaper() {
    const text = paperToText(sections, findings)
    navigator.clipboard.writeText(text).then(() => {
      setCopied("paper")
      setTimeout(() => setCopied(null), 2000)
    })
  }

  function handleExport(format: PaperFormat) {
    setShowFormats(false)
    exportPaper({ sections, findings, insights, userName, format })
  }

  return (
    <div className="flex items-center gap-1.5">
      {/* View toggle */}
      <Button
        variant={viewMode === "dashboard" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange("dashboard")}
        className="h-7 gap-1 px-2 text-[10px]"
      >
        <LayoutDashboard className="h-3 w-3" />
        Cards
      </Button>
      <Button
        variant={viewMode === "paper" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange("paper")}
        className="h-7 gap-1 px-2 text-[10px]"
      >
        <FileText className="h-3 w-3" />
        Paper
      </Button>

      <div className="mx-1 h-4 w-px bg-border" />

      {/* Export dropdown */}
      <Button
        ref={btnRef}
        variant="outline"
        size="sm"
        onClick={() => setShowFormats(!showFormats)}
        className="h-7 gap-1 px-2 text-[10px]"
      >
        <Download className="h-3 w-3" />
        Export PDF
      </Button>

      {showFormats &&
        createPortal(
          <div
            className="fixed inset-0"
            style={{ zIndex: 9999 }}
            onClick={() => setShowFormats(false)}
          >
            <div
              className="absolute w-56 rounded-md border border-border bg-popover p-1 shadow-xl"
              style={{
                zIndex: 10000,
                ...(btnRef.current
                  ? {
                      top: btnRef.current.getBoundingClientRect().bottom + 4,
                      right:
                        window.innerWidth -
                        btnRef.current.getBoundingClientRect().right,
                    }
                  : {}),
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => handleExport("ieee")}
                className="flex w-full flex-col items-start rounded-sm px-3 py-2 text-left hover:bg-accent"
              >
                <span className="text-xs font-medium">IEEE Format</span>
                <span className="text-[10px] text-muted-foreground">
                  Two-column, 10pt Times, single-spaced. Journal paper style.
                </span>
              </button>
              <button
                onClick={() => handleExport("apa")}
                className="flex w-full flex-col items-start rounded-sm px-3 py-2 text-left hover:bg-accent"
              >
                <span className="text-xs font-medium">APA 7th Edition</span>
                <span className="text-[10px] text-muted-foreground">
                  Single-column, 12pt TNR, double-spaced. Academic paper style.
                </span>
              </button>
            </div>
          </div>,
          document.body
        )}

      {/* Copy */}
      <Button
        variant="outline"
        size="sm"
        onClick={viewMode === "paper" ? copyPaper : copyMarkdown}
        className="h-7 gap-1 px-2 text-[10px]"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" /> Copy
          </>
        )}
      </Button>
    </div>
  )
}
