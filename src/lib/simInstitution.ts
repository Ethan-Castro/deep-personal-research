import type { AgentEvent } from "./events"
import type { SimEvent } from "./simData"
import { LAB_CONFIGS } from "@/components/avatar/agentConfig"

// Institution simulation — 10 labs, ~62 nodes, ~400 events, ~120 seconds
// Phase 0: Session start + brief (0-2s)
// Phase 1: Institution director + 10 lab groups (2-6s)
// Phase 2: 10 PIs spawn (6-11s)
// Phase 3: RAs + specialists spawn (11-35s)
// Phase 4: Research activity — thinking, tool calls, findings (35-80s)
// Phase 5: Lab-level synthesis (80-100s)
// Phase 6: Institution synthesis — insights + report (100-115s)
// Phase 7: Report + complete (115-120s)

const t = Date.now()

// ── Helpers ──────────────────────────────────────────────────────────────────

function spawn(agentId: string, name: string, role: string, team: string, description: string, parentId?: string, extra?: Record<string, unknown>): AgentEvent {
  return { type: "agent_spawned", agentId, parentId, timestamp: t, data: { name, role, team, description, ...extra } }
}

function think(agentId: string, thought: string, step: number): AgentEvent {
  return { type: "agent_thinking", agentId, timestamp: t, data: { thought, step } }
}

function toolCall(agentId: string, toolName: string, toolInput: string, toolOutputPreview: string): AgentEvent {
  return { type: "agent_tool_call", agentId, timestamp: t, data: { toolName, toolInput, toolOutputPreview } }
}

function finding(agentId: string, id: string, title: string, summary: string, source: string, sourceType: string, evidenceGrade: string): AgentEvent {
  return { type: "agent_finding", agentId, timestamp: t, data: { finding: { id, agentId, title, summary, source, sourceUrl: `https://example.com/${id}`, sourceType, evidenceGrade, timestamp: Date.now() } } }
}

function complete(agentId: string, summary: string, findingsCount: number): AgentEvent {
  return { type: "agent_complete", agentId, timestamp: t, data: { summary, findingsCount, durationMs: 15000 } }
}

// ── Lab research topics ──────────────────────────────────────────────────────

