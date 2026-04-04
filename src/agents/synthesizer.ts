import { getModel } from "@/lib/models"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { SYNTHESIZER_PROMPT } from "@/prompts/synthesizer"
import type { Finding, Insight, ResearchBrief } from "@/lib/types"
import type { EmitFn } from "@/lib/events"
import { createEvent } from "@/lib/events"

export async function synthesizeFindings(
  findings: Finding[],
  brief: ResearchBrief,
  emit: EmitFn
): Promise<Insight[]> {
  emit(
    createEvent("agent_spawned", "synthesizer", {
      name: "synthesizer",
      role: "Research Synthesizer",
      team: "synthesis",
      description: "Synthesizing findings into actionable insights",
    })
  )

  emit(
    createEvent("agent_thinking", "synthesizer", {
      thought: `Analyzing ${findings.length} findings across ${brief.researchType} domain(s)...`,
      step: 1,
    })
  )

  const model = getModel("synthesizer")

  const findingsText = findings
    .map(
      (f, i) =>
        `[${f.id}] (${f.evidenceGrade}) ${f.title}\n   ${f.summary}\n   Source: ${f.source} (${f.sourceType})`
    )
    .join("\n\n")

  const response = await model.invoke([
    new SystemMessage(SYNTHESIZER_PROMPT),
    new HumanMessage(
      `Research type: ${brief.researchType}\n\nUser: ${brief.userProfile.name}\nPriority areas: ${brief.priorityAreas.join(", ")}\n\nAll findings:\n${findingsText}\n\nSynthesize into insights as a JSON array.`
    ),
  ])

  const text = typeof response.content === "string" ? response.content : ""

  // Parse insights from response
  const insights: Insight[] = []

  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          const insight: Insight = {
            id: `insight_${insights.length}`,
            title: item.title ?? "Untitled insight",
            content: item.content ?? "",
            supportingFindings: item.supportingFindings ?? [],
            evidenceGrade: ["A", "B", "C", "D", "F"].includes(item.evidenceGrade)
              ? item.evidenceGrade
              : "C",
            domain: item.domain ?? brief.researchType,
          }
          insights.push(insight)

          emit(
            createEvent("insight_synthesized", "synthesizer", { insight })
          )
        }
      }
    }
  } catch {
    // If JSON parsing fails, create a single insight from the text
    const insight: Insight = {
      id: "insight_0",
      title: "Research synthesis",
      content: text.slice(0, 2000),
      supportingFindings: findings.map((f) => f.id),
      evidenceGrade: "C",
      domain: brief.researchType === "both" ? "cross_domain" : brief.researchType,
    }
    insights.push(insight)
    emit(createEvent("insight_synthesized", "synthesizer", { insight }))
  }

  emit(
    createEvent("agent_complete", "synthesizer", {
      summary: `Synthesized ${insights.length} insights from ${findings.length} findings`,
      findingsCount: insights.length,
      durationMs: 0,
    })
  )

  return insights
}
