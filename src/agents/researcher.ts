import { getModel } from "@/lib/models"
import { HumanMessage, SystemMessage, type BaseMessage } from "@langchain/core/messages"
import { ToolMessage } from "@langchain/core/messages"
import { getResearcherPrompt } from "@/prompts/researcher"
import { exaSearch, exaDeepResearch } from "@/tools/exa"
import { pubmedSearch, pubmedGetFullText } from "@/tools/pubmed"
import { onetSearchOccupations, onetGetOccupationDetails, onetGetRelatedOccupations } from "@/tools/onet"
import type { Finding } from "@/lib/types"
import type { EmitFn } from "@/lib/events"
import { createEvent } from "@/lib/events"
import type { StructuredToolInterface } from "@langchain/core/tools"

export interface ResearcherConfig {
  name: string
  role: string
  domain: "health" | "career"
  focusArea: string
  tools: StructuredToolInterface[]
  questions: string[]
}

// Pre-built agent configurations
export const HEALTH_AGENTS: Omit<ResearcherConfig, "questions">[] = [
  {
    name: "pubmed_researcher",
    role: "PubMed Literature Researcher",
    domain: "health",
    focusArea:
      "Search PubMed for peer-reviewed studies on exercise science, training protocols, nutrition, and supplementation. Focus on meta-analyses and systematic reviews.",
    tools: [pubmedSearch, pubmedGetFullText],
  },
  {
    name: "genetics_analyst",
    role: "Genetic Heritage & Population Fitness Analyst",
    domain: "health",
    focusArea:
      "Research genetic heritage fitness inclinations, population-level athletic distributions, cultural sport tendencies, and ancestry-based health insights using web search.",
    tools: [exaSearch, exaDeepResearch],
  },
  {
    name: "protocol_builder",
    role: "Training & Nutrition Protocol Builder",
    domain: "health",
    focusArea:
      "Build personalized, evidence-based training programs, nutrition plans, and supplement protocols. Synthesize findings from other researchers into actionable protocols with specific dosages, sets/reps, and timing.",
    tools: [exaSearch, pubmedSearch],
  },
]

export const CAREER_AGENTS: Omit<ResearcherConfig, "questions">[] = [
  {
    name: "onet_researcher",
    role: "O*NET Occupation Researcher",
    domain: "career",
    focusArea:
      "Search O*NET for occupations matching the user's skills, education, and interests. Get detailed occupation profiles with skill requirements, salary data, and growth outlook.",
    tools: [onetSearchOccupations, onetGetOccupationDetails, onetGetRelatedOccupations],
  },
  {
    name: "trends_analyst",
    role: "Labor Market Trends Analyst",
    domain: "career",
    focusArea:
      "Research labor market trends, emerging fields, salary trajectories, industry growth projections, and in-demand skills using web search.",
    tools: [exaSearch, exaDeepResearch],
  },
  {
    name: "pathway_builder",
    role: "Career Pathway Builder",
    domain: "career",
    focusArea:
      "Build concrete career pathways with timelines, skill gaps to close, required certifications, recommended courses, and milestone targets. Synthesize occupation data and trends into actionable roadmaps.",
    tools: [exaSearch, onetGetRelatedOccupations],
  },
]

export async function runResearcher(
  config: ResearcherConfig,
  userContext: string,
  emit: EmitFn
): Promise<Finding[]> {
  const agentId = config.name

  emit(
    createEvent(
      "agent_spawned",
      agentId,
      {
        name: config.name,
        role: config.role,
        team: config.domain,
        description: config.focusArea,
      },
      "supervisor"
    )
  )

  const model = getModel("researcher")
  const systemPrompt = getResearcherPrompt(
    config.role,
    config.domain,
    config.focusArea,
    userContext
  )

  // Bind tools to model
  const toolMap = new Map(config.tools.map((t) => [t.name, t]))
  const modelWithTools = model.bindTools(config.tools)

  const messages: BaseMessage[] = [
    new SystemMessage(systemPrompt),
    new HumanMessage(
      `Research these questions:\n${config.questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}\n\nUse your tools to find evidence. Report each finding as JSON.`
    ),
  ]

  const findings: Finding[] = []
  let iterations = 0
  const maxIterations = 8

  while (iterations < maxIterations) {
    iterations++

    emit(
      createEvent("agent_thinking", agentId, {
        thought: `Research iteration ${iterations}/${maxIterations}...`,
        step: iterations,
      })
    )

    const response = await modelWithTools.invoke(messages)
    messages.push(response)

    // Check for tool calls
    const toolCalls = response.tool_calls ?? []
    if (toolCalls.length === 0) break

    for (const tc of toolCalls) {
      const toolInstance = toolMap.get(tc.name)
      if (!toolInstance) continue

      emit(
        createEvent("agent_tool_call", agentId, {
          toolName: tc.name,
          toolInput: JSON.stringify(tc.args).slice(0, 200),
          toolOutputPreview: "Running...",
        })
      )

      try {
        const result = await toolInstance.invoke(tc.args)
        const resultStr = typeof result === "string" ? result : JSON.stringify(result)

        messages.push(new ToolMessage({ content: resultStr, tool_call_id: tc.id! }))

        emit(
          createEvent("agent_tool_call", agentId, {
            toolName: tc.name,
            toolInput: JSON.stringify(tc.args).slice(0, 200),
            toolOutputPreview: resultStr.slice(0, 300),
          })
        )
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err)
        messages.push(new ToolMessage({ content: `Error: ${errMsg}`, tool_call_id: tc.id! }))
      }
    }
  }

  // Extract findings from the final message
  const lastMsg = messages[messages.length - 1]
  const content =
    typeof lastMsg === "object" && "content" in lastMsg
      ? typeof lastMsg.content === "string"
        ? lastMsg.content
        : ""
      : ""

  // Try to parse JSON findings from the response
  const jsonMatches = content.matchAll(/\{[^{}]*"title"[^{}]*\}/g)
  for (const match of jsonMatches) {
    try {
      const parsed = JSON.parse(match[0])
      const finding: Finding = {
        id: `${agentId}_${findings.length}`,
        agentId,
        title: parsed.title ?? "Untitled finding",
        summary: parsed.summary ?? parsed.relevance ?? "",
        source: parsed.source ?? config.domain,
        sourceUrl: parsed.sourceUrl ?? parsed.url ?? undefined,
        sourceType: parsed.sourceType ?? (config.domain === "health" ? "pubmed" : "onet"),
        evidenceGrade: "C",
        timestamp: Date.now(),
      }
      findings.push(finding)

      emit(
        createEvent("agent_finding", agentId, { finding }, "supervisor")
      )
    } catch {
      // Skip unparseable findings
    }
  }

  // If no JSON findings were parsed, create a single finding from the response
  if (findings.length === 0 && content.length > 50) {
    const finding: Finding = {
      id: `${agentId}_0`,
      agentId,
      title: `${config.role} findings`,
      summary: content.slice(0, 1000),
      source: config.domain,
      sourceType: config.domain === "health" ? "pubmed" : "onet",
      evidenceGrade: "C",
      timestamp: Date.now(),
    }
    findings.push(finding)
    emit(createEvent("agent_finding", agentId, { finding }, "supervisor"))
  }

  emit(
    createEvent("agent_complete", agentId, {
      summary: `Found ${findings.length} findings`,
      findingsCount: findings.length,
      durationMs: 0,
    })
  )

  return findings
}