const LAB_RESEARCH: Record<number, { tools: string[]; queries: string[]; findings: { title: string; summary: string; source: string; sourceType: string; grade: string }[] }> = {
  1: {
    tools: ["pubmed_search", "exa_search", "pubmed_search"],
    queries: [
      "biomechanics gait analysis injury prevention systematic review",
      "force plate assessment powerlifting technique optimization",
      "joint angle biomechanics squat deadlift electromyography",
    ],
    findings: [
      { title: "Biomechanical gait analysis reduces overuse injury risk by 34%", summary: "Systematic review of 18 RCTs (n=2,400) found that personalized gait correction based on biomechanical analysis reduced lower extremity overuse injuries by 34% in athletes. Key factors: tibial rotation, hip drop angle, and foot strike pattern.", source: "J Biomechanics", sourceType: "pubmed", grade: "A" },
      { title: "Optimal squat depth varies by anthropometric ratios — femur-to-tibia ratio key predictor", summary: "Force plate analysis of 200 competitive lifters showed that optimal squat depth (maximal force production with minimal lumbar stress) correlates with femur-to-tibia ratio (r=0.72). Lifters with longer femurs benefit from wider stance and slight toe-out angle.", source: "Sports Biomechanics", sourceType: "pubmed", grade: "B" },
      { title: "EMG analysis confirms sumo deadlift recruits 18% more quad activation than conventional", summary: "Electromyography study of 60 trained lifters comparing sumo vs conventional deadlift found sumo recruits 18% more vastus lateralis activation while conventional emphasizes erector spinae by 22%. Choice should match individual leverages and weak points.", source: "J Strength Cond Res", sourceType: "pubmed", grade: "A" },
    ],
  },
  2: {
    tools: ["pubmed_search", "exa_search", "pubmed_search"],
    queries: [
      "periodized nutrition strength athletes macronutrient timing",
      "micronutrient deficiency athletes vitamin D magnesium zinc",
      "gut microbiome athletic performance recovery nutrition",
    ],
    findings: [
      { title: "Periodized nutrition increases lean mass gains by 12% vs fixed macros in strength athletes", summary: "12-week RCT (n=48) comparing periodized carb cycling to fixed macros in trained lifters. Periodized group gained 12% more lean mass and lost 8% more fat. Key: high carb (6g/kg) on training days, moderate (3g/kg) on rest days, protein constant at 2.2g/kg.", source: "Int J Sport Nutr Exerc Metab", sourceType: "pubmed", grade: "A" },
      { title: "73% of strength athletes deficient in vitamin D — supplementation improves force output", summary: "Cross-sectional study of 320 competitive strength athletes: 73% had serum 25(OH)D below 30 ng/mL. Those supplementing 4,000 IU/day for 8 weeks saw 8% improvement in peak isometric force. Also prevalent: magnesium (56%) and zinc (41%) deficiencies.", source: "Nutrients", sourceType: "pubmed", grade: "B" },
      { title: "Gut microbiome diversity predicts training recovery speed — fiber and fermented foods key", summary: "Shotgun metagenomics of 150 athletes revealed microbiome diversity (Shannon index) correlated with next-day recovery scores (r=0.61). Athletes consuming >30g fiber and 2+ servings fermented foods daily had 28% higher diversity than controls.", source: "Gut Microbes", sourceType: "pubmed", grade: "B" },
    ],
  },
  3: {
    tools: ["pubmed_search", "exa_search", "pubmed_search"],
    queries: [
      "ACTN3 genotype athletic performance power endurance meta-analysis",
      "pharmacogenomics caffeine CYP1A2 exercise performance",
      "epigenetics exercise gene expression training adaptation",
    ],
    findings: [
      { title: "ACTN3 RR genotype associated with 11% greater power output in sprint athletes", summary: "Meta-analysis of 23 studies (n=8,500): ACTN3 RR genotype (fast-twitch alpha-actinin-3) associated with 11% greater peak power output vs XX genotype. Frequency varies by ancestry: 98% RR in West African, 82% European, 75% East Asian populations.", source: "Med Sci Sports Exerc", sourceType: "pubmed", grade: "A" },
      { title: "CYP1A2 fast metabolizers get 2x caffeine performance boost vs slow metabolizers", summary: "RCT (n=101) testing 3mg/kg caffeine: CYP1A2 AA genotype (fast metabolizers) improved time trial by 4.9% vs 1.8% for AC/CC (slow). Fast metabolizers clear caffeine faster, getting ergogenic effect without jitters. Genetic testing can optimize pre-workout dosing.", source: "J Int Soc Sports Nutr", sourceType: "pubmed", grade: "B" },
      { title: "12 weeks resistance training alters methylation of 4,000+ genes — persistent epigenetic remodeling", summary: "Whole-genome bisulfite sequencing before/after 12-week resistance program: 4,012 differentially methylated regions identified, primarily in genes controlling muscle protein synthesis, mitochondrial biogenesis, and inflammation. Changes persisted 3 months post-training.", source: "Genome Biology", sourceType: "pubmed", grade: "B" },
    ],
  },
  4: {
    tools: ["exa_search", "exa_search", "exa_search"],
    queries: [
      "AI ML engineer career growth 2024 2025 salary trajectory",
      "machine learning engineer vs AI researcher career paths industry",
      "AI skills demand transformer architecture LLM deployment",
    ],
    findings: [
      { title: "AI/ML engineers see 24% YoY salary growth — fastest in tech", summary: "Analysis of 50,000 tech job postings: AI/ML engineer salaries grew 24% YoY (median $185K→$229K). Demand outpaces supply 3:1. Key differentiators: production ML systems experience, LLM fine-tuning, and MLOps/deployment skills command 30% premium over research-only roles.", source: "Levels.fyi Analysis", sourceType: "exa", grade: "B" },
      { title: "Industry AI roles pay 40% more than academia with comparable intellectual challenge", summary: "Survey of 2,000 AI professionals: industry applied research roles pay 40% more than tenure-track positions ($245K vs $175K median). 78% of industry researchers report 'high intellectual freedom.' Key factor: industry provides compute access and real-world deployment impact.", source: "AI Career Report 2024", sourceType: "exa", grade: "C" },
      { title: "Top 5 AI skills by demand growth: RAG systems, fine-tuning, agents, multimodal, edge deployment", summary: "NLP analysis of 100K job postings: fastest-growing skill demands are (1) RAG/retrieval systems +340%, (2) LLM fine-tuning +280%, (3) AI agent frameworks +250%, (4) multimodal AI +190%, (5) edge model deployment +160%. Traditional ML skills still required but no longer differentiate.", source: "Indeed Hiring Lab", sourceType: "exa", grade: "B" },
    ],
  },
  5: {
    tools: ["exa_search", "exa_search", "exa_search"],
    queries: [
      "highest ROI professional certifications tech 2024 2025",
      "skill gap analysis framework career development upskilling",
      "learning velocity deliberate practice expertise acquisition",
    ],
    findings: [
      { title: "AWS Solutions Architect + Kubernetes CKA yield highest salary premium (18-22%)", summary: "Analysis of 30K certified vs non-certified professionals: AWS SA Pro (+22% salary), CKA/CKAD (+18%), and Google Cloud Professional ML Engineer (+17%) showed highest ROI. Certification signals competence in specific domains and accelerates job search by 40% on average.", source: "Global Knowledge", sourceType: "exa", grade: "B" },
      { title: "T-shaped skill profile with 1 deep + 3 adjacent domains optimal for career resilience", summary: "10-year longitudinal study (n=5,000 professionals): T-shaped profiles (deep expertise in 1 area + working knowledge of 3 adjacent) showed 3x career resilience during industry disruptions vs specialists. Optimal adjacent skills: product management, data engineering, and domain expertise.", source: "Harvard Business Review", sourceType: "exa", grade: "C" },
      { title: "Deliberate practice with spaced repetition achieves expertise 2.5x faster than unstructured learning", summary: "Meta-analysis of skill acquisition studies: structured deliberate practice with spaced repetition and immediate feedback achieved competency 2.5x faster than self-directed learning. Key: 90-minute focused sessions, interleaved practice across sub-skills, and weekly retrieval testing.", source: "Psychological Science", sourceType: "exa", grade: "A" },
    ],
  },
  6: {
    tools: ["exa_search", "exa_search", "exa_search"],
    queries: [
      "asset allocation young professional risk-adjusted returns historical",
      "factor investing momentum value quality evidence-based",
      "real estate vs index funds wealth building 2024",
    ],
    findings: [
      { title: "80/20 equity/bond split with factor tilts outperforms target-date funds by 1.8%/yr for under-35s", summary: "Backtest (1990-2024): 80% global equity / 20% bond allocation with small-cap value tilt returned 11.2% annualized vs 9.4% for target-date funds. Factor premiums (value, size, profitability) add ~1.5% annually. Rebalancing quarterly vs annually adds another 0.3%.", source: "J Financial Planning", sourceType: "exa", grade: "B" },
      { title: "Momentum + value factor combination captures 85% of cross-sectional return variation", summary: "Analysis of 50 years of factor returns: combining momentum (winners outperform losers) with value (cheap outperforms expensive) captures 85% of equity return variation. Key: these factors are negatively correlated, providing natural hedging. Recommended: 60% market, 20% value, 20% momentum.", source: "J Portfolio Management", sourceType: "exa", grade: "A" },
      { title: "REITs provide comparable returns to direct real estate with 95% less capital requirement", summary: "20-year comparison: publicly traded REITs returned 10.8% annualized vs 11.2% for direct real estate, but REITs offer instant liquidity, $0 maintenance, automatic diversification, and minimum investment of $1 vs $50K+ for property. Tax efficiency favors REITs in tax-advantaged accounts.", source: "Vanguard Research", sourceType: "exa", grade: "B" },
    ],
  },
  7: {
    tools: ["exa_search", "exa_search", "exa_search"],
    queries: [
      "tax-loss harvesting impact after-tax returns automated",
      "Roth conversion ladder optimization early retirement",
      "tax-efficient asset location bonds equities accounts",
    ],
    findings: [
      { title: "Automated tax-loss harvesting adds 0.7-1.1% after-tax annually — highest impact in first 5 years", summary: "Analysis of 10,000 portfolios over 10 years: systematic daily tax-loss harvesting added 0.77% annually after-tax. Benefit is front-loaded (1.1% in years 1-5, 0.4% in years 6-10) as loss opportunities diminish. Direct indexing enables 2x more harvesting than ETF-based approach.", source: "J Wealth Management", sourceType: "exa", grade: "A" },
      { title: "Roth conversion ladder saves $180K+ in taxes over 30 years for high earners starting at 28", summary: "Monte Carlo simulation (10K runs): 28-year-old earning $200K converting $30K/yr from traditional to Roth during lower-income years saves median $184K in lifetime taxes. Optimal: convert to fill 24% bracket, prioritize years between jobs or during sabbaticals.", source: "Financial Planning Assoc", sourceType: "exa", grade: "B" },
      { title: "Asset location optimization adds 0.4% annually — bonds in tax-deferred, equities in taxable", summary: "20-year simulation: optimal asset location (bonds/REITs in tax-deferred, growth equities in taxable, international in Roth) adds 0.38% annually vs naive allocation. Combined with tax-loss harvesting, total tax alpha reaches 1.0-1.5% per year.", source: "Morningstar Research", sourceType: "exa", grade: "B" },
    ],
  },
  8: {
    tools: ["exa_search", "exa_search", "exa_search"],
    queries: [
      "social capital measurement strong ties weak ties career outcomes",
      "networking ROI professional relationship building strategy",
      "social support health outcomes longevity meta-analysis",
    ],
    findings: [
      { title: "Weak ties generate 58% of job opportunities — active network maintenance crucial", summary: "Replication of Granovetter's seminal work with modern data (n=20M LinkedIn connections): 58% of job changes come through weak ties (acquaintances seen <2x/month). But only actively maintained weak ties (annual touchpoint minimum) generate opportunities. Recommended: maintain 150+ weak ties through quarterly check-ins.", source: "Science", sourceType: "exa", grade: "A" },
      { title: "Professional community membership increases salary by 12% and job satisfaction by 22%", summary: "5-year longitudinal study (n=8,000): professionals active in 2+ professional communities earned 12% more than non-members. Effect mediated by: information access (+6%), mentorship (+4%), and referral networks (+2%). Satisfaction boost driven by sense of belonging and professional identity.", source: "Academy of Management J", sourceType: "exa", grade: "B" },
      { title: "Strong social connections add 7.5 years to life expectancy — equivalent to quitting smoking", summary: "Meta-analysis of 148 studies (n=308,849): individuals with strong social relationships had 50% increased likelihood of survival. Effect size (OR=1.50) comparable to quitting smoking (OR=1.50) and exceeds obesity reduction (OR=1.20) and exercise (OR=1.30). Quality of relationships matters more than quantity.", source: "PLoS Medicine", sourceType: "pubmed", grade: "A" },
    ],
  },
  9: {
    tools: ["exa_search", "exa_search", "exa_search"],
    queries: [
      "community involvement volunteering life satisfaction evidence",
      "local community engagement civic participation outcomes",
      "mentorship impact career development paying it forward",
    ],
    findings: [
      { title: "2+ hours/week volunteering maximizes well-being returns — diminishing benefits above 4hrs", summary: "Dose-response analysis (n=50,000): volunteering 2-4 hours/week associated with peak subjective well-being (+18% vs non-volunteers). Below 2hrs: insufficient community connection. Above 4hrs: diminishing returns and potential burnout. Skills-based volunteering provides additional career benefits.", source: "J Happiness Studies", sourceType: "exa", grade: "A" },
      { title: "Civic engagement correlates with 15% higher community trust and 20% better local outcomes", summary: "Multi-city analysis (n=200 communities): neighborhoods with high civic participation (attending meetings, joining boards) showed 15% higher interpersonal trust, 20% better educational outcomes, and 12% lower crime rates. Individual benefit: expanded professional network and leadership skill development.", source: "American J Community Psych", sourceType: "exa", grade: "B" },
      { title: "Mentoring others accelerates mentor's career by 20% — teaching deepens mastery", summary: "8-year longitudinal study of 3,000 professionals: those who mentored 1-2 juniors annually advanced 20% faster in title and compensation than non-mentors with equivalent experience. Mechanism: teaching forces knowledge consolidation, mentees become future network assets, and mentoring develops leadership skills.", source: "J Vocational Behavior", sourceType: "exa", grade: "B" },
    ],
  },
  10: {
    tools: ["exa_search"],
    queries: ["cross-domain life optimization systems thinking integration"],
    findings: [
      { title: "Systems approach to life optimization: health-career-finance-social feedback loops amplify gains", summary: "Novel framework analysis: optimizing across all life domains simultaneously yields 2.3x more life satisfaction improvement than sequential single-domain optimization. Key feedback loops: exercise→cognitive performance→career output→income→financial security→reduced stress→better sleep→exercise. Ignoring any domain creates bottlenecks.", source: "Systems Research", sourceType: "exa", grade: "C" },
    ],
  },
}

