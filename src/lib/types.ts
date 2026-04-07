import { z } from "zod"

// === Evidence Grading ===
export const EvidenceGradeSchema = z.enum(["A", "B", "C", "D", "F"])
export type EvidenceGrade = z.infer<typeof EvidenceGradeSchema>
// A = meta-analysis/systematic review of RCTs
// B = multiple RCTs with consistent findings
// C = single RCT or strong observational study
// D = limited/preliminary evidence, pilot studies, case reports
// F = expert consensus, theoretical, or no direct evidence

// === User Profiles ===
export const HealthProfileSchema = z.object({
  age: z.number().min(13).max(120),
  sex: z.enum(["male", "female", "other"]),
  weight: z.number().positive().describe("in lbs"),
  height: z.number().positive().describe("in inches"),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
  healthConditions: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  geneticHeritage: z
    .array(z.string())
    .default([])
    .describe("e.g. West African, Scandinavian, East Asian"),
  fitnessGoals: z.array(z.string()).min(1),
  dietaryPreferences: z.array(z.string()).default([]),
  trainingExperience: z.enum(["beginner", "intermediate", "advanced", "elite"]),
  currentProgram: z.string().optional(),
})
export type HealthProfile = z.infer<typeof HealthProfileSchema>

export const CareerProfileSchema = z.object({
  educationLevel: z.enum([
    "high_school",
    "associates",
    "bachelors",
    "masters",
    "doctorate",
    "other",
  ]),
  major: z.string().optional(),
  gpa: z.number().min(0).max(4).optional(),
  interests: z.array(z.string()).min(1),
  skills: z.array(z.string()).min(1),
  workExperience: z
    .array(
      z.object({
        title: z.string(),
        field: z.string(),
        years: z.number().min(0),
      })
    )
    .default([]),
  careerGoals: z.array(z.string()).min(1),
  personalityTraits: z.array(z.string()).default([]),
})
export type CareerProfile = z.infer<typeof CareerProfileSchema>

export const UserProfileSchema = z.object({
  name: z.string().min(1),
  healthProfile: HealthProfileSchema.optional(),
  careerProfile: CareerProfileSchema.optional(),
  rfpText: z.string().optional(),
  uploadedDocuments: z
    .array(
      z.object({
        name: z.string(),
        content: z.string(),
        type: z.enum(["pdf", "csv", "text"]),
      })
    )
    .default([]),
})
export type UserProfile = z.infer<typeof UserProfileSchema>

// === Research Session ===
export type ResearchType = "health" | "career" | "both" | "rfp"

export const StartResearchSchema = z.object({
  userProfile: UserProfileSchema,
  researchType: z.enum(["health", "career", "both", "rfp"]),
})
export type StartResearchInput = z.infer<typeof StartResearchSchema>

export interface ResearchBrief {
  researchType: ResearchType
  userProfile: UserProfile
  researchQuestions: string[]
  priorityAreas: string[]
}

export interface Finding {
  id: string
  agentId: string
  source: string
  sourceUrl?: string
  sourceType: "pubmed" | "exa" | "onet" | "bls" | "eric" | "other"
  evidenceGrade: EvidenceGrade
  title: string
  summary: string
  rawData?: unknown
  timestamp: number
}

export interface Insight {
  id: string
  title: string
  content: string
  supportingFindings: string[]
  evidenceGrade: EvidenceGrade
  domain: "health" | "career" | "finance" | "social" | "cross_domain"
}

export interface ReportSection {
  sectionName: string
  content: string
  citations: Array<{
    title: string
    url?: string
    evidenceGrade: EvidenceGrade
  }>
  domain: "health" | "career" | "finance" | "social" | "methodology" | "overview"
}

export interface Report {
  id: string
  sessionId: string
  title: string
  sections: ReportSection[]
  methodology: {
    databasesSearched: string[]
    papersReviewed: number
    searchQueries: string[]
    inclusionCriteria: string[]
  }
  createdAt: number
}

// === Workout Plan Output ===
export interface WorkoutExercise {
  name: string
  sets: number
  reps: string // e.g. "8-12" or "30s"
  restSeconds: number
  notes?: string
  evidenceGrade?: EvidenceGrade
}

export interface WorkoutDay {
  dayName: string // e.g. "Monday — Push"
  focus: string   // e.g. "Chest, Shoulders, Triceps"
  exercises: WorkoutExercise[]
  warmup?: string
  cooldown?: string
}

export interface WorkoutPlan {
  id: string
  sessionId: string
  title: string
  overview: string
  periodization: string
  weeklySchedule: WorkoutDay[]
  nutritionNotes?: string
  supplementNotes?: string
  progressionScheme: string
  citations: Array<{ title: string; url?: string; evidenceGrade: EvidenceGrade }>
  createdAt: number
}

// === Career Guide Output ===
export interface CareerGuideSection {
  id: string
  title: string
  content: string
  icon: "target" | "trending" | "book" | "dollar" | "users" | "lightbulb" | "route" | "star"
}

export interface CareerPath {
  title: string
  matchScore: number // 0-100
  salary: string
  growthOutlook: string
  description: string
  requiredSkills: string[]
  gapSkills: string[]
}

export interface CareerGuide {
  id: string
  sessionId: string
  headline: string
  summary: string
  paths: CareerPath[]
  sections: CareerGuideSection[]
  actionItems: Array<{ text: string; priority: "high" | "medium" | "low"; timeline: string }>
  citations: Array<{ title: string; url?: string; evidenceGrade: EvidenceGrade }>
  createdAt: number
}

// === Output Type ===
export type OutputType = "paper" | "workout_plan" | "career_guide"

export interface SessionState {
  id: string
  userProfile: UserProfile
  researchType: ResearchType
  status: "pending" | "running" | "complete" | "error"
  brief?: ResearchBrief
  findings: Finding[]
  insights: Insight[]
  report?: Report
  workoutPlan?: WorkoutPlan
  careerGuide?: CareerGuide
  createdAt: number
}
