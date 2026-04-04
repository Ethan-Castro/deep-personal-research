import { createEvent, type EmitFn } from "@/lib/events"
import type { Finding, ResearchBrief } from "@/lib/types"
import {
  runResearcher,
  HEALTH_AGENTS,
  CAREER_AGENTS,
  type ResearcherConfig,
} from "./researcher"

function buildUserContext(brief: ResearchBrief): string {
  const profile = brief.userProfile
  const parts: string[] = [`Name: ${profile.name}`]

  if (profile.healthProfile) {
    const h = profile.healthProfile
    parts.push(
      `Health: ${h.age}yo ${h.sex}, ${h.weight}lbs, ${h.trainingExperience} lifter, goals: ${h.fitnessGoals.join(", ")}`
    )
    if (h.geneticHeritage.length > 0)
      parts.push(`Heritage: ${h.geneticHeritage.join(", ")}`)
    if (h.healthConditions.length > 0)
      parts.push(`Conditions: ${h.healthConditions.join(", ")}`)
  }

  if (profile.careerProfile) {
    const c = profile.careerProfile
    parts.push(
      `Career: ${c.educationLevel}${c.major ? ` in ${c.major}` : ""}, skills: ${c.skills.join(", ")}, goals: ${c.careerGoals.join(", ")}`
    )
  }

  return parts.join("\n")
}

function distributeQuestions(
  questions: string[],
  agentCount: number
): string[][] {
  const distributed: string[][] = Array.from({ length: agentCount }, () => [])
  questions.forEach((q, i) => {
    distributed[i % agentCount].push(q)
  })
  return distributed
}

export async function runSupervisor(
  brief: ResearchBrief,
  emit: EmitFn
): Promise<Finding[]> {
  emit(
    createEvent("agent_spawned", "supervisor", {
      name: "supervisor",
      role: "Research Supervisor",
      team: "orchestrator",
      description: "Coordinating research agents across domains",
    })
  )

  emit(
    createEvent("agent_thinking", "supervisor", {
      thought: `Planning research strategy for ${brief.researchType} domain(s)...`,
      step: 1,
    })
  )

  const userContext = buildUserContext(brief)
  const allFindings: Finding[] = []

  // Phase 1: Deploy data-gathering agents in parallel
  const phase1Promises: Promise<Finding[]>[] = []
  const phase1Agents: string[] = []

  if (brief.researchType === "health" || brief.researchType === "both") {
    const healthQuestions = brief.researchQuestions.filter(
      (q) =>
        q.toLowerCase().includes("train") ||
        q.toLowerCase().includes("fitness") ||
        q.toLowerCase().includes("health") ||
        q.toLowerCase().includes("genetic") ||
        q.toLowerCase().includes("nutrition") ||
        q.toLowerCase().includes("supplement") ||
        q.toLowerCase().includes("exercise") ||
        q.toLowerCase().includes("muscle") ||
        q.toLowerCase().includes("recovery") ||
        brief.researchType === "health"
    )

    // Only the first 2 agents (data gatherers) in phase 1
    const dataAgents = HEALTH_AGENTS.slice(0, 2)
    const distributed = distributeQuestions(
      healthQuestions.length > 0 ? healthQuestions : brief.researchQuestions.slice(0, 5),
      dataAgents.length
    )

    dataAgents.forEach((agent, i) => {
      const config: ResearcherConfig = { ...agent, questions: distributed[i] }
      phase1Agents.push(agent.name)
      phase1Promises.push(runResearcher(config, userContext, emit))
    })
  }

  if (brief.researchType === "career" || brief.researchType === "both") {
    const careerQuestions = brief.researchQuestions.filter(
      (q) =>
        q.toLowerCase().includes("career") ||
        q.toLowerCase().includes("job") ||
        q.toLowerCase().includes("occupation") ||
        q.toLowerCase().includes("skill") ||
        q.toLowerCase().includes("salary") ||
        q.toLowerCase().includes("industry") ||
        q.toLowerCase().includes("education") ||
        brief.researchType === "career"
    )

    const dataAgents = CAREER_AGENTS.slice(0, 2)
    const distributed = distributeQuestions(
      careerQuestions.length > 0 ? careerQuestions : brief.researchQuestions.slice(0, 5),
      dataAgents.length
    )

    dataAgents.forEach((agent, i) => {
      const config: ResearcherConfig = { ...agent, questions: distributed[i] }
      phase1Agents.push(agent.name)
      phase1Promises.push(runResearcher(config, userContext, emit))
    })
  }

  emit(
    createEvent("agent_thinking", "supervisor", {
      thought: `Phase 1: Deploying ${phase1Agents.length} data-gathering agents in parallel: ${phase1Agents.join(", ")}`,
      step: 2,
    })
  )

  // Run phase 1 in parallel
  const phase1Results = await Promise.all(phase1Promises)
  for (const findings of phase1Results) {
    allFindings.push(...findings)
  }

  emit(
    createEvent("agent_thinking", "supervisor", {
      thought: `Phase 1 complete. ${allFindings.length} findings collected. Deploying synthesis agents...`,
      step: 3,
    })
  )

  // Phase 2: Deploy synthesis agents with context from phase 1
  const phase2Promises: Promise<Finding[]>[] = []
  const findingsContext = allFindings
    .map((f) => `- ${f.title}: ${f.summary.slice(0, 200)}`)
    .join("\n")
  const enrichedContext = `${userContext}\n\nFindings from data-gathering phase:\n${findingsContext}`

  if (brief.researchType === "health" || brief.researchType === "both") {
    const protocolBuilder = HEALTH_AGENTS[2] // protocol_builder
    const config: ResearcherConfig = {
      ...protocolBuilder,
      questions: [
        "Based on the research findings, build a personalized training protocol with specific sets, reps, and frequency recommendations.",
        "Create a supplementation protocol with evidence-graded dosages and timing.",
        "Design a nutrition framework personalized to the user's goals and heritage.",
      ],
    }
    phase2Promises.push(runResearcher(config, enrichedContext, emit))
  }

  if (brief.researchType === "career" || brief.researchType === "both") {
    const pathwayBuilder = CAREER_AGENTS[2] // pathway_builder
    const config: ResearcherConfig = {
      ...pathwayBuilder,
      questions: [
        "Based on the occupation data and trends, build a 1-year and 5-year career roadmap with specific milestones.",
        "Identify the top 3 skill gaps and recommend specific courses or certifications to close them.",
        "Create a prioritized list of career moves ranked by growth potential, salary, and alignment with user's interests.",
      ],
    }
    phase2Promises.push(runResearcher(config, enrichedContext, emit))
  }

  const phase2Results = await Promise.all(phase2Promises)
  for (const findings of phase2Results) {
    allFindings.push(...findings)
  }

  emit(
    createEvent("agent_complete", "supervisor", {
      summary: `Research complete. ${allFindings.length} total findings from ${phase1Agents.length + phase2Promises.length} agents.`,
      findingsCount: allFindings.length,
      durationMs: 0,
    })
  )

  return allFindings
}