// ── Event Generation ─────────────────────────────────────────────────────────

const events: SimEvent[] = []

// Phase 0: Session start + brief (0-2s)
events.push({
  delay: 500,
  event: { type: "session_started", agentId: "system", timestamp: t, data: { sessionId: "sim_institution_demo", researchType: "institution", userName: "Demo User" } },
})

events.push({
  delay: 800,
  event: think("brief_generator", "Analyzing comprehensive life optimization request — assembling 10-lab research institution...", 1),
})

events.push({
  delay: 1500,
  event: {
    type: "brief_generated", agentId: "brief_generator", timestamp: t, data: {
      researchQuestions: [
        "Biomechanical optimization for strength athletes",
        "Evidence-based nutrition periodization strategies",
        "Genomic factors in athletic performance and health",
        "AI/ML career trajectory and market positioning",
        "Skill development and continuous learning frameworks",
        "Risk-adjusted investment strategies for young professionals",
        "Tax optimization and wealth preservation",
        "Social capital measurement and network building",
        "Community engagement and life satisfaction",
        "Cross-domain synergy identification and amplification",
      ],
      priorityAreas: ["Multi-domain optimization", "Evidence-graded recommendations", "Personalized action plans"],
    },
  },
})

// Phase 1: Institution director + 10 lab groups (2-6s)
events.push({
  delay: 600,
  event: spawn("institution_director", "Institution Director", "Research Director", "orchestrator", "Directing 10-lab research institution", undefined, { nodeType: "institution" }),
})

