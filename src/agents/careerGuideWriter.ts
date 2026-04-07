import { getModel } from "@/lib/models"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import type { Finding, Insight, ResearchBrief, CareerGuide, CareerPath, CareerGuideSection } from "@/lib/types"
import type { EmitFn } from "@/lib/events"
import { createEvent } from "@/lib/events"

const CAREER_GUIDE_PROMPT = `You are the Career Guide Generator for Personal PI. You produce a structured, data-driven career guidance document from research findings and insights.

Your career guide must be:
1. Personalized — address the user's specific background, skills, and goals
2. Data-driven — cite salary data, growth projections, and labor market stats
3. Actionable — specific next steps with timelines and priorities
4. Honest — clearly state skill gaps and what's needed to close them

Output a SINGLE JSON object with this exact structure:
{
  "headline": "Career Roadmap for [Name]: From [Current] to [Goal]",
  "summary": "2-3 sentence overview of their career trajectory and top recommendation",
  "paths": [
    {
      "title": "Senior Data Scientist",
      "matchScore": 85,
      "salary": "$120,000 - $180,000",
      "growthOutlook": "22% growth (Much faster than average)",
      "description": "Why this path fits and what it involves",
      "requiredSkills": ["Python", "Machine Learning", "Statistics"],
      "gapSkills": ["Deep Learning", "MLOps"]
    }
  ],
  "sections": [
    {
      "id": "skills-analysis",
      "title": "Skills Analysis",
      "content": "Detailed analysis of current skills vs. market demand...",
      "icon": "target"
    },
    {
      "id": "market-trends",
      "title": "Market Trends",
      "content": "Current trends in relevant industries...",
      "icon": "trending"
    },
    {
      "id": "education-path",
      "title": "Education & Certifications",
      "content": "Recommended learning path...",
      "icon": "book"
    },
    {
      "id": "salary-outlook",
      "title": "Salary & Compensation",
      "content": "Detailed salary analysis...",
      "icon": "dollar"
    },
    {
      "id": "networking",
      "title": "Networking & Community",
      "content": "Professional communities and networking strategies...",
      "icon": "users"
    }
  ],
  "actionItems": [
    {
      "text": "Complete AWS Solutions Architect certification",
      "priority": "high",
      "timeline": "Next 3 months"
    }
  ],
  "citations": [{"title": "...", "url": "...", "evidenceGrade": "B"}]
}

Icon options: "target", "trending", "book", "dollar", "users", "lightbulb", "route", "star"
Include 3-5 career paths ranked by match score. Include 4-6 sections. Include 5-10 action items.`

