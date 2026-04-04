import { getModel } from "@/lib/models"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import type { Finding, Insight, Report, ReportSection, ResearchBrief } from "@/lib/types"
import type { EmitFn } from "@/lib/events"
import { createEvent } from "@/lib/events"

const REPORT_WRITER_PROMPT = `You are the Report Writer for Personal PI. You produce the final research report from synthesized insights and raw findings.

Your report must be:
1. Personalized — address the user by name, reference their specific situation
2. Evidence-graded — every recommendation has an evidence grade (A-F) inline
3. Actionable — specific next steps, not vague advice
4. Transparent — show what was searched, how many papers, and why you're confident (or not)

Report structure (generate each section as a separate JSON object):

1. OVERVIEW section (domain: "overview"):
   - Executive summary (3-4 sentences)
   - Key takeaways (3-5 bullet points with evidence grades)

2. Per-domain sections (domain: "health" and/or "career"):
   - Subheadings for each priority area
   - Specific recommendations with evidence grades
   - Inline citations: [Author Year, Grade: X]
   - When evidence conflicts, explain both sides

3. METHODOLOGY section (domain: "methodology"):
   - Databases searched
   - Number of papers/sources reviewed
   - Search queries used
   - Evidence grading methodology

Output EACH section as a separate JSON object on its own line:
{"sectionName": "...", "content": "...", "citations": [...], "domain": "..."}

Write in a clear, professional tone. Be specific: "3x12 bench press at 70% 1RM, twice per week" not "do some chest exercises".`

export async function writeReport(
  findings: Finding[],
  insights: Insight[],
  brief: ResearchBrief,
  sessionId: string,
  emit: EmitFn
): Promise<Report> {
  emit(
    createEvent("agent_spawned", "report_writer", {
      name: "report_writer",
      role: "Report Writer",
      team: "synthesis",
      description: "Generating personalized research report",
    })
  )

  const model = getModel("reportWriter")

  // Build context
  const insightsText = insights
    .map(
      (ins) =>
        `[${ins.evidenceGrade}] ${ins.title}: ${ins.content} (domain: ${ins.domain})`
    )
    .join("\n\n")

  const findingsText = findings
    .slice(0, 30)
    .map(
      (f) =>
        `[${f.id}] (${f.evidenceGrade}) ${f.title} — ${f.summary.slice(0, 200)} [Source: ${f.source}${f.sourceUrl ? `, ${f.sourceUrl}` : ""}]`
    )
    .join("\n")

  const searchQueries = [
    ...new Set(findings.map((f) => f.source).filter(Boolean)),
  ]

  emit(
    createEvent("agent_thinking", "report_writer", {
      thought: "Structuring the final report...",
      step: 1,
    })
  )

  const response = await model.invoke([
    new SystemMessage(REPORT_WRITER_PROMPT),
    new HumanMessage(
      `User: ${brief.userProfile.name}
Research type: ${brief.researchType}
Priority areas: ${brief.priorityAreas.join(", ")}
Research questions addressed: ${brief.researchQuestions.join("; ")}

SYNTHESIZED INSIGHTS:
${insightsText}

RAW FINDINGS (for citations):
${findingsText}

Generate the report. Output each section as a separate JSON object.`
    ),
  ])

  const text = typeof response.content === "string" ? response.content : ""

  // Parse sections from response
  const sections: ReportSection[] = []
  const jsonMatches = text.matchAll(/\{[^{}]*"sectionName"[^{}]*\}/g)

  for (const match of jsonMatches) {
    try {
      const parsed = JSON.parse(match[0])
      const section: ReportSection = {
        sectionName: parsed.sectionName ?? "Section",
        content: parsed.content ?? "",
        citations: (parsed.citations ?? []).map(
          (c: { title?: string; url?: string; evidenceGrade?: string }) => ({
            title: c.title ?? "",
            url: c.url,
            evidenceGrade: c.evidenceGrade ?? "C",
          })
        ),
        domain: parsed.domain ?? "overview",
      }
      sections.push(section)

      emit(createEvent("report_section", "report_writer", { section }))
    } catch {
      // Skip unparseable sections
    }
  }

  // If no sections parsed, create one from the full text
  if (sections.length === 0 && text.length > 100) {
    const section: ReportSection = {
      sectionName: "Research Report",
      content: text,
      citations: [],
      domain: "overview",
    }
    sections.push(section)
    emit(createEvent("report_section", "report_writer", { section }))
  }

  const report: Report = {
    id: `report_${sessionId}`,
    sessionId,
    title: `Personal PI Research Report for ${brief.userProfile.name}`,
    sections,
    methodology: {
      databasesSearched: [
        ...new Set(findings.map((f) => f.sourceType)),
      ],
      papersReviewed: findings.length,
      searchQueries: searchQueries.slice(0, 20),
      inclusionCriteria: [
        "Peer-reviewed publications",
        "Published within last 10 years (preferred)",
        "Relevant to user's specific profile and goals",
        "Sample population applicable to user's demographics",
      ],
    },
    createdAt: Date.now(),
  }

  emit(
    createEvent("agent_complete", "report_writer", {
      summary: `Report generated with ${sections.length} sections`,
      findingsCount: sections.length,
      durationMs: 0,
    })
  )

  return report
}