events.push({
  delay: 400,
  event: think("institution_director", "Initializing research institution — deploying 10 specialized labs...", 1),
})

for (let i = 0; i < 10; i++) {
  const lab = LAB_CONFIGS[i]
  events.push({
    delay: 400,
    event: {
      type: "agent_spawned",
      agentId: `lab${lab.id}_group`,
      parentId: "institution_director",
      timestamp: t,
      data: {
        name: lab.name,
        role: "Research Lab",
        team: lab.domain,
        description: `${lab.name} — ${lab.domain} research cluster`,
        nodeType: "labGroup",
        labColor: lab.color,
        labId: lab.id,
      },
    },
  })
}

events.push({
  delay: 300,
  event: think("institution_director", "All 10 labs initialized. Deploying Principal Investigators...", 2),
})

// Phase 2: 10 PIs spawn (6-11s)
for (let i = 0; i < 10; i++) {
  const lab = LAB_CONFIGS[i]
  events.push({
    delay: 500,
    event: spawn(`lab${lab.id}_pi`, `PI — ${lab.name}`, "Principal Investigator", lab.domain, `Leading research in ${lab.name}`, `lab${lab.id}_group`, { nodeType: "piAgent", labGroupId: `lab${lab.id}_group`, labId: lab.id }),
  })
}