export async function writeCareerGuide(
  findings: Finding[],
  insights: Insight[],
  brief: ResearchBrief,
  sessionId: string,
  emit: EmitFn
): Promise<CareerGuide> {
  emit(
    createEvent("agent_spawned", "career_guide_writer", {
      name: "career_guide_writer",
      role: "Career Guide Writer",
      team: "synthesis",
      description: "Generating personalized career guidance",
    })
  )

  const model = getModel("reportWriter")

  const careerProfile = brief.userProfile.careerProfile
  const profileText = careerProfile
    ? `Education: ${careerProfile.educationLevel}${careerProfile.major ? ` in ${careerProfile.major}` : ""}${careerProfile.gpa ? `, GPA: ${careerProfile.gpa}` : ""}
Skills: ${careerProfile.skills.join(", ")}
Interests: ${careerProfile.interests.join(", ")}
Career Goals: ${careerProfile.careerGoals.join(", ")}
Work Experience: ${careerProfile.workExperience.map((w) => `${w.title} in ${w.field} (${w.years}yr)`).join(", ") || "None"}
Personality: ${careerProfile.personalityTraits.join(", ") || "Not specified"}`
    : "No career profile available"

  const insightsText = insights
    .filter((i) => i.domain === "career" || i.domain === "cross_domain")
    .map((ins) => `[${ins.evidenceGrade}] ${ins.title}: ${ins.content}`)
    .join("\n\n")

  const findingsText = findings
    .slice(0, 20)
    .map((f) => `[${f.evidenceGrade}] ${f.title} — ${f.summary.slice(0, 150)} [${f.sourceType}]`)
    .join("\n")

  emit(
    createEvent("agent_thinking", "career_guide_writer", {
      thought: "Analyzing career paths and building guidance...",
      step: 1,
    })
  )

  const response = await model.invoke([
    new SystemMessage(CAREER_GUIDE_PROMPT),
    new HumanMessage(
      `User: ${brief.userProfile.name}
${profileText}

RESEARCH INSIGHTS:
${insightsText}

SUPPORTING FINDINGS:
${findingsText}

Generate the career guide as a single JSON object.`
    ),
  ])

  const text = typeof response.content === "string" ? response.content : ""

  let parsed: Record<string, unknown> = {}
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      let depth = 0
      const start = text.indexOf("{")
      for (let i = start; i < text.length; i++) {
        if (text[i] === "{") depth++
        if (text[i] === "}") depth--
        if (depth === 0) {
          try {
            parsed = JSON.parse(text.slice(start, i + 1))
          } catch {
            // Fall through
          }
          break
        }
      }
    }
  }

  const validIcons = ["target", "trending", "book", "dollar", "users", "lightbulb", "route", "star"] as const
  type IconType = typeof validIcons[number]

  const paths: CareerPath[] = Array.isArray(parsed.paths)
    ? (parsed.paths as Record<string, unknown>[]).map((p) => ({
        title: String(p.title ?? "Career Path"),
        matchScore: Math.min(100, Math.max(0, Number(p.matchScore ?? 50))),
        salary: String(p.salary ?? ""),
        growthOutlook: String(p.growthOutlook ?? ""),
        description: String(p.description ?? ""),
        requiredSkills: Array.isArray(p.requiredSkills) ? (p.requiredSkills as string[]).map(String) : [],
        gapSkills: Array.isArray(p.gapSkills) ? (p.gapSkills as string[]).map(String) : [],
      }))
    : []

  const sections: CareerGuideSection[] = Array.isArray(parsed.sections)
    ? (parsed.sections as Record<string, unknown>[]).map((s, i) => ({
        id: String(s.id ?? `section-${i}`),
        title: String(s.title ?? "Section"),
        content: String(s.content ?? ""),
        icon: (validIcons.includes(String(s.icon ?? "") as IconType) ? String(s.icon) : "lightbulb") as IconType,
      }))
    : []

  const guide: CareerGuide = {
    id: `career_guide_${sessionId}`,
    sessionId,
    headline: String(parsed.headline ?? `Career Guide for ${brief.userProfile.name}`),
    summary: String(parsed.summary ?? ""),
    paths,
    sections,
    actionItems: Array.isArray(parsed.actionItems)
      ? (parsed.actionItems as Record<string, unknown>[]).map((a) => ({
          text: String(a.text ?? ""),
          priority: (["high", "medium", "low"].includes(String(a.priority ?? "")) ? String(a.priority) : "medium") as "high" | "medium" | "low",
          timeline: String(a.timeline ?? ""),
        }))
      : [],
    citations: Array.isArray(parsed.citations)
      ? (parsed.citations as Record<string, unknown>[]).map((c) => ({
          title: String(c.title ?? ""),
          url: c.url ? String(c.url) : undefined,
          evidenceGrade: (String(c.evidenceGrade ?? "C") as "A" | "B" | "C" | "D" | "F"),
        }))
      : [],
    createdAt: Date.now(),
  }

  emit(
    createEvent("career_guide_generated", "career_guide_writer", {
      careerGuide: guide,
    })
  )

  emit(
    createEvent("agent_complete", "career_guide_writer", {
      summary: `Generated career guide with ${guide.paths.length} paths and ${guide.sections.length} sections`,
      findingsCount: guide.paths.length,
      durationMs: 0,
    })
  )

  return guide
}
