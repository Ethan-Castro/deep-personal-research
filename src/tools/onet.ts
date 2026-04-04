import { tool } from "@langchain/core/tools"
import { z } from "zod"

const BASE_URL = "https://services.onetcenter.org/ws"

function authHeaders(): HeadersInit {
  const username = process.env.ONET_USERNAME ?? ""
  const password = process.env.ONET_PASSWORD ?? ""
  const encoded = Buffer.from(`${username}:${password}`).toString("base64")
  return {
    Authorization: `Basic ${encoded}`,
    Accept: "application/json",
  }
}

export const onetSearchOccupations = tool(
  async ({ keyword }) => {
    const url = `${BASE_URL}/online/search?keyword=${encodeURIComponent(keyword)}`
    const res = await fetch(url, { headers: authHeaders() })

    if (!res.ok) {
      return JSON.stringify({ error: `O*NET API error: ${res.status} ${res.statusText}` })
    }

    const data = await res.json()
    const occupations = (data.occupation ?? []).slice(0, 15).map(
      (o: { code: string; title: string; relevance_score?: number; tags?: { bright_outlook?: boolean } }) => ({
        code: o.code,
        title: o.title,
        relevanceScore: o.relevance_score,
        brightOutlook: o.tags?.bright_outlook ?? false,
      })
    )

    return JSON.stringify({ occupations, totalResults: data.total ?? occupations.length })
  },
  {
    name: "onet_search_occupations",
    description:
      "Search O*NET for occupations matching a keyword. Returns occupation codes, titles, and relevance scores. Bright Outlook tags indicate growing fields.",
    schema: z.object({
      keyword: z.string().describe("Occupation keyword to search (e.g., 'software developer', 'data analyst')"),
    }),
  }
)

export const onetGetOccupationDetails = tool(
  async ({ code }) => {
    const headers = authHeaders()

    // Fetch multiple endpoints in parallel for comprehensive data
    const [summaryRes, skillsRes, knowledgeRes, techRes, outlookRes] = await Promise.all([
      fetch(`${BASE_URL}/online/occupations/${code}/summary`, { headers }),
      fetch(`${BASE_URL}/online/occupations/${code}/summary/skills`, { headers }),
      fetch(`${BASE_URL}/online/occupations/${code}/summary/knowledge`, { headers }),
      fetch(`${BASE_URL}/online/occupations/${code}/summary/technology_skills`, { headers }),
      fetch(`${BASE_URL}/online/occupations/${code}/summary/job_outlook`, { headers }),
    ])

    const summary = summaryRes.ok ? await summaryRes.json() : null
    const skills = skillsRes.ok ? await skillsRes.json() : null
    const knowledge = knowledgeRes.ok ? await knowledgeRes.json() : null
    const tech = techRes.ok ? await techRes.json() : null
    const outlook = outlookRes.ok ? await outlookRes.json() : null

    return JSON.stringify({
      code,
      title: summary?.title ?? code,
      description: summary?.description ?? "",
      skills: (skills?.element ?? []).slice(0, 10).map((s: { name: string; score?: { value: number } }) => ({
        name: s.name,
        importance: s.score?.value,
      })),
      knowledge: (knowledge?.element ?? []).slice(0, 10).map((k: { name: string; score?: { value: number } }) => ({
        name: k.name,
        importance: k.score?.value,
      })),
      technology: (tech?.category ?? []).slice(0, 10).map((t: { title?: { name: string }; example?: { name: string }[] }) => ({
        category: t.title?.name,
        examples: (t.example ?? []).slice(0, 3).map((e: { name: string }) => e.name),
      })),
      outlook: outlook
        ? {
            brightOutlook: outlook.bright_outlook ?? false,
            projectedGrowth: outlook.projected_growth ?? null,
            projectedOpenings: outlook.projected_openings ?? null,
            salary: outlook.salary
              ? {
                  median: outlook.salary.annual_median,
                  range: `${outlook.salary.annual_10th_percentile}-${outlook.salary.annual_90th_percentile}`,
                }
              : null,
          }
        : null,
    })
  },
  {
    name: "onet_get_occupation_details",
    description:
      "Get detailed O*NET occupation profile including skills, knowledge, technology, salary, and job outlook. Use the occupation code from onet_search_occupations.",
    schema: z.object({
      code: z.string().describe("O*NET occupation code (e.g., '15-1252.00' for Software Developers)"),
    }),
  }
)

export const onetGetRelatedOccupations = tool(
  async ({ code }) => {
    const url = `${BASE_URL}/online/occupations/${code}/summary/related_occupations`
    const res = await fetch(url, { headers: authHeaders() })

    if (!res.ok) {
      return JSON.stringify({ error: `O*NET API error: ${res.status} ${res.statusText}` })
    }

    const data = await res.json()
    const related = (data.occupation ?? []).slice(0, 15).map(
      (o: { code: string; title: string }) => ({
        code: o.code,
        title: o.title,
      })
    )

    return JSON.stringify({ relatedOccupations: related })
  },
  {
    name: "onet_get_related_occupations",
    description:
      "Find related occupations for a given O*NET occupation code. Useful for exploring career pathways and lateral moves.",
    schema: z.object({
      code: z.string().describe("O*NET occupation code (e.g., '15-1252.00')"),
    }),
  }
)