// Phase 3: RAs + specialists spawn (11-35s)
for (let i = 0; i < 10; i++) {
  const lab = LAB_CONFIGS[i]
  const labPrefix = `lab${lab.id}`

  if (lab.id <= 9) {
    // Standard labs: 3 RAs + 1 specialist
    for (let ra = 1; ra <= 3; ra++) {
      events.push({
        delay: ra === 1 ? 1500 : 400,
        event: spawn(`${labPrefix}_ra${ra}`, `RA${ra} — ${lab.name}`, `Research Assistant ${ra}`, lab.domain, `Conducting research for ${lab.name}`, `lab${lab.id}_group`, { labGroupId: `lab${lab.id}_group`, labId: lab.id }),
      })
    }
    events.push({
      delay: 400,
      event: spawn(`${labPrefix}_spec1`, `Specialist — ${lab.name}`, "Domain Specialist", lab.domain, `Specialist analysis for ${lab.name}`, `lab${lab.id}_group`, { labGroupId: `lab${lab.id}_group`, labId: lab.id }),
    })
  } else {
    // Lab 10 (synthesis): 2 RAs + evidence_grader + report_writer + exec_summarizer
    events.push({ delay: 1500, event: spawn(`${labPrefix}_ra1`, `RA1 — ${lab.name}`, "Research Assistant 1", lab.domain, "Cross-domain data collection", `lab${lab.id}_group`, { labGroupId: `lab${lab.id}_group`, labId: lab.id }) })
    events.push({ delay: 400, event: spawn(`${labPrefix}_ra2`, `RA2 — ${lab.name}`, "Research Assistant 2", lab.domain, "Cross-domain pattern analysis", `lab${lab.id}_group`, { labGroupId: `lab${lab.id}_group`, labId: lab.id }) })
    events.push({ delay: 400, event: spawn(`${labPrefix}_evidence_grader`, `Evidence Grader`, "Evidence Grader", lab.domain, "Grading evidence across all labs", `lab${lab.id}_group`, { labGroupId: `lab${lab.id}_group`, labId: lab.id }) })
    events.push({ delay: 400, event: spawn(`${labPrefix}_report_writer`, `Report Writer`, "Report Writer", lab.domain, "Compiling institution-wide report", `lab${lab.id}_group`, { labGroupId: `lab${lab.id}_group`, labId: lab.id }) })
    events.push({ delay: 400, event: spawn(`${labPrefix}_exec_summarizer`, `Executive Summarizer`, "Executive Summarizer", lab.domain, "Creating executive summary", `lab${lab.id}_group`, { labGroupId: `lab${lab.id}_group`, labId: lab.id }) })
  }
}

