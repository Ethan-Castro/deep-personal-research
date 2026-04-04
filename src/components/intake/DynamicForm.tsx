"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import type { ResearchType } from "@/lib/types"

interface DynamicFormProps {
  researchType: ResearchType
  onBack: () => void
}

export function DynamicForm({ researchType, onBack }: DynamicFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")

  // Health fields
  const [age, setAge] = useState("")
  const [sex, setSex] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [activityLevel, setActivityLevel] = useState("")
  const [trainingExperience, setTrainingExperience] = useState("")
  const [fitnessGoals, setFitnessGoals] = useState("")
  const [geneticHeritage, setGeneticHeritage] = useState("")
  const [healthConditions, setHealthConditions] = useState("")
  const [medications, setMedications] = useState("")
  const [dietaryPreferences, setDietaryPreferences] = useState("")
  const [currentProgram, setCurrentProgram] = useState("")

  // Career fields
  const [educationLevel, setEducationLevel] = useState("")
  const [major, setMajor] = useState("")
  const [gpa, setGpa] = useState("")
  const [interests, setInterests] = useState("")
  const [skills, setSkills] = useState("")
  const [careerGoals, setCareerGoals] = useState("")
  const [personalityTraits, setPersonalityTraits] = useState("")
  const [workExperience, setWorkExperience] = useState("")

  const splitComma = (s: string) =>
    s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)

  // Wrapper for shadcn Select which passes string | null
  const selectSetter = (setter: (v: string) => void) => (v: string | null) => setter(v ?? "")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const userProfile: Record<string, unknown> = { name }

    if (researchType === "health" || researchType === "both") {
      userProfile.healthProfile = {
        age: Number(age),
        sex,
        weight: Number(weight),
        height: Number(height),
        activityLevel,
        trainingExperience,
        fitnessGoals: splitComma(fitnessGoals),
        geneticHeritage: splitComma(geneticHeritage),
        healthConditions: splitComma(healthConditions),
        medications: splitComma(medications),
        dietaryPreferences: splitComma(dietaryPreferences),
        currentProgram: currentProgram || undefined,
      }
    }

    if (researchType === "career" || researchType === "both") {
      userProfile.careerProfile = {
        educationLevel,
        major: major || undefined,
        gpa: gpa ? Number(gpa) : undefined,
        interests: splitComma(interests),
        skills: splitComma(skills),
        careerGoals: splitComma(careerGoals),
        personalityTraits: splitComma(personalityTraits),
        workExperience: workExperience
          ? splitComma(workExperience).map((exp) => {
              const parts = exp.split(" in ")
              return {
                title: parts[0] ?? exp,
                field: parts[1]?.split("(")[0]?.trim() ?? "",
                years: Number(parts[1]?.match(/\d+/)?.[0] ?? 0),
              }
            })
          : [],
      }
    }

    try {
      const res = await fetch("/api/research/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userProfile, researchType }),
      })
      const data = await res.json()
      if (data.sessionId) {
        router.push(`/research/${data.sessionId}`)
      }
    } catch (err) {
      console.error("Failed to start research:", err)
      setLoading(false)
    }
  }

  const showHealth = researchType === "health" || researchType === "both"
  const showCareer = researchType === "career" || researchType === "both"

  const healthForm = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" required />
        </div>
        <div>
          <Label htmlFor="sex">Sex</Label>
          <Select value={sex} onValueChange={selectSetter(setSex)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="weight">Weight (lbs)</Label>
          <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="180" required />
        </div>
        <div>
          <Label htmlFor="height">Height (inches)</Label>
          <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="70" required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Activity Level</Label>
          <Select value={activityLevel} onValueChange={selectSetter(setActivityLevel)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="very_active">Very Active</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Training Experience</Label>
          <Select value={trainingExperience} onValueChange={selectSetter(setTrainingExperience)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner (&lt;1 year)</SelectItem>
              <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
              <SelectItem value="advanced">Advanced (3-7 years)</SelectItem>
              <SelectItem value="elite">Elite (7+ years)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="fitnessGoals">Fitness Goals (comma-separated)</Label>
        <Input id="fitnessGoals" value={fitnessGoals} onChange={(e) => setFitnessGoals(e.target.value)} placeholder="strength, hypertrophy, fat loss" required />
      </div>
      <div>
        <Label htmlFor="geneticHeritage">Genetic Heritage (comma-separated)</Label>
        <Input id="geneticHeritage" value={geneticHeritage} onChange={(e) => setGeneticHeritage(e.target.value)} placeholder="West African, Northern European" />
      </div>
      <div>
        <Label htmlFor="healthConditions">Health Conditions (comma-separated)</Label>
        <Input id="healthConditions" value={healthConditions} onChange={(e) => setHealthConditions(e.target.value)} placeholder="None, or list conditions" />
      </div>
      <div>
        <Label htmlFor="medications">Medications (comma-separated)</Label>
        <Input id="medications" value={medications} onChange={(e) => setMedications(e.target.value)} placeholder="None, or list medications" />
      </div>
      <div>
        <Label htmlFor="dietaryPreferences">Dietary Preferences (comma-separated)</Label>
        <Input id="dietaryPreferences" value={dietaryPreferences} onChange={(e) => setDietaryPreferences(e.target.value)} placeholder="high protein, no dairy" />
      </div>
      <div>
        <Label htmlFor="currentProgram">Current Training Program (optional)</Label>
        <Textarea id="currentProgram" value={currentProgram} onChange={(e) => setCurrentProgram(e.target.value)} placeholder="PPL 6 days/week, nSuns 5/3/1, etc." rows={2} />
      </div>
    </div>
  )

  const careerForm = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Education Level</Label>
          <Select value={educationLevel} onValueChange={selectSetter(setEducationLevel)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="high_school">High School</SelectItem>
              <SelectItem value="associates">Associate&apos;s</SelectItem>
              <SelectItem value="bachelors">Bachelor&apos;s</SelectItem>
              <SelectItem value="masters">Master&apos;s</SelectItem>
              <SelectItem value="doctorate">Doctorate</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="major">Major / Field</Label>
          <Input id="major" value={major} onChange={(e) => setMajor(e.target.value)} placeholder="Computer Science" />
        </div>
      </div>
      <div>
        <Label htmlFor="gpa">GPA (optional, 0-4.0)</Label>
        <Input id="gpa" type="number" step="0.1" min="0" max="4" value={gpa} onChange={(e) => setGpa(e.target.value)} placeholder="3.5" />
      </div>
      <div>
        <Label htmlFor="interests">Interests (comma-separated)</Label>
        <Input id="interests" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="AI, education technology, data science" required />
      </div>
      <div>
        <Label htmlFor="skills">Skills (comma-separated)</Label>
        <Input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Python, data analysis, project management" required />
      </div>
      <div>
        <Label htmlFor="careerGoals">Career Goals (comma-separated)</Label>
        <Input id="careerGoals" value={careerGoals} onChange={(e) => setCareerGoals(e.target.value)} placeholder="lead an AI team, start a company" required />
      </div>
      <div>
        <Label htmlFor="workExperience">Work Experience (format: Title in Field (Years), comma-separated)</Label>
        <Textarea id="workExperience" value={workExperience} onChange={(e) => setWorkExperience(e.target.value)} placeholder="Software Engineer in Fintech (3), Data Analyst in Healthcare (2)" rows={2} />
      </div>
      <div>
        <Label htmlFor="personalityTraits">Personality Traits (comma-separated, optional)</Label>
        <Input id="personalityTraits" value={personalityTraits} onChange={(e) => setPersonalityTraits(e.target.value)} placeholder="analytical, creative, collaborative" />
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Button type="button" variant="ghost" size="sm" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <div>
        <Label htmlFor="name">Your Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ethan" required />
      </div>

      {researchType === "both" ? (
        <Tabs defaultValue="health">
          <TabsList className="w-full">
            <TabsTrigger value="health" className="flex-1">Health & Fitness</TabsTrigger>
            <TabsTrigger value="career" className="flex-1">Career & Education</TabsTrigger>
          </TabsList>
          <TabsContent value="health">
            <Card>
              <CardHeader><CardTitle className="text-base">Health & Fitness Profile</CardTitle></CardHeader>
              <CardContent>{healthForm}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="career">
            <Card>
              <CardHeader><CardTitle className="text-base">Career & Education Profile</CardTitle></CardHeader>
              <CardContent>{careerForm}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {showHealth ? "Health & Fitness Profile" : "Career & Education Profile"}
            </CardTitle>
          </CardHeader>
          <CardContent>{showHealth ? healthForm : showCareer ? careerForm : null}</CardContent>
        </Card>
      )}

      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Launching Research...
          </>
        ) : (
          "Launch Research"
        )}
      </Button>
    </form>
  )
}
