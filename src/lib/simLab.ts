import type { AgentEvent } from "./events"
import type { SimEvent } from "./simData"

// Full Life Optimization LAB simulation — 24 agents, 4 phases, ~90 seconds
// Phase 1: Broad research (8 agents across 4 domains)
// Phase 2: Deep dive (7 specialist agents)
// Phase 3: Cross-validation (QA Director)
// Phase 4: Synthesis & report (5 synthesis agents)

const t = Date.now()

export const SIM_LAB_EVENTS: SimEvent[] = [
  // ========================================================================
  // SESSION START
  // ========================================================================
  {
    delay: 500,
    event: {
      type: "session_started",
      agentId: "system",
      timestamp: t,
      data: {
        sessionId: "sim_lab_demo",
        researchType: "lab",
        userName: "Demo User",
      },
    },
  },

  // ========================================================================
  // BRIEF GENERATION
  // ========================================================================
  {
    delay: 800,
    event: {
      type: "agent_thinking",
      agentId: "brief_generator",
      timestamp: t,
      data: {
        thought: "Analyzing multi-domain life optimization request — health, career, finance, social...",
        step: 1,
      },
    },
  },
  {
    delay: 2500,
    event: {
      type: "brief_generated",
      agentId: "brief_generator",
      timestamp: t,
      data: {
        researchQuestions: [
          "What cardiovascular and strength training protocols maximize longevity for a 28-year-old?",
          "How does Mediterranean diet compare to other evidence-based nutrition frameworks?",
          "What genetic factors influence optimal exercise modality selection?",
          "What AI/ML career paths show the highest 5-year growth trajectory?",
          "How does remote work salary adjustment affect total compensation?",
          "What certifications provide the highest ROI for mid-career tech professionals?",
          "What asset allocation strategy maximizes risk-adjusted returns for a 28-year-old?",
          "How does tax-loss harvesting impact after-tax portfolio returns?",
          "What emergency fund size is optimal given current employment stability?",
          "How do strong social ties correlate with health and career outcomes?",
          "What professional networking strategies yield the highest opportunity density?",
          "How does community involvement affect overall life satisfaction?",
        ],
        priorityAreas: [
          "Exercise and nutrition optimization",
          "Genetic heritage and personalized health",
          "AI/ML career trajectory and skills",
          "Compensation and salary optimization",
          "Investment strategy and tax efficiency",
          "Social connection and community",
          "Cross-domain synergies",
          "Evidence quality and validation",
        ],
      },
    },
  },

  // ========================================================================
  // PHASE 1: BROAD RESEARCH (0-35s) — Supervisor + 8 agents across 4 domains
  // ========================================================================

  // --- Supervisor spawns ---
  {
    delay: 600,
    event: {
      type: "agent_spawned",
      agentId: "supervisor",
      timestamp: t,
      data: {
        name: "supervisor",
        role: "Research Supervisor",
        team: "orchestrator",
        description: "Coordinating multi-domain life optimization research across 4 domains",
      },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_thinking",
      agentId: "supervisor",
      timestamp: t,
      data: {
        thought: "Planning 4-domain research strategy. Phase 1: Deploy 8 broad researchers in parallel.",
        step: 1,
      },
    },
  },
  {
    delay: 800,
    event: {
      type: "agent_thinking",
      agentId: "supervisor",
      timestamp: t,
      data: {
        thought: "Spawning health, career, finance, and social research teams simultaneously...",
        step: 2,
      },
    },
  },

  // --- Health team Phase 1 ---
  {
    delay: 300,
    event: {
      type: "agent_spawned",
      agentId: "pubmed_researcher",
      parentId: "supervisor",
      timestamp: t,
      data: {
        name: "pubmed_researcher",
        role: "PubMed Literature Researcher",
        team: "health",
        description: "Searching PubMed for exercise physiology and longevity evidence",
      },
    },
  },
  {
    delay: 200,
    event: {
      type: "agent_spawned",
      agentId: "genetics_analyst",
      parentId: "supervisor",
      timestamp: t,
      data: {
        name: "genetics_analyst",
        role: "Genetic Heritage Analyst",
        team: "health",
        description: "Analyzing genetic factors influencing exercise response and health outcomes",
      },
    },
  },

  // --- Career team Phase 1 ---
  {
    delay: 200,
    event: {
      type: "agent_spawned",
      agentId: "onet_researcher",
      parentId: "supervisor",
      timestamp: t,
      data: {
        name: "onet_researcher",
        role: "O*NET Occupation Researcher",
        team: "career",
        description: "Mapping AI/ML occupation landscape and growth projections",
      },
    },
  },
  {
    delay: 200,
    event: {
      type: "agent_spawned",
      agentId: "trends_analyst",
      parentId: "supervisor",
      timestamp: t,
      data: {
        name: "trends_analyst",
        role: "Labor Market Trends Analyst",
        team: "career",
        description: "Analyzing tech labor market trends and compensation data",
      },
    },
  },

  // --- Finance team Phase 1 ---
  {
    delay: 200,
    event: {
      type: "agent_spawned",
      agentId: "market_researcher",
      parentId: "supervisor",
      timestamp: t,
      data: {
        name: "market_researcher",
        role: "Market Researcher",
        team: "finance",
        description: "Researching investment strategies and market performance data",
      },
    },
  },
  {
    delay: 200,
    event: {
      type: "agent_spawned",
      agentId: "tax_analyst",
      parentId: "supervisor",
      timestamp: t,
      data: {
        name: "tax_analyst",
        role: "Tax Strategy Analyst",
        team: "finance",
        description: "Analyzing tax optimization strategies for high-earning professionals",
      },
    },
  },

  // --- Social team Phase 1 ---
  {
    delay: 200,
    event: {
      type: "agent_spawned",
      agentId: "social_researcher",
      parentId: "supervisor",
      timestamp: t,
      data: {
        name: "social_researcher",
        role: "Social Connection Researcher",
        team: "social",
        description: "Researching social ties, longevity, and life satisfaction evidence",
      },
    },
  },
  {
    delay: 200,
    event: {
      type: "agent_spawned",
      agentId: "network_analyst",
      parentId: "supervisor",
      timestamp: t,
      data: {
        name: "network_analyst",
        role: "Professional Network Analyst",
        team: "social",
        description: "Analyzing professional networking strategies and career impact",
      },
    },
  },

  // === Phase 1 Research — Interleaved agent activity ===

  // PubMed Researcher — iteration 1
  {
    delay: 600,
    event: {
      type: "agent_thinking",
      agentId: "pubmed_researcher",
      timestamp: t,
      data: { thought: "Searching for meta-analyses on cardiovascular training and longevity...", step: 1 },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "pubmed_researcher",
      timestamp: t,
      data: {
        toolName: "pubmed_search",
        toolInput: { query: "cardiovascular training frequency longevity meta-analysis" },
        toolOutputPreview: "Found 47 results. Top hit: 'Dose-response of aerobic exercise on mortality: systematic review'",
      },
    },
  },

  // O*NET Researcher — iteration 1 (parallel)
  {
    delay: 300,
    event: {
      type: "agent_thinking",
      agentId: "onet_researcher",
      timestamp: t,
      data: { thought: "Looking up AI/ML occupation codes and growth projections...", step: 1 },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "onet_researcher",
      timestamp: t,
      data: {
        toolName: "onet_search_occupations",
        toolInput: { query: "artificial intelligence machine learning" },
        toolOutputPreview: "Matched: Data Scientists (15-2051.00), ML Engineers (15-2099.01)",
      },
    },
  },

  // Market Researcher — iteration 1 (parallel)
  {
    delay: 200,
    event: {
      type: "agent_thinking",
      agentId: "market_researcher",
      timestamp: t,
      data: { thought: "Analyzing index fund vs active management performance over 15-year periods...", step: 1 },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "market_researcher",
      timestamp: t,
      data: {
        toolName: "exa_search",
        toolInput: { query: "index fund vs active management long-term performance SPIVA" },
        toolOutputPreview: "SPIVA 2024 Scorecard: 92% of large-cap active funds underperformed S&P 500 over 15 years",
      },
    },
  },

  // Social Researcher — iteration 1 (parallel)
  {
    delay: 200,
    event: {
      type: "agent_thinking",
      agentId: "social_researcher",
      timestamp: t,
      data: { thought: "Searching for meta-analyses on social connection and longevity...", step: 1 },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "social_researcher",
      timestamp: t,
      data: {
        toolName: "pubmed_search",
        toolInput: { query: "social relationships mortality meta-analysis Holt-Lunstad" },
        toolOutputPreview: "Found: 'Social Relationships and Mortality Risk: A Meta-analytic Review' — 148 studies",
      },
    },
  },

  // === Phase 1 Findings start flowing in ===

  // PubMed finding 1
  {
    delay: 800,
    event: {
      type: "agent_finding",
      agentId: "pubmed_researcher",
      timestamp: t,
      data: {
        finding: {
          id: "pubmed_researcher_0",
          agentId: "pubmed_researcher",
          source: "Dose-response of aerobic exercise for all-cause mortality (2022)",
          sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/example1",
          sourceType: "pubmed",
          evidenceGrade: "A",
          title: "Optimal cardio: 3-5 sessions/week at 65-85% MHR reduces all-cause mortality by 30%",
          summary: "Systematic review of 17 prospective cohort studies (n=252,000) found 150-300min/week moderate-intensity aerobic exercise associated with 30% reduced all-cause mortality. Diminishing returns above 300min/week.",
          timestamp: t,
        },
      },
    },
  },

  // O*NET finding 1
  {
    delay: 600,
    event: {
      type: "agent_finding",
      agentId: "onet_researcher",
      timestamp: t,
      data: {
        finding: {
          id: "onet_researcher_0",
          agentId: "onet_researcher",
          source: "O*NET OnLine — Data Scientists (15-2051.00)",
          sourceType: "onet",
          evidenceGrade: "A",
          title: "Data Scientists & ML Engineers: 36% projected growth, Bright Outlook designation",
          summary: "O*NET projects 36% growth for data science roles through 2033 — much faster than average. Median salary $108,020. Key skills: Python, machine learning, statistical modeling, cloud computing.",
          timestamp: t,
        },
      },
    },
  },

  // Market finding 1
  {
    delay: 500,
    event: {
      type: "agent_finding",
      agentId: "market_researcher",
      timestamp: t,
      data: {
        finding: {
          id: "market_researcher_0",
          agentId: "market_researcher",
          source: "SPIVA U.S. Scorecard (S&P Dow Jones Indices 2024)",
          sourceType: "exa",
          evidenceGrade: "A",
          title: "Index funds outperform 92% of active managers over 15 years",
          summary: "The SPIVA scorecard shows 92.19% of U.S. large-cap active funds underperformed the S&P 500 over a 15-year period. Average expense ratio for active: 0.66% vs 0.03% for index funds.",
          timestamp: t,
        },
      },
    },
  },

  // Social finding 1
  {
    delay: 500,
    event: {
      type: "agent_finding",
      agentId: "social_researcher",
      timestamp: t,
      data: {
        finding: {
          id: "social_researcher_0",
          agentId: "social_researcher",
          source: "Holt-Lunstad et al. (2010) — Social Relationships and Mortality Risk",
          sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/20668659",
          sourceType: "pubmed",
          evidenceGrade: "A",
          title: "Strong social ties increase survival probability by 50%",
          summary: "Meta-analysis of 148 studies (n=308,849) found that individuals with stronger social relationships had a 50% increased likelihood of survival. Effect size comparable to quitting smoking.",
          timestamp: t,
        },
      },
    },
  },

  // Genetics Analyst — iteration 1
  {
    delay: 300,
    event: {
      type: "agent_thinking",
      agentId: "genetics_analyst",
      timestamp: t,
      data: { thought: "Searching for gene-exercise interaction studies and personalized training evidence...", step: 1 },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "genetics_analyst",
      timestamp: t,
      data: {
        toolName: "exa_search",
        toolInput: { query: "ACTN3 gene exercise response personalized training meta-analysis" },
        toolOutputPreview: "Found: 'ACTN3 R577X polymorphism and exercise phenotypes: meta-analysis of 23 studies'",
      },
    },
  },
  {
    delay: 1000,
    event: {
      type: "agent_finding",
      agentId: "genetics_analyst",
      timestamp: t,
      data: {
        finding: {
          id: "genetics_analyst_0",
          agentId: "genetics_analyst",
          source: "ACTN3 Polymorphism and Athletic Performance (2023)",
          sourceType: "exa",
          evidenceGrade: "B",
          title: "ACTN3 genotype influences optimal power vs endurance training split",
          summary: "Meta-analysis of 23 studies shows ACTN3 R577X genotype significantly predicts power vs endurance phenotype. RR genotype overrepresented in sprint/power athletes; XX in endurance. Personalized training allocation improves outcomes by 12-18%.",
          timestamp: t,
        },
      },
    },
  },

  // Trends Analyst — iteration 1
  {
    delay: 300,
    event: {
      type: "agent_thinking",
      agentId: "trends_analyst",
      timestamp: t,
      data: { thought: "Analyzing remote work salary trends and geographic differential data...", step: 1 },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "trends_analyst",
      timestamp: t,
      data: {
        toolName: "exa_search",
        toolInput: { query: "remote work salary adjustment geographic differential 2024 2025 tech" },
        toolOutputPreview: "Levels.fyi data: Remote salary differentials narrowing — SF vs Austin now 8% vs 15% in 2022",
      },
    },
  },
  {
    delay: 1000,
    event: {
      type: "agent_finding",
      agentId: "trends_analyst",
      timestamp: t,
      data: {
        finding: {
          id: "trends_analyst_0",
          agentId: "trends_analyst",
          source: "Levels.fyi Compensation Report 2025",
          sourceType: "exa",
          evidenceGrade: "B",
          title: "Remote salary differentials narrowing: SF vs mid-tier cities now 5-10%",
          summary: "Geographic salary adjustments for remote tech roles have compressed from 15-20% (2022) to 5-10% (2025). Companies increasingly adopt national pay bands. Median remote ML Engineer comp: $185K total.",
          timestamp: t,
        },
      },
    },
  },

  // Tax Analyst — iteration 1
  {
    delay: 300,
    event: {
      type: "agent_thinking",
      agentId: "tax_analyst",
      timestamp: t,
      data: { thought: "Researching tax-loss harvesting impact for high-earning tech professionals...", step: 1 },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "tax_analyst",
      timestamp: t,
      data: {
        toolName: "exa_search",
        toolInput: { query: "tax-loss harvesting annual savings high income portfolio" },
        toolOutputPreview: "Betterment study: TLH adds 0.77% annually for taxable accounts over $500K",
      },
    },
  },
  {
    delay: 1000,
    event: {
      type: "agent_finding",
      agentId: "tax_analyst",
      timestamp: t,
      data: {
        finding: {
          id: "tax_analyst_0",
          agentId: "tax_analyst",
          source: "Tax-Loss Harvesting Impact Study (Betterment, 2024)",
          sourceType: "exa",
          evidenceGrade: "B",
          title: "Tax-loss harvesting adds 0.77%/year — saves $3K-$10K annually for high earners",
          summary: "Automated tax-loss harvesting adds ~0.77% per year in after-tax returns for taxable portfolios. For a $500K portfolio at 35% marginal rate, this translates to ~$3,850/year in tax savings.",
          timestamp: t,
        },
      },
    },
  },

  // Network Analyst — iteration 1
  {
    delay: 300,
    event: {
      type: "agent_thinking",
      agentId: "network_analyst",
      timestamp: t,
      data: { thought: "Analyzing optimal professional network size and maintenance strategies...", step: 1 },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "network_analyst",
      timestamp: t,
      data: {
        toolName: "exa_search",
        toolInput: { query: "Dunbar number professional network career opportunities research" },
        toolOutputPreview: "Dunbar's layers: 5 close → 15 good friends → 50 friends → 150 meaningful contacts",
      },
    },
  },
  {
    delay: 1000,
    event: {
      type: "agent_finding",
      agentId: "network_analyst",
      timestamp: t,
      data: {
        finding: {
          id: "network_analyst_0",
          agentId: "network_analyst",
          source: "Professional Networking and Career Outcomes (Harvard Business Review)",
          sourceType: "exa",
          evidenceGrade: "B",
          title: "Active network of 150-250 yields 3x more career opportunities",
          summary: "Research shows professionals with 150-250 active contacts receive 3x more referrals and job opportunities. Key: maintain weak ties through quarterly touchpoints. 80% of jobs filled through networking.",
          timestamp: t,
        },
      },
    },
  },

  // PubMed Researcher — iteration 2
  {
    delay: 600,
    event: {
      type: "agent_thinking",
      agentId: "pubmed_researcher",
      timestamp: t,
      data: { thought: "Now searching for Mediterranean diet evidence and nutritional interventions...", step: 2 },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "pubmed_researcher",
      timestamp: t,
      data: {
        toolName: "pubmed_search",
        toolInput: { query: "Mediterranean diet all-cause mortality systematic review 2020" },
        toolOutputPreview: "Found 89 results. Top: 'Mediterranean Diet and All-Cause Mortality: PREDIMED-Plus trial'",
      },
    },
  },
  {
    delay: 1200,
    event: {
      type: "agent_finding",
      agentId: "pubmed_researcher",
      timestamp: t,
      data: {
        finding: {
          id: "pubmed_researcher_1",
          agentId: "pubmed_researcher",
          source: "Mediterranean Diet and Mortality: PREDIMED-Plus (2023)",
          sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/example2",
          sourceType: "pubmed",
          evidenceGrade: "A",
          title: "Mediterranean diet reduces all-cause mortality by 25% vs Western diet",
          summary: "PREDIMED-Plus trial (n=6,874, 8-year follow-up) demonstrated 25% reduction in all-cause mortality with Mediterranean diet intervention. Benefits strongest for cardiovascular and cancer endpoints.",
          timestamp: t,
        },
      },
    },
  },

  // O*NET Researcher — iteration 2
  {
    delay: 500,
    event: {
      type: "agent_thinking",
      agentId: "onet_researcher",
      timestamp: t,
      data: { thought: "Checking skill requirements for AI Product Manager role transition...", step: 2 },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "onet_researcher",
      timestamp: t,
      data: {
        toolName: "onet_get_occupation_details",
        toolInput: { code: "15-2051.00" },
        toolOutputPreview: "Skills: Python (4.8), ML frameworks (4.6), Statistics (4.5), Communication (4.2)",
      },
    },
  },
  {
    delay: 1000,
    event: {
      type: "agent_finding",
      agentId: "onet_researcher",
      timestamp: t,
      data: {
        finding: {
          id: "onet_researcher_1",
          agentId: "onet_researcher",
          source: "O*NET Skill Analysis — AI/ML Roles",
          sourceType: "onet",
          evidenceGrade: "B",
          title: "Top skill gap: presentation and stakeholder management for IC→Lead transition",
          summary: "O*NET data shows technical ICs transitioning to leadership need strongest improvement in: oral communication (gap: 1.8), persuasion (gap: 1.5), and coordination (gap: 1.3). Technical skills typically sufficient.",
          timestamp: t,
        },
      },
    },
  },

  // === Phase 1 Agent Completions ===
  {
    delay: 800,
    event: {
      type: "agent_complete",
      agentId: "pubmed_researcher",
      timestamp: t,
      data: { summary: "Found 2 high-quality findings on exercise and nutrition", findingsCount: 2, durationMs: 12000 },
    },
  },
  {
    delay: 200,
    event: {
      type: "agent_complete",
      agentId: "genetics_analyst",
      timestamp: t,
      data: { summary: "Found 1 finding on genetic exercise optimization", findingsCount: 1, durationMs: 10000 },
    },
  },
  {
    delay: 200,
    event: {
      type: "agent_complete",
      agentId: "onet_researcher",
      timestamp: t,
      data: { summary: "Found 2 findings on AI/ML career landscape", findingsCount: 2, durationMs: 11000 },
    },
  },
  {
    delay: 200,
    event: {
      type: "agent_complete",
      agentId: "trends_analyst",
      timestamp: t,
      data: { summary: "Found 1 finding on remote salary trends", findingsCount: 1, durationMs: 9000 },
    },
  },
  {
    delay: 200,
    event: {
      type: "agent_complete",
      agentId: "market_researcher",
      timestamp: t,
      data: { summary: "Found 1 finding on passive investing evidence", findingsCount: 1, durationMs: 9500 },
    },
  },
  {
    delay: 200,
    event: {
      type: "agent_complete",
      agentId: "tax_analyst",
      timestamp: t,
      data: { summary: "Found 1 finding on tax-loss harvesting", findingsCount: 1, durationMs: 8500 },
    },
  },
  {
    delay: 200,
    event: {
      type: "agent_complete",
      agentId: "social_researcher",
      timestamp: t,
      data: { summary: "Found 1 finding on social connection and longevity", findingsCount: 1, durationMs: 8000 },
    },
  },
  {
    delay: 200,
    event: {
      type: "agent_complete",
      agentId: "network_analyst",
      timestamp: t,
      data: { summary: "Found 1 finding on professional networking", findingsCount: 1, durationMs: 8500 },
    },
  },

  // ========================================================================
  // PHASE 2: DEEP DIVE (35-55s) — 7 specialist agents
  // ========================================================================
  {
    delay: 800,
    event: {
      type: "agent_thinking",
      agentId: "supervisor",
      timestamp: t,
      data: {
        thought: "Phase 1 complete — 10 findings across 4 domains. Deploying 7 specialist agents for deep dives...",
        step: 3,
      },
    },
  },

  // Health specialists
  {
    delay: 400,
    event: {
      type: "agent_spawned",
      agentId: "nutrition_analyst",
      parentId: "supervisor",
      timestamp: t,
      data: {
        name: "nutrition_analyst",
        role: "Nutrition Protocol Analyst",
        team: "health",
        description: "Deep-diving into personalized nutrition protocols based on Phase 1 diet findings",
      },
    },
  },
  {
    delay: 200,
    event: {
      type: "agent_spawned",
      agentId: "exercise_scientist",
      parentId: "supervisor",
      timestamp: t,
      data: {
        name: "exercise_scientist",
        role: "Exercise Science Specialist",
        team: "health",
        description: "Designing evidence-based training protocols combining cardio and genetic data",
      },
    },
  },

  // Career specialists
  {
    delay: 200,
    event: {
      type: "agent_spawned",
      agentId: "salary_researcher",
      parentId: "supervisor",
      timestamp: t,
      data: {
        name: "salary_researcher",
        role: "Compensation Researcher",
        team: "career",
        description: "Deep analysis of compensation negotiation and total comp optimization",
      },
    },
  },
  {
    delay: 200,
    event: {
      type: "agent_spawned",
      agentId: "skills_matcher",
      parentId: "supervisor",
      timestamp: t,
      data: {
        name: "skills_matcher",
        role: "Skills Gap Matcher",
        team: "career",
        description: "Mapping current skills to target roles with certification recommendations",
      },
    },
  },

  // Finance specialists
  {
    delay: 200,
    event: {
      type: "agent_spawned",
      agentId: "investment_strategist",
      parentId: "supervisor",
      timestamp: t,
      data: {
        name: "investment_strategist",
        role: "Investment Strategy Specialist",
        team: "finance",
        description: "Designing age-appropriate asset allocation and Roth conversion strategies",
      },
    },
  },
  {
    delay: 200,
    event: {
      type: "agent_spawned",
      agentId: "budget_optimizer",
      parentId: "supervisor",
      timestamp: t,
      data: {
        name: "budget_optimizer",
        role: "Budget Optimization Specialist",
        team: "finance",
        description: "Analyzing savings rate optimization and emergency fund sizing",
      },
    },
  },

  // Social specialist
  {
    delay: 200,
    event: {
      type: "agent_spawned",
      agentId: "community_mapper",
      parentId: "supervisor",
      timestamp: t,
      data: {
        name: "community_mapper",
        role: "Community Engagement Mapper",
        team: "social",
        description: "Mapping community involvement strategies and life satisfaction evidence",
      },
    },
  },

  // === Phase 2 Research ===

  // Nutrition Analyst
  {
    delay: 600,
    event: {
      type: "agent_thinking",
      agentId: "nutrition_analyst",
      timestamp: t,
      data: { thought: "Building on Mediterranean diet finding — analyzing supplement protocols...", step: 1 },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "nutrition_analyst",
      timestamp: t,
      data: {
        toolName: "pubmed_search",
        toolInput: { query: "vitamin D supplementation deficiency 2000 IU meta-analysis" },
        toolOutputPreview: "Found: 'Vitamin D Supplementation and Health Outcomes: Umbrella Review of 137 Meta-analyses'",
      },
    },
  },
  {
    delay: 1200,
    event: {
      type: "agent_finding",
      agentId: "nutrition_analyst",
      timestamp: t,
      data: {
        finding: {
          id: "nutrition_analyst_0",
          agentId: "nutrition_analyst",
          source: "Vitamin D Supplementation Umbrella Review (2024)",
          sourceType: "pubmed",
          evidenceGrade: "B",
          title: "Vitamin D 2000-4000 IU/day benefits those below 30 ng/mL serum level",
          summary: "Umbrella review of 137 meta-analyses confirms Vitamin D supplementation (2000-4000 IU/day) significantly benefits individuals with serum levels <30 ng/mL. Improvements in bone health, immune function, and mood.",
          timestamp: t,
        },
      },
    },
  },

  // Exercise Scientist
  {
    delay: 300,
    event: {
      type: "agent_thinking",
      agentId: "exercise_scientist",
      timestamp: t,
      data: { thought: "Combining cardio and genetic findings into personalized training protocol...", step: 1 },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "exercise_scientist",
      timestamp: t,
      data: {
        toolName: "exa_search",
        toolInput: { query: "concurrent training strength endurance periodization evidence-based protocol" },
        toolOutputPreview: "Found: 'Concurrent Training: A Meta-Analysis on Interference Effect and Training Variables'",
      },
    },
  },
  {
    delay: 1200,
    event: {
      type: "agent_finding",
      agentId: "exercise_scientist",
      timestamp: t,
      data: {
        finding: {
          id: "exercise_scientist_0",
          agentId: "exercise_scientist",
          source: "Concurrent Training Interference Meta-Analysis (2023)",
          sourceType: "exa",
          evidenceGrade: "B",
          title: "Optimal concurrent training: separate cardio and strength by 6+ hours",
          summary: "Meta-analysis shows concurrent training interference minimized when sessions separated by 6+ hours. Recommended: strength AM, cardio PM. Weekly split: 3 strength + 3 cardio + 1 rest.",
          timestamp: t,
        },
      },
    },
  },

  // Salary Researcher
  {
    delay: 400,
    event: {
      type: "agent_thinking",
      agentId: "salary_researcher",
      timestamp: t,
      data: { thought: "Analyzing top certification ROI for mid-career tech professionals...", step: 1 },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "salary_researcher",
      timestamp: t,
      data: {
        toolName: "exa_search",
        toolInput: { query: "highest ROI tech certifications 2025 salary increase data" },
        toolOutputPreview: "Global Knowledge survey: AWS Solutions Architect +$26K, GCP Professional +$23K",
      },
    },
  },
  {
    delay: 1000,
    event: {
      type: "agent_finding",
      agentId: "salary_researcher",
      timestamp: t,
      data: {
        finding: {
          id: "salary_researcher_0",
          agentId: "salary_researcher",
          source: "Global Knowledge IT Skills & Salary Report 2025",
          sourceType: "exa",
          evidenceGrade: "C",
          title: "Top ROI certs: AWS SA (+$26K), GCP Pro (+$23K), PMP (+$18K)",
          summary: "IT professionals with AWS Solutions Architect earn $26K more than non-certified peers. Cloud certifications provide 15-20% salary premium. ROI positive within 6 months at ~$300 exam cost.",
          timestamp: t,
        },
      },
    },
  },

  // Skills Matcher
  {
    delay: 300,
    event: {
      type: "agent_thinking",
      agentId: "skills_matcher",
      timestamp: t,
      data: { thought: "Mapping IC-to-leadership skill gaps with targeted development plan...", step: 1 },
    },
  },
  {
    delay: 1200,
    event: {
      type: "agent_finding",
      agentId: "skills_matcher",
      timestamp: t,
      data: {
        finding: {
          id: "skills_matcher_0",
          agentId: "skills_matcher",
          source: "O*NET + Internal Analysis — IC to Staff Transition",
          sourceType: "onet",
          evidenceGrade: "B",
          title: "IC→Staff transition requires 2-3 cross-functional projects over 18 months",
          summary: "Analysis of Staff Engineer promotion patterns shows median path requires: leading 2-3 cross-team initiatives, mentoring 3+ juniors, and demonstrating org-level technical strategy. Typical timeline: 18-24 months focused effort.",
          timestamp: t,
        },
      },
    },
  },

  // Investment Strategist
  {
    delay: 400,
    event: {
      type: "agent_thinking",
      agentId: "investment_strategist",
      timestamp: t,
      data: { thought: "Designing age-appropriate asset allocation with Roth conversion analysis...", step: 1 },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "investment_strategist",
      timestamp: t,
      data: {
        toolName: "exa_search",
        toolInput: { query: "Roth conversion ladder early retirement 28 year old asset allocation" },
        toolOutputPreview: "Bogleheads wiki: 28yo target allocation 90/10 stock/bond, Roth conversion at lower marginal rates",
      },
    },
  },
  {
    delay: 1000,
    event: {
      type: "agent_finding",
      agentId: "investment_strategist",
      timestamp: t,
      data: {
        finding: {
          id: "investment_strategist_0",
          agentId: "investment_strategist",
          source: "Vanguard Research: Optimal Asset Allocation by Age (2024)",
          sourceType: "exa",
          evidenceGrade: "B",
          title: "Age 28 optimal allocation: 90/10 stocks/bonds with Roth-first contribution order",
          summary: "For a 28-year-old with 30+ year horizon: 90% total stock market index, 10% total bond index. Contribution order: employer match → Roth IRA → 401k max → taxable. Roth conversion ladder viable if planning early retirement.",
          timestamp: t,
        },
      },
    },
  },

  // Budget Optimizer
  {
    delay: 300,
    event: {
      type: "agent_thinking",
      agentId: "budget_optimizer",
      timestamp: t,
      data: { thought: "Calculating optimal emergency fund size given tech industry volatility...", step: 1 },
    },
  },
  {
    delay: 1000,
    event: {
      type: "agent_finding",
      agentId: "budget_optimizer",
      timestamp: t,
      data: {
        finding: {
          id: "budget_optimizer_0",
          agentId: "budget_optimizer",
          source: "Emergency Fund Sizing Research — Tech Industry (Multiple Sources)",
          sourceType: "exa",
          evidenceGrade: "B",
          title: "Tech professionals need 6-9 month emergency fund given layoff cycle patterns",
          summary: "Given tech industry's 12-18 month boom/bust cycles and average 3-month job search duration, a 6-9 month emergency fund in high-yield savings (currently ~5% APY) provides optimal safety margin without excessive opportunity cost.",
          timestamp: t,
        },
      },
    },
  },

  // Community Mapper
  {
    delay: 300,
    event: {
      type: "agent_thinking",
      agentId: "community_mapper",
      timestamp: t,
      data: { thought: "Researching community volunteering impact on life satisfaction and wellbeing...", step: 1 },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "community_mapper",
      timestamp: t,
      data: {
        toolName: "exa_search",
        toolInput: { query: "volunteering life satisfaction wellbeing longitudinal study hours per week" },
        toolOutputPreview: "BMC Public Health: 2+ hours/week volunteering associated with 7% higher life satisfaction",
      },
    },
  },
  {
    delay: 1000,
    event: {
      type: "agent_finding",
      agentId: "community_mapper",
      timestamp: t,
      data: {
        finding: {
          id: "community_mapper_0",
          agentId: "community_mapper",
          source: "Volunteering and Wellbeing: Longitudinal Study (BMC Public Health, 2023)",
          sourceType: "exa",
          evidenceGrade: "C",
          title: "Volunteering 2+ hours/week linked to 7% higher life satisfaction scores",
          summary: "Longitudinal study (n=12,500, 5 years) found regular volunteering (2+ hours/week) associated with 7% higher life satisfaction, 15% lower depression risk, and expanded social network by ~30 meaningful contacts.",
          timestamp: t,
        },
      },
    },
  },

  // === Phase 2 Agent Completions ===
  {
    delay: 600,
    event: {
      type: "agent_complete",
      agentId: "nutrition_analyst",
      timestamp: t,
      data: { summary: "Found 1 finding on vitamin D supplementation", findingsCount: 1, durationMs: 8000 },
    },
  },
  {
    delay: 200,
    event: {
      type: "agent_complete",
      agentId: "exercise_scientist",
      timestamp: t,
      data: { summary: "Found 1 finding on concurrent training protocols", findingsCount: 1, durationMs: 7500 },
    },
  },
  {
    delay: 200,
    event: {
      type: "agent_complete",
      agentId: "salary_researcher",
      timestamp: t,
      data: { summary: "Found 1 finding on certification ROI", findingsCount: 1, durationMs: 7000 },
    },
  },
  {
    delay: 200,
    event: {
      type: "agent_complete",
      agentId: "skills_matcher",
      timestamp: t,
      data: { summary: "Found 1 finding on IC-to-Staff transition path", findingsCount: 1, durationMs: 6500 },
    },
  },
  {
    delay: 200,
    event: {
      type: "agent_complete",
      agentId: "investment_strategist",
      timestamp: t,
      data: { summary: "Found 1 finding on asset allocation strategy", findingsCount: 1, durationMs: 7000 },
    },
  },
  {
    delay: 200,
    event: {
      type: "agent_complete",
      agentId: "budget_optimizer",
      timestamp: t,
      data: { summary: "Found 1 finding on emergency fund sizing", findingsCount: 1, durationMs: 5500 },
    },
  },
  {
    delay: 200,
    event: {
      type: "agent_complete",
      agentId: "community_mapper",
      timestamp: t,
      data: { summary: "Found 1 finding on volunteering and life satisfaction", findingsCount: 1, durationMs: 6000 },
    },
  },

  // ========================================================================
  // PHASE 3: CROSS-VALIDATION (55-70s) — QA Director
  // ========================================================================
  {
    delay: 800,
    event: {
      type: "agent_thinking",
      agentId: "supervisor",
      timestamp: t,
      data: {
        thought: "Phase 2 complete — 17 total findings. Deploying QA Director for cross-validation...",
        step: 4,
      },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_spawned",
      agentId: "qa_director",
      parentId: "supervisor",
      timestamp: t,
      data: {
        name: "qa_director",
        role: "Quality Assurance Director",
        team: "orchestrator",
        description: "Cross-validating all 17 findings for evidence quality, replication, and bias",
      },
    },
  },
  {
    delay: 600,
    event: {
      type: "agent_thinking",
      agentId: "qa_director",
      timestamp: t,
      data: { thought: "Reviewing 17 findings across 4 domains. Checking for replication, bias, and evidence gaps...", step: 1 },
    },
  },
  {
    delay: 800,
    event: {
      type: "agent_thinking",
      agentId: "qa_director",
      timestamp: t,
      data: { thought: "Flag: ACTN3 genetic finding has limited replication studies. Checking further...", step: 2 },
    },
  },
  {
    delay: 500,
    event: {
      type: "agent_tool_call",
      agentId: "qa_director",
      timestamp: t,
      data: {
        toolName: "pubmed_search",
        toolInput: { query: "ACTN3 R577X training response replication failure limitations" },
        toolOutputPreview: "Found: 'Limitations of ACTN3 as Training Predictor — Replication Challenges'",
      },
    },
  },
  {
    delay: 1200,
    event: {
      type: "agent_finding",
      agentId: "qa_director",
      timestamp: t,
      data: {
        finding: {
          id: "qa_director_0",
          agentId: "qa_director",
          source: "QA Validation — Genetics Finding Review",
          sourceType: "other",
          evidenceGrade: "D",
          title: "QA Flag: ACTN3 genotype finding lacks independent replication — downgrade to Grade C",
          summary: "Cross-validation found that while ACTN3 associations with power phenotypes are robust, the 12-18% training optimization claim from genetics_analyst_0 comes from a single research group without independent replication. Recommend downgrade from B to C.",
          timestamp: t,
        },
      },
    },
  },
  {
    delay: 800,
    event: {
      type: "agent_thinking",
      agentId: "qa_director",
      timestamp: t,
      data: { thought: "Remaining 16 findings pass validation. 2 Grade A findings are exceptionally strong.", step: 3 },
    },
  },
  {
    delay: 600,
    event: {
      type: "agent_complete",
      agentId: "qa_director",
      timestamp: t,
      data: { summary: "Validated 17 findings. 1 downgraded (genetics). 16 confirmed. Total now: 18 findings.", findingsCount: 1, durationMs: 8000 },
    },
  },

  // Supervisor completion
  {
    delay: 400,
    event: {
      type: "agent_complete",
      agentId: "supervisor",
      timestamp: t,
      data: { summary: "All 4 phases orchestrated. 18 total findings across health, career, finance, social domains.", findingsCount: 18, durationMs: 65000 },
    },
  },

  // ========================================================================
  // PHASE 4: SYNTHESIS & REPORT (70-90s)
  // ========================================================================

  // Evidence Grader
  {
    delay: 500,
    event: {
      type: "agent_spawned",
      agentId: "evidence_grader",
      timestamp: t,
      data: {
        name: "evidence_grader",
        role: "Evidence Grader",
        team: "synthesis",
        description: "Grading all 18 findings using A-F evidence rubric",
      },
    },
  },
  {
    delay: 600,
    event: {
      type: "agent_thinking",
      agentId: "evidence_grader",
      timestamp: t,
      data: { thought: "Grading 18 findings: 4 Grade A, 9 Grade B, 3 Grade C, 1 Grade D, 1 flagged...", step: 1 },
    },
  },
  {
    delay: 1500,
    event: {
      type: "agent_complete",
      agentId: "evidence_grader",
      timestamp: t,
      data: { summary: "Graded 18 findings: 4A, 9B, 3C, 1D, 1F. Overall evidence quality: Strong.", findingsCount: 0, durationMs: 3000 },
    },
  },

  // Cross-Domain Linker
  {
    delay: 400,
    event: {
      type: "agent_spawned",
      agentId: "cross_domain_linker",
      timestamp: t,
      data: {
        name: "cross_domain_linker",
        role: "Cross-Domain Connection Analyst",
        team: "synthesis",
        description: "Identifying synergies and connections between health, career, finance, and social findings",
      },
    },
  },
  {
    delay: 600,
    event: {
      type: "agent_thinking",
      agentId: "cross_domain_linker",
      timestamp: t,
      data: { thought: "Mapping cross-domain connections: exercise→cognitive performance→career, social→health→longevity...", step: 1 },
    },
  },
  {
    delay: 1500,
    event: {
      type: "agent_complete",
      agentId: "cross_domain_linker",
      timestamp: t,
      data: { summary: "Identified 4 major cross-domain synergies for insight synthesis", findingsCount: 0, durationMs: 4000 },
    },
  },

  // Synthesizer — produces 6 insights
  {
    delay: 400,
    event: {
      type: "agent_spawned",
      agentId: "synthesizer",
      timestamp: t,
      data: {
        name: "synthesizer",
        role: "Research Synthesizer",
        team: "synthesis",
        description: "Synthesizing 18 findings into actionable domain and cross-domain insights",
      },
    },
  },
  {
    delay: 600,
    event: {
      type: "agent_thinking",
      agentId: "synthesizer",
      timestamp: t,
      data: { thought: "Synthesizing across 4 domains and 18 findings into 6 key insights...", step: 1 },
    },
  },

  // Insight 1: Health
  {
    delay: 1500,
    event: {
      type: "insight_synthesized",
      agentId: "synthesizer",
      timestamp: t,
      data: {
        insight: {
          id: "insight_0",
          title: "Exercise + Mediterranean diet = 40% mortality reduction",
          content: "Combining the cardio evidence (30% mortality reduction) with Mediterranean diet findings (25% reduction), the synergistic effect of both interventions together is estimated at ~40% all-cause mortality reduction. This is the single highest-leverage health intervention available.",
          supportingFindings: ["pubmed_researcher_0", "pubmed_researcher_1", "exercise_scientist_0"],
          evidenceGrade: "A",
          domain: "health",
        },
      },
    },
  },

  // Insight 2: Career
  {
    delay: 1200,
    event: {
      type: "insight_synthesized",
      agentId: "synthesizer",
      timestamp: t,
      data: {
        insight: {
          id: "insight_1",
          title: "AI/ML + leadership skills = top 2% earning potential",
          content: "The AI/ML career trajectory (36% growth) combined with closing the soft skills gap (presentation, stakeholder management) and AWS certification (+$26K) positions you in the top 2% of tech earning potential. Remote salary differentials are narrowing, making location-independent work increasingly viable.",
          supportingFindings: ["onet_researcher_0", "onet_researcher_1", "trends_analyst_0", "salary_researcher_0", "skills_matcher_0"],
          evidenceGrade: "B",
          domain: "career",
        },
      },
    },
  },

  // Insight 3: Finance
  {
    delay: 1200,
    event: {
      type: "insight_synthesized",
      agentId: "synthesizer",
      timestamp: t,
      data: {
        insight: {
          id: "insight_2",
          title: "Index investing + tax optimization = $8K-15K/year in saved costs",
          content: "Combining index fund investing (saving 0.63% in fees vs active management) with tax-loss harvesting (0.77%/year) and Roth-first contribution order yields $8K-15K annually in reduced costs and tax savings on a $500K+ portfolio. A 6-9 month emergency fund provides the safety net for career flexibility.",
          supportingFindings: ["market_researcher_0", "tax_analyst_0", "investment_strategist_0", "budget_optimizer_0"],
          evidenceGrade: "B",
          domain: "finance",
        },
      },
    },
  },

  // Insight 4: Social
  {
    delay: 1200,
    event: {
      type: "insight_synthesized",
      agentId: "synthesizer",
      timestamp: t,
      data: {
        insight: {
          id: "insight_3",
          title: "Social connection is literally a health intervention — adds 7.5 years",
          content: "Strong social ties increase survival by 50%, an effect size comparable to quitting smoking. Maintaining 150-250 active contacts yields 3x career opportunities. Regular volunteering (2hr/week) both builds community and raises life satisfaction by 7%. Social investment is simultaneously a health, career, and happiness strategy.",
          supportingFindings: ["social_researcher_0", "network_analyst_0", "community_mapper_0"],
          evidenceGrade: "B",
          domain: "social",
        },
      },
    },
  },

  // Insight 5: Cross-domain
  {
    delay: 1200,
    event: {
      type: "insight_synthesized",
      agentId: "synthesizer",
      timestamp: t,
      data: {
        insight: {
          id: "insight_4",
          title: "Health→Career synergy: exercise boosts cognitive output by 20%",
          content: "Exercise (150-300min/week moderate intensity) doesn't just reduce mortality — it improves cognitive performance by ~20% including working memory, executive function, and sustained attention. For knowledge workers, this directly translates to career performance. The optimal AM strength / PM cardio split also creates natural productivity bookends.",
          supportingFindings: ["pubmed_researcher_0", "exercise_scientist_0", "onet_researcher_0"],
          evidenceGrade: "B",
          domain: "cross_domain",
        },
      },
    },
  },

  // Insight 6: Cross-domain
  {
    delay: 1200,
    event: {
      type: "insight_synthesized",
      agentId: "synthesizer",
      timestamp: t,
      data: {
        insight: {
          id: "insight_5",
          title: "Financial security enables career risk-taking — 9-month runway unlocks pivots",
          content: "A 6-9 month emergency fund combined with a Roth conversion ladder creates a safety net that makes career transitions viable. This is critical because the highest-growth AI/ML roles often require lateral moves or startup risks. Financial security and career growth are not independent variables — they form a positive feedback loop.",
          supportingFindings: ["budget_optimizer_0", "investment_strategist_0", "onet_researcher_0", "trends_analyst_0"],
          evidenceGrade: "B",
          domain: "cross_domain",
        },
      },
    },
  },

  {
    delay: 500,
    event: {
      type: "agent_complete",
      agentId: "synthesizer",
      timestamp: t,
      data: { summary: "Synthesized 6 insights: 1 health, 1 career, 1 finance, 1 social, 2 cross-domain", findingsCount: 0, durationMs: 8000 },
    },
  },

  // Report Writer — 8 sections
  {
    delay: 400,
    event: {
      type: "agent_spawned",
      agentId: "report_writer",
      timestamp: t,
      data: {
        name: "report_writer",
        role: "Report Writer",
        team: "synthesis",
        description: "Writing comprehensive multi-domain research report with citations",
      },
    },
  },
  {
    delay: 600,
    event: {
      type: "agent_thinking",
      agentId: "report_writer",
      timestamp: t,
      data: { thought: "Structuring report: executive summary + 4 domain sections + cross-domain + methodology + action plan...", step: 1 },
    },
  },

  // Report section 1: Executive Summary
  {
    delay: 1200,
    event: {
      type: "report_section",
      agentId: "report_writer",
      timestamp: t,
      data: {
        section: {
          sectionName: "Executive Summary",
          content: "This comprehensive life optimization analysis examined 18 research findings across health, career, finance, and social domains for a 28-year-old professional. Key takeaways: (1) Exercise + Mediterranean diet reduces all-cause mortality by ~40%, (2) AI/ML career path with leadership skills targets top 2% earning, (3) Index investing + tax optimization saves $8-15K/year, (4) Social connection is the most underrated life intervention. Two critical cross-domain synergies emerged: exercise directly boosts cognitive/career performance, and financial security enables the career risks needed for maximum growth.",
          citations: [
            { title: "Dose-response of aerobic exercise for all-cause mortality", evidenceGrade: "A" },
            { title: "SPIVA U.S. Scorecard 2024", evidenceGrade: "A" },
            { title: "Social Relationships and Mortality Risk", evidenceGrade: "A" },
          ],
          domain: "overview",
        },
      },
    },
  },

  // Report section 2: Health
  {
    delay: 1500,
    event: {
      type: "report_section",
      agentId: "report_writer",
      timestamp: t,
      data: {
        section: {
          sectionName: "Health & Fitness Protocol",
          content: "Evidence strongly supports a combined exercise and nutrition approach. Cardio: 150-300 minutes/week moderate intensity (65-85% MHR), with strength training separated by 6+ hours. Mediterranean diet as primary nutritional framework. Vitamin D supplementation (2000-4000 IU) if serum levels below 30 ng/mL. Genetic testing for ACTN3 can inform power/endurance training split, though evidence requires further replication (Grade C after QA review).",
          citations: [
            { title: "Aerobic Exercise and Mortality", evidenceGrade: "A" },
            { title: "PREDIMED-Plus Trial", evidenceGrade: "A" },
            { title: "Concurrent Training Meta-Analysis", evidenceGrade: "B" },
            { title: "Vitamin D Umbrella Review", evidenceGrade: "B" },
          ],
          domain: "health",
        },
      },
    },
  },

  // Report section 3: Career
  {
    delay: 1500,
    event: {
      type: "report_section",
      agentId: "report_writer",
      timestamp: t,
      data: {
        section: {
          sectionName: "Career Trajectory & Skills Development",
          content: "AI/ML roles project 36% growth through 2033. The critical path from IC to Staff Engineer requires leading 2-3 cross-functional initiatives over 18-24 months. Remote salary differentials are narrowing (5-10% vs 15-20% in 2022). Highest ROI next steps: AWS Solutions Architect certification (+$26K), deliberate practice on presentation skills, and one cross-team initiative per quarter.",
          citations: [
            { title: "O*NET Data Scientists Growth Projection", evidenceGrade: "A" },
            { title: "IC to Staff Transition Analysis", evidenceGrade: "B" },
            { title: "Remote Salary Trends 2025", evidenceGrade: "B" },
            { title: "Certification ROI Report", evidenceGrade: "C" },
          ],
          domain: "career",
        },
      },
    },
  },

  // Report section 4: Finance
  {
    delay: 1500,
    event: {
      type: "report_section",
      agentId: "report_writer",
      timestamp: t,
      data: {
        section: {
          sectionName: "Financial Strategy",
          content: "Asset allocation: 90/10 stocks/bonds via low-cost index funds (VTI/VXUS/BND). Contribution order: employer match → Roth IRA → 401k max → taxable brokerage. Implement automated tax-loss harvesting on taxable accounts (+0.77%/year). Build emergency fund to 6-9 months expenses in HYSA. Total annual savings from optimization: $8K-15K in reduced fees and tax savings.",
          citations: [
            { title: "SPIVA Active vs Passive", evidenceGrade: "A" },
            { title: "Tax-Loss Harvesting Study", evidenceGrade: "B" },
            { title: "Vanguard Asset Allocation Research", evidenceGrade: "B" },
            { title: "Emergency Fund Sizing Analysis", evidenceGrade: "B" },
          ],
          domain: "finance",
        },
      },
    },
  },

  // Report section 5: Social
  {
    delay: 1500,
    event: {
      type: "report_section",
      agentId: "report_writer",
      timestamp: t,
      data: {
        section: {
          sectionName: "Social Capital & Community",
          content: "Social connection is the most evidence-backed life satisfaction intervention. Target: maintain 150-250 active professional contacts via quarterly touchpoints. Volunteer 2+ hours/week for simultaneous community building and life satisfaction (+7%). Key insight: social investment compounds — it improves health (50% survival increase), career (3x opportunities), and happiness simultaneously.",
          citations: [
            { title: "Holt-Lunstad Social Ties Meta-Analysis", evidenceGrade: "A" },
            { title: "Professional Networking Research", evidenceGrade: "B" },
            { title: "Volunteering and Wellbeing Study", evidenceGrade: "C" },
          ],
          domain: "social",
        },
      },
    },
  },

  // Report section 6: Cross-Domain
  {
    delay: 1200,
    event: {
      type: "report_section",
      agentId: "report_writer",
      timestamp: t,
      data: {
        section: {
          sectionName: "Cross-Domain Synergies",
          content: "Two powerful feedback loops identified: (1) Exercise→Cognitive→Career: 150min/week exercise improves cognitive performance ~20%, directly impacting work output and career trajectory. (2) Finance→Career→Growth: A 9-month emergency fund makes career pivots and startup opportunities viable, unlocking the highest-growth roles. These synergies mean that domain optimization is not zero-sum — investing in health literally pays career dividends.",
          citations: [
            { title: "Exercise and Cognitive Function", evidenceGrade: "B" },
            { title: "Emergency Fund and Career Flexibility", evidenceGrade: "B" },
          ],
          domain: "overview",
        },
      },
    },
  },

  // Report section 7: Methodology
  {
    delay: 1200,
    event: {
      type: "report_section",
      agentId: "report_writer",
      timestamp: t,
      data: {
        section: {
          sectionName: "Methodology & Evidence Quality",
          content: "This report synthesized 18 research findings from PubMed, O*NET, Exa web search, and domain-specific databases. Evidence grading used the A-F rubric (A: meta-analyses of RCTs, B: multiple RCTs, C: single RCT/observational, D: limited/preliminary, F: expert consensus). Distribution: 4 Grade A, 9 Grade B, 3 Grade C, 1 Grade D, 1 QA-flagged. QA Director cross-validated all findings, downgrading 1 genetics finding due to replication concerns.",
          citations: [],
          domain: "methodology",
        },
      },
    },
  },

  {
    delay: 500,
    event: {
      type: "agent_complete",
      agentId: "report_writer",
      timestamp: t,
      data: { summary: "Wrote 7 report sections: executive summary, health, career, finance, social, cross-domain, methodology", findingsCount: 0, durationMs: 12000 },
    },
  },

  // Executive Summarizer — final action plan sections
  {
    delay: 400,
    event: {
      type: "agent_spawned",
      agentId: "executive_summarizer",
      timestamp: t,
      data: {
        name: "executive_summarizer",
        role: "Executive Summarizer",
        team: "synthesis",
        description: "Creating prioritized action plan from all research findings",
      },
    },
  },
  {
    delay: 600,
    event: {
      type: "agent_thinking",
      agentId: "executive_summarizer",
      timestamp: t,
      data: { thought: "Distilling 18 findings and 6 insights into a prioritized 90-day action plan...", step: 1 },
    },
  },

  // Report section 8: Action Plan
  {
    delay: 1500,
    event: {
      type: "report_section",
      agentId: "executive_summarizer",
      timestamp: t,
      data: {
        section: {
          sectionName: "90-Day Action Plan",
          content: "Week 1-2: Start Mediterranean diet, establish AM strength/PM cardio schedule, open HYSA for emergency fund. Week 3-4: Begin AWS SA certification study, schedule quarterly network touchpoints for top 50 contacts, test Vitamin D levels. Month 2: Complete emergency fund to 3 months (building to 9), join one volunteer org (2hr/week), start first cross-team initiative at work. Month 3: Take AWS SA exam, implement tax-loss harvesting on taxable accounts, review and rebalance to 90/10 allocation. Quarterly review recommended.",
          citations: [],
          domain: "overview",
        },
      },
    },
  },

  {
    delay: 500,
    event: {
      type: "agent_complete",
      agentId: "executive_summarizer",
      timestamp: t,
      data: { summary: "Produced 90-day prioritized action plan", findingsCount: 0, durationMs: 3000 },
    },
  },

  // ========================================================================
  // RESEARCH COMPLETE
  // ========================================================================
  {
    delay: 300,
    event: {
      type: "research_complete",
      agentId: "system",
      timestamp: t,
      data: {
        reportId: "report_lab_demo",
        totalFindings: 18,
        totalInsights: 6,
        totalDurationMs: 90000,
      },
    },
  },
]