// Phase 4: Research activity (35-80s) — ~3 findings per lab = 30 findings total
for (let i = 0; i < 10; i++) {
  const lab = LAB_CONFIGS[i]
  const research = LAB_RESEARCH[lab.id]
  if (!research) continue

  const labPrefix = `lab${lab.id}`
  const agents = lab.id <= 9
    ? [`${labPrefix}_ra1`, `${labPrefix}_ra2`, `${labPrefix}_ra3`]
    : [`${labPrefix}_ra1`, `${labPrefix}_ra2`]

  // PI thinks first
  events.push({
    delay: i === 0 ? 800 : 600,
    event: think(`${labPrefix}_pi`, `Directing research in ${lab.name} — assigning queries to team...`, 1),
  })

  // Each agent does a tool call + finding
  for (let f = 0; f < research.findings.length; f++) {
    const agentId = agents[f % agents.length]
    const tool = research.tools[f] ?? "exa_search"
    const query = research.queries[f] ?? "general research query"
    const fd = research.findings[f]

    events.push({ delay: 500, event: think(agentId, `Research iteration ${f + 1}/${research.findings.length} — searching ${tool}...`, f + 1) })
    events.push({ delay: 400, event: toolCall(agentId, tool, JSON.stringify({ query }), "Running...") })
    events.push({ delay: 1200, event: toolCall(agentId, tool, JSON.stringify({ query }), `{"results":[{"title":"${fd.title.slice(0, 60)}..."}]}`) })
    events.push({ delay: 600, event: finding(agentId, `${labPrefix}_finding_${f}`, fd.title, fd.summary, fd.source, fd.sourceType, fd.grade) })
  }

  // Specialist/extra agent does a thinking event
  if (lab.id <= 9) {
    events.push({ delay: 400, event: think(`${labPrefix}_spec1`, `Performing specialist analysis on ${lab.name} findings...`, 1) })
  }
}

// Phase 5: Lab-level synthesis — PIs compile (80-100s)
for (let i = 0; i < 10; i++) {
  const lab = LAB_CONFIGS[i]
  const labPrefix = `lab${lab.id}`

  events.push({
    delay: i === 0 ? 1500 : 800,
    event: think(`${labPrefix}_pi`, `Synthesizing findings from ${lab.name} team...`, 2),
  })

  // Complete all agents in the lab
  if (lab.id <= 9) {
    for (let ra = 1; ra <= 3; ra++) {
      events.push({ delay: 200, event: complete(`${labPrefix}_ra${ra}`, `Research complete`, 1) })
    }
    events.push({ delay: 200, event: complete(`${labPrefix}_spec1`, `Specialist analysis complete`, 0) })
  }

  events.push({
    delay: 400,
    event: complete(`${labPrefix}_pi`, `${lab.name} synthesis complete`, 3),
  })
}

// Phase 6: Institution synthesis — Lab 10 generates insights + report (100-115s)
events.push({ delay: 1000, event: think("lab10_evidence_grader", "Grading evidence across all 10 labs — 30 findings to assess...", 1) })
events.push({ delay: 2000, event: complete("lab10_evidence_grader", "Graded 30 findings across 10 labs", 30) })

events.push({ delay: 500, event: think("lab10_ra1", "Identifying cross-domain synergies...", 2) })
events.push({ delay: 500, event: think("lab10_ra2", "Mapping domain interaction patterns...", 2) })
events.push({ delay: 300, event: complete("lab10_ra1", "Cross-domain analysis complete", 0) })
events.push({ delay: 300, event: complete("lab10_ra2", "Pattern analysis complete", 0) })

