import { generateBrief } from "./briefGenerator"
import { runSupervisor } from "./supervisor"
import { synthesizeFindings } from "./synthesizer"
import { writeReport } from "./reportWriter"
import { gradeEvidence } from "@/tools/evidenceGrader"
import type { Finding, Report, SessionState } from "@/lib/types"
import type { EmitFn } from "@/lib/events"
import { createEvent } from "@/lib/events"

export async function runResearchPipeline(
  session: SessionState,
  emit: EmitFn
): Promise<Report> {
  const startTime = Date.now()

  // Emit session started
  emit(
    createEvent("session_started", "system", {
      sessionId: session.id,
      researchType: session.researchType,
      userName: session.userProfile.name,
    })
  )

  // Step 1: Generate research brief
  const brief = await generateBrief(
    session.userProfile,
    session.researchType,
    emit
  )

  // Step 2: Run supervisor (spawns sub-agents, collects findings)
  const rawFindings = await runSupervisor(brief, emit)

  // Step 3: Grade evidence for each finding
  emit(
    createEvent("agent_spawned", "evidence_grader", {
      name: "evidence_grader",
      role: "Evidence Grader",
      team: "synthesis",
      description: "Grading evidence quality for all findings",
    })
  )

  const gradedFindings: Finding[] = []
  for (const finding of rawFindings) {
    try {
      const gradeResult = await gradeEvidence.invoke({
        title: finding.title,
        summary: finding.summary,
        sourceType: finding.sourceType,
        studyDetails: finding.rawData ? JSON.stringify(finding.rawData).slice(0, 500) : undefined,
      })

      const parsed = JSON.parse(gradeResult)
      gradedFindings.push({
        ...finding,
        evidenceGrade: parsed.grade ?? finding.evidenceGrade,
      })
    } catch {
      gradedFindings.push(finding)
    }
  }

  emit(
    createEvent("agent_complete", "evidence_grader", {
      summary: `Graded ${gradedFindings.length} findings`,
      findingsCount: gradedFindings.length,
      durationMs: 0,
    })
  )

  // Step 4: Synthesize findings into insights
  const insights = await synthesizeFindings(gradedFindings, brief, emit)

  // Step 5: Write the final report
  const report = await writeReport(
    gradedFindings,
    insights,
    brief,
    session.id,
    emit
  )

  // Emit completion
  emit(
    createEvent("research_complete", "system", {
      reportId: report.id,
      totalFindings: gradedFindings.length,
      totalInsights: insights.length,
      totalDurationMs: Date.now() - startTime,
    })
  )

  return report
}
