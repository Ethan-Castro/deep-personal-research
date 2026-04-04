import { tool } from "@langchain/core/tools"
import { z } from "zod"
import Exa from "exa-js"

function getClient() {
  return new Exa(process.env.EXA_API_KEY!)
}

export const exaSearch = tool(
  async ({ query, numResults, category }) => {
    const exa = getClient()
    const result = await exa.search(query, {
      type: "auto",
      numResults: numResults ?? 10,
      category: category as "research paper" | "company" | "news" | undefined,
      contents: {
        text: { maxCharacters: 3000 },
        highlights: { numSentences: 3 },
      },
    })

    return JSON.stringify(
      result.results.map((r) => ({
        title: r.title,
        url: r.url,
        publishedDate: r.publishedDate,
        author: r.author,
        text: r.text?.slice(0, 2000),
        highlights: r.highlights,
      }))
    )
  },
  {
    name: "exa_search",
    description:
      "Search the web using Exa AI for high-quality results with content extraction. Use category='research paper' for scientific queries.",
    schema: z.object({
      query: z.string().describe("Search query"),
      numResults: z.number().min(1).max(25).optional().describe("Number of results (default 10)"),
      category: z
        .enum(["research paper", "company", "news", "personal site"])
        .optional()
        .describe("Filter by content category"),
    }),
  }
)

export const exaDeepResearch = tool(
  async ({ instructions }) => {
    const exa = getClient()

    // Create async research task
    const task = await exa.research.create({
      instructions,
      model: "exa-research",
    })

    // Poll for completion (max 120s)
    const result = await exa.research.pollUntilFinished(task.researchId, {
      pollInterval: 3_000,
      timeoutMs: 120_000,
    }).catch(() => null)

    if (!result || result.status !== "completed") {
      return JSON.stringify({ error: "Research task did not complete", id: task.researchId })
    }

    return JSON.stringify({
      content: result.output,
      costDollars: result.costDollars,
    })
  },
  {
    name: "exa_deep_research",
    description:
      "Run a deep research task using Exa AI. Takes 30-120 seconds. Use for comprehensive multi-step research that needs synthesis across many sources.",
    schema: z.object({
      instructions: z
        .string()
        .max(4096)
        .describe("Detailed research instructions (max 4096 chars). Be specific about what to find and how to structure the output."),
    }),
  }
)