// Insights
const insights: { title: string; content: string; findings: string[]; grade: string; domain: string }[] = [
  {
    title: "Exercise-cognition feedback loop: biomechanical optimization enhances career performance",
    content: "Strong evidence links optimized exercise (Biomechanics Lab) to 23% cognitive performance gains, directly impacting AI/ML career output (AI Career Lab). The CYP1A2 genetic insight (Genomics Lab) allows personalized caffeine timing for peak performance windows. Combined: better workouts → sharper cognition → higher career output → better income → more resources for health optimization.",
    findings: ["lab1_finding_0", "lab3_finding_1", "lab4_finding_0"],
    grade: "A",
    domain: "health",
  },
  {
    title: "Financial security enables health investment — tax optimization funds nutrition and genomic testing",
    content: "Tax-loss harvesting (Tax Strategy Lab) frees 0.7-1.1% annually which, redirected to evidence-based nutrition (Nutrition Lab) and genomic testing (Genomics Lab), yields compounding health returns. Roth conversion ladder secures long-term financial runway, reducing stress (Social Capital Lab finding: stress reduction adds 7.5 years). The financial-health connection is bi-directional and multiplicative.",
    findings: ["lab7_finding_0", "lab7_finding_1", "lab2_finding_0", "lab8_finding_2"],
    grade: "B",
    domain: "finance",
  },
  {
    title: "Social capital amplifies all domains — community + mentoring yield 20% career acceleration",
    content: "Weak ties generate 58% of job opportunities (Social Capital Lab), while mentoring accelerates the mentor's own career by 20% (Community Impact Lab). Combined with professional community membership (+12% salary), social investment is the highest-leverage cross-domain activity. Additionally, strong social connections add 7.5 years life expectancy — equivalent to quitting smoking.",
    findings: ["lab8_finding_0", "lab8_finding_1", "lab9_finding_2", "lab8_finding_2"],
    grade: "A",
    domain: "social",
  },
  {
    title: "Optimal life system: 4-pillar simultaneous optimization yields 2.3x more satisfaction than sequential",
    content: "Cross-Domain Synthesis Lab confirms that systems-level optimization across health, career, finance, and social domains yields 2.3x the satisfaction improvement of sequential single-domain approaches. Key amplifiers: exercise→cognition→career (+23%), financial security→stress reduction→health (+15%), social capital→opportunities→income (+12%). Recommended: allocate 25% optimization effort to each domain, not 100% to one at a time.",
    findings: ["lab10_finding_0", "lab1_finding_0", "lab4_finding_0", "lab8_finding_2"],
    grade: "B",
    domain: "synthesis",
  },
]

for (let i = 0; i < insights.length; i++) {
  const ins = insights[i]
  events.push({
    delay: i === 0 ? 1500 : 1000,
    event: {
      type: "insight_synthesized",
      agentId: "lab10_exec_summarizer",
      timestamp: t,
      data: {
        insight: {
          id: `institution_insight_${i}`,
          title: ins.title,
          content: ins.content,
          supportingFindings: ins.findings,
          evidenceGrade: ins.grade,
          domain: ins.domain,
        },
      },
    },
  })
}

events.push({ delay: 500, event: complete("lab10_exec_summarizer", "Generated 4 cross-domain insights", 4) })

// Phase 7: Report sections + complete (115-120s)
events.push({ delay: 500, event: think("lab10_report_writer", "Compiling institution-wide research report...", 1) })

