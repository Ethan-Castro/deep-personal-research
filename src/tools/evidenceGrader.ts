import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { getModel } from "@/lib/models"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"

const GRADING_PROMPT = `You are an evidence quality grader for scientific and professional research findings.

Given a research finding, classify its evidence strength using this rubric:

A — Meta-analysis or systematic review of multiple RCTs. The gold standard. Multiple high-quality studies have been pooled and analyzed together.

B — Multiple RCTs (randomized controlled trials) with consistent findings. Strong evidence from well-designed experiments that agree with each other.

C — Single RCT or strong observational study. Good evidence from one well-designed experiment, or a large, well-controlled observational study (cohort, case-control).

D — Limited or preliminary evidence. Pilot studies, case reports, small sample sizes, animal studies only, or observational studies with significant confounds.

F — Expert consensus, theoretical reasoning, or no direct evidence. Recommendations based on professional experience, mechanistic reasoning, or extrapolation rather than direct research.

Respond with ONLY a JSON object: {"grade": "A"|"B"|"C"|"D"|"F", "rationale": "one sentence explanation"}

Consider:
- Study design (RCT > observational > case report > opinion)
- Sample size
- Whether results have been replicated
- Recency and relevance of the research
- Source quality (peer-reviewed journal vs. preprint vs. blog)`

export const gradeEvidence = tool(
  async ({ title, summary, sourceType, studyDetails }) => {
    const model = getModel("evidenceGrader")

    const input = `Finding: "${title}"
Summary: ${summary}
Source type: ${sourceType}
${studyDetails ? `Study details: ${studyDetails}` : ""}`

    const response = await model.invoke([
      new SystemMessage(GRADING_PROMPT),
      new HumanMessage(input),
    ])

    const text = typeof response.content === "string" ? response.content : ""

    try {
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*?\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return JSON.stringify({
          grade: parsed.grade,
          rationale: parsed.rationale,
        })
      }
    } catch {
      // Fall back to extracting grade letter
    }

    // Fallback: look for a grade letter
    const gradeMatch = text.match(/[ABCDF]/)
    return JSON.stringify({
      grade: gradeMatch?.[0] ?? "F",
      rationale: text.slice(0, 200),
    })
  },
  {
    name: "grade_evidence",
    description:
      "Grade the evidence strength of a research finding on a scale of A-F. A=meta-analysis, B=multiple RCTs, C=single RCT, D=preliminary, F=expert consensus only.",
    schema: z.object({
      title: z.string().describe("Title of the finding"),
      summary: z.string().describe("Summary of what the finding says"),
      sourceType: z
        .enum(["pubmed", "exa", "onet", "bls", "eric", "other"])
        .describe("Where this finding came from"),
      studyDetails: z
        .string()
        .optional()
        .describe("Additional details: study design, sample size, journal, etc."),
    }),
  }
)
