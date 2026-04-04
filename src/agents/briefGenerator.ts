import { getModel } from "@/lib/models"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { BRIEF_GENERATOR_PROMPT } from "@/prompts/briefGenerator"
import type { ResearchBrief, UserProfile, ResearchType } from "@/lib/types"
import type { EmitFn } from "@/lib/events"
import { createEvent } from "@/lib/events"

export async function generateBrief(
  userProfile: UserProfile,
  researchType: ResearchType,
  emit: EmitFn
): Promise<ResearchBrief> {
  emit(
    createEvent("agent_thinking", "brief_generator", {
      thought: "Analyzing user profile and generating research plan...",
      step: 1,
    })
  )

  const model = getModel("briefGenerator")

  const profileSummary = buildProfileSummary(userProfile, researchType)

  const response = await model.invoke([
    new SystemMessage(BRIEF_GENERATOR_PROMPT),
    new HumanMessage(
      `Research type: ${researchType}\n\nUser Profile:\n${profileSummary}\n\nGenerate a research brief as JSON.`
    ),
  ])

  const text = typeof response.content === "string" ? response.content : ""
  const jsonMatch = text.match(/\{[\s\S]*\}/)

  let parsed: { researchQuestions: string[]; priorityAreas: string[] }
  try {
    parsed = JSON.parse(jsonMatch?.[0] ?? "{}")
  } catch {
    parsed = {
      researchQuestions: ["General research on user's goals"],
      priorityAreas: ["Primary goals"],
    }
  }

  const brief: ResearchBrief = {
    researchType,
    userProfile,
    researchQuestions: parsed.researchQuestions ?? [],
    priorityAreas: parsed.priorityAreas ?? [],
  }

  emit(
    createEvent("brief_generated", "brief_generator", {
      researchQuestions: brief.researchQuestions,
      priorityAreas: brief.priorityAreas,
    })
  )

  return brief
}

function buildProfileSummary(profile: UserProfile, researchType: ResearchType): string {
  const parts: string[] = [`Name: ${profile.name}`]

  if ((researchType === "health" || researchType === "both") && profile.healthProfile) {
    const h = profile.healthProfile
    parts.push(`\n--- Health Profile ---`)
    parts.push(`Age: ${h.age}, Sex: ${h.sex}`)
    parts.push(`Weight: ${h.weight} lbs, Height: ${h.height} inches`)
    parts.push(`Activity level: ${h.activityLevel}`)
    parts.push(`Training experience: ${h.trainingExperience}`)
    if (h.currentProgram) parts.push(`Current program: ${h.currentProgram}`)
    parts.push(`Fitness goals: ${h.fitnessGoals.join(", ")}`)
    if (h.geneticHeritage.length > 0)
      parts.push(`Genetic heritage: ${h.geneticHeritage.join(", ")}`)
    if (h.healthConditions.length > 0)
      parts.push(`Health conditions: ${h.healthConditions.join(", ")}`)
    if (h.medications.length > 0) parts.push(`Medications: ${h.medications.join(", ")}`)
    if (h.dietaryPreferences.length > 0)
      parts.push(`Dietary preferences: ${h.dietaryPreferences.join(", ")}`)
  }

  if ((researchType === "career" || researchType === "both") && profile.careerProfile) {
    const c = profile.careerProfile
    parts.push(`\n--- Career Profile ---`)
    parts.push(`Education: ${c.educationLevel}${c.major ? ` in ${c.major}` : ""}`)
    if (c.gpa) parts.push(`GPA: ${c.gpa}`)
    parts.push(`Interests: ${c.interests.join(", ")}`)
    parts.push(`Skills: ${c.skills.join(", ")}`)
    parts.push(`Career goals: ${c.careerGoals.join(", ")}`)
    if (c.workExperience.length > 0) {
      parts.push(
        `Work experience: ${c.workExperience.map((w) => `${w.title} in ${w.field} (${w.years}y)`).join("; ")}`
      )
    }
    if (c.personalityTraits.length > 0)
      parts.push(`Personality traits: ${c.personalityTraits.join(", ")}`)
  }

  if (profile.uploadedDocuments.length > 0) {
    parts.push(`\n--- Uploaded Documents ---`)
    for (const doc of profile.uploadedDocuments) {
      parts.push(`[${doc.type}] ${doc.name}: ${doc.content.slice(0, 500)}...`)
    }
  }

  return parts.join("\n")
}
