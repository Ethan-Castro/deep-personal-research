"use client"

import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type { ReportSection } from "@/lib/types"

interface ExportButtonsProps {
  sections: ReportSection[]
  title: string
}

export function ExportButtons({ sections, title }: ExportButtonsProps) {
  const [copied, setCopied] = useState(false)

  function copyAsMarkdown() {
    const markdown = [
      `# ${title}`,
      "",
      ...sections.map((s) =>
        [`## ${s.sectionName}`, "", s.content, ""].join("\n")
      ),
    ].join("\n")

    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={copyAsMarkdown} className="gap-1.5">
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