const reportSections: { name: string; content: string; domain: string; citations: { title: string; evidenceGrade: string }[] }[] = [
  {
    name: "Executive Summary",
    content: "This institution-wide research report synthesizes findings from 10 specialized labs (51 research agents) across health, career, finance, and social domains. Key insight: simultaneous multi-domain optimization yields 2.3x more life satisfaction than sequential approaches. Four critical feedback loops identified: exercise→cognition→career performance, financial security→stress reduction→health, social capital→career opportunities→income, and community engagement→life satisfaction→motivation. Top-line recommendations: adopt biomechanically-optimized training with periodized nutrition, pursue AI/ML career with T-shaped skill development, implement factor-tilted investing with tax-loss harvesting, and maintain 150+ weak ties with 2+ hours weekly volunteering.",
    domain: "overview",
    citations: [
      { title: "Cross-Domain Systems Optimization Framework", evidenceGrade: "B" },
      { title: "Social Connections and Longevity Meta-Analysis (PLoS Medicine)", evidenceGrade: "A" },
      { title: "Biomechanical Gait Analysis Systematic Review (J Biomechanics)", evidenceGrade: "A" },
    ],
  },
  {
    name: "Health & Performance",
    content: "Three labs converge on a unified health protocol:\n\n**Biomechanics**: Personalized gait correction reduces injury risk 34%. Squat depth should be calibrated to femur-to-tibia ratio. Sumo vs conventional deadlift choice based on individual leverages.\n\n**Nutrition**: Periodized carb cycling (6g/kg training, 3g/kg rest) increases lean mass 12% vs fixed macros. 73% of strength athletes are vitamin D deficient — supplement 4,000 IU/day. Prioritize 30g+ fiber and fermented foods for gut microbiome diversity.\n\n**Genomics**: ACTN3 RR genotype (likely given heritage) provides 11% power advantage. CYP1A2 genotyping enables caffeine optimization. 12 weeks of training creates persistent epigenetic remodeling of 4,000+ genes.\n\n**Integrated Protocol**: Biomechanically-optimized DUP program + periodized nutrition + genotype-informed supplementation.",
    domain: "health",
    citations: [
      { title: "Biomechanical Gait Analysis (J Biomechanics)", evidenceGrade: "A" },
      { title: "Periodized Nutrition in Strength Athletes (Int J Sport Nutr)", evidenceGrade: "A" },
      { title: "ACTN3 Meta-Analysis (Med Sci Sports Exerc)", evidenceGrade: "A" },
      { title: "Vitamin D in Athletes (Nutrients)", evidenceGrade: "B" },
    ],
  },
  {
    name: "Career & Skills",
    content: "Two labs map the optimal career trajectory:\n\n**AI Career**: 24% YoY salary growth for AI/ML engineers. Industry research pays 40% more than academia. Top skills: RAG systems, LLM fine-tuning, AI agents, multimodal, edge deployment.\n\n**Skills Development**: AWS SA + CKA certifications yield 18-22% salary premium. T-shaped profile (1 deep + 3 adjacent) provides 3x career resilience. Deliberate practice with spaced repetition achieves expertise 2.5x faster.\n\n**Integrated Strategy**: Deep specialization in AI/ML agent systems + adjacent skills in product management, data engineering, and domain expertise. Pursue AWS + CKA certifications. Use spaced repetition for skill acquisition. Target: senior AI/ML engineer → principal/staff within 3-5 years.",
    domain: "career",
    citations: [
      { title: "AI/ML Salary Analysis (Levels.fyi)", evidenceGrade: "B" },
      { title: "Certification ROI Study (Global Knowledge)", evidenceGrade: "B" },
      { title: "Deliberate Practice Meta-Analysis (Psychological Science)", evidenceGrade: "A" },
    ],
  },
  {
    name: "Finance & Tax Strategy",
    content: "Two labs produce a comprehensive financial blueprint:\n\n**Market Intelligence**: 80/20 equity/bond split with factor tilts outperforms target-date funds by 1.8%/yr. Momentum + value factor combination captures 85% of return variation. REITs provide comparable returns to direct real estate with 95% less capital.\n\n**Tax Strategy**: Tax-loss harvesting adds 0.7-1.1% annually — highest impact in first 5 years. Roth conversion ladder saves $180K+ in lifetime taxes. Asset location optimization adds 0.4% annually.\n\n**Integrated Blueprint**: Factor-tilted portfolio (60% market, 20% value, 20% momentum) in tax-efficient wrappers. Direct indexing for tax-loss harvesting. Roth conversion during lower-income years. REITs in tax-advantaged accounts. Combined tax alpha: 1.0-1.5% annually.",
    domain: "finance",
    citations: [
      { title: "Factor Investing Analysis (J Portfolio Management)", evidenceGrade: "A" },
      { title: "Tax-Loss Harvesting Study (J Wealth Management)", evidenceGrade: "A" },
      { title: "Roth Conversion Simulation (Financial Planning Assoc)", evidenceGrade: "B" },
    ],
  },
  {
    name: "Social & Community",
    content: "Two labs quantify the social investment thesis:\n\n**Social Capital**: Weak ties generate 58% of job opportunities — maintain 150+ through quarterly check-ins. Professional community membership increases salary 12% and satisfaction 22%. Strong social connections add 7.5 years life expectancy.\n\n**Community Impact**: 2-4 hours/week volunteering maximizes well-being (+18%). Civic engagement builds trust and expands network. Mentoring juniors accelerates mentor's career by 20%.\n\n**Integrated Strategy**: Join 2+ professional communities (AI/ML focus). Maintain weak tie network with CRM tool. Volunteer 2-3 hours/week in skills-based roles. Mentor 1-2 juniors annually. Expected returns: +12% salary, +22% satisfaction, +7.5 years life expectancy.",
    domain: "social",
    citations: [
      { title: "Weak Ties and Job Opportunities (Science)", evidenceGrade: "A" },
      { title: "Social Connections and Longevity (PLoS Medicine)", evidenceGrade: "A" },
      { title: "Volunteering Dose-Response (J Happiness Studies)", evidenceGrade: "A" },
    ],
  },
]

for (let i = 0; i < reportSections.length; i++) {
  const sec = reportSections[i]
  events.push({
    delay: i === 0 ? 1500 : 2000,
    event: {
      type: "report_section",
      agentId: "lab10_report_writer",
      timestamp: t,
      data: {
        section: {
          sectionName: sec.name,
          content: sec.content,
          citations: sec.citations,
          domain: sec.domain,
        },
      },
    },
  })
}

events.push({ delay: 500, event: complete("lab10_report_writer", "Report generated with 5 sections", 5) })
events.push({ delay: 300, event: complete("institution_director", "Institution research complete — 10 labs, 30 findings, 4 insights", 30) })

events.push({
  delay: 500,
  event: {
    type: "research_complete",
    agentId: "system",
    timestamp: t,
    data: {
      reportId: "report_institution_demo",
      totalFindings: 30,
      totalInsights: 4,
      totalDurationMs: 120000,
    },
  },
})

export const SIM_INSTITUTION_EVENTS: SimEvent[] = events
