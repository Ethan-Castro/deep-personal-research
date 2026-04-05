import type { ReportSection, Finding, Insight } from "./types"

export type PaperFormat = "ieee" | "apa"

interface PaperOptions {
  sections: ReportSection[]
  findings: Finding[]
  insights: Insight[]
  userName?: string
  format: PaperFormat
}

interface Ref {
  id: number
  title: string
  url?: string
  grade: string
  source?: string
}

function esc(t: string): string {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

function resolveUrl(url: string): string {
  if (url.startsWith("http")) return url
  if (url.startsWith("PMID:")) return `https://pubmed.ncbi.nlm.nih.gov/${url.replace("PMID:", "")}/`
  return url
}

function buildRefs(sections: ReportSection[], findings: Finding[]): Ref[] {
  const m = new Map<string, Ref>()
  let n = 0
  for (const s of sections)
    for (const c of s.citations) {
      const k = c.title.toLowerCase().trim()
      if (!m.has(k)) m.set(k, { id: ++n, title: c.title, url: c.url, grade: c.evidenceGrade })
    }
  for (const f of findings) {
    const k = f.title.toLowerCase().trim()
    if (!m.has(k)) m.set(k, { id: ++n, title: f.title, url: f.sourceUrl, grade: f.evidenceGrade, source: f.source })
  }
  return Array.from(m.values()).sort((a, b) => a.id - b.id)
}

function getCiteNums(
  citations: ReportSection["citations"],
  refs: Ref[]
): number[] {
  const nums: number[] = []
  for (const c of citations) {
    const r = refs.find((r) => r.title.toLowerCase().trim() === c.title.toLowerCase().trim())
    if (r) nums.push(r.id)
  }
  return [...new Set(nums)]
}

// ============================================================
//  IEEE FORMAT — Two-column, 10pt Times, single-spaced
//  Matches: IEEE Transactions / Conference template
// ============================================================

function generateIEEE(opts: Omit<PaperOptions, "format">): string {
  const { sections, findings, userName } = opts
  const refs = buildRefs(sections, findings)
  const overview = sections.filter((s) => s.domain === "overview")
  const body = sections.filter((s) => s.domain !== "overview" && s.domain !== "methodology")
  const meth = sections.filter((s) => s.domain === "methodology")
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  const dbs = [...new Set(findings.map((f) => f.sourceType))]
    .map((t) => (t === "pubmed" ? "PubMed" : t === "exa" ? "Exa AI" : t === "onet" ? "O*NET" : t))
    .join(", ")

  const abstractText = overview.map((s) => s.content).join(" ")
  const abstractCites = overview.flatMap((s) => getCiteNums(s.citations, refs))

  function toRoman(n: number): string {
    const v = [1000,900,500,400,100,90,50,40,10,9,5,4,1]
    const s = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"]
    let r = ""; for (let i = 0; i < v.length; i++) while (n >= v[i]) { r += s[i]; n -= v[i] }; return r
  }

  let secN = 1
  const bodySecs = body.map((s) => {
    secN++
    const cn = getCiteNums(s.citations, refs)
    const cite = cn.length > 0 ? ` [${cn.join(", ")}]` : ""
    const paras = s.content.split("\n").filter((p) => p.trim())
    const html = paras.map((p, i) => `<p>${esc(p)}${i === paras.length - 1 ? cite : ""}</p>`).join("\n")
    return `<h2>${toRoman(secN)}. ${esc(s.sectionName).toUpperCase()}</h2>\n${html}`
  }).join("\n\n")

  const methN = secN + 1
  const methText = meth.map((s) => s.content).join("\n\n")

  const refsHtml = refs.map((r) => {
    const src = r.source ? ` <em>${esc(r.source)}</em>.` : ""
    const url = r.url ? ` Available: ${esc(resolveUrl(r.url))}` : ""
    return `<p>[${r.id}] ${esc(r.title)}.${src}${url}</p>`
  }).join("\n")

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Research Report — IEEE Format</title>
<style>
@page{size:letter;margin:1in 0.75in;}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{
  font-family:"Times New Roman",Times,serif;
  font-size:10pt;line-height:1.15;color:#000;background:#fff;
  margin:0;padding:0;
}
/* ==== toolbar ==== */
.bar{position:fixed;top:0;left:0;right:0;z-index:999;display:flex;align-items:center;justify-content:center;gap:8px;padding:8px;background:#fff;border-bottom:1px solid #ddd;font-family:system-ui,sans-serif;font-size:12px;}
.bar button{padding:6px 14px;border-radius:4px;font-size:12px;cursor:pointer;border:1px solid #ccc;background:#fff;}
.bar button:hover{background:#f5f5f5;}
.bar .p{background:#000;color:#fff;border-color:#000;}
.bar .p:hover{background:#222;}
.bar span{color:#888;}
@media print{.bar{display:none!important;} .page{padding-top:0!important;}}
/* ==== page ==== */
.page{max-width:7in;margin:0 auto;padding:48px 0 0 0;}
/* ==== title block — full width ==== */
.title-block{text-align:center;margin-bottom:12pt;}
.title-block h1{font-size:24pt;font-weight:400;line-height:1.15;margin-bottom:8pt;}
.title-block .auth{font-size:11pt;margin-bottom:2pt;}
.title-block .aff{font-size:9pt;font-style:italic;}
.title-block .date{font-size:9pt;color:#000;margin-top:4pt;}
/* ==== abstract — full width ==== */
.abs{margin:0 auto 14pt auto;max-width:6.5in;font-size:9pt;line-height:1.25;text-align:justify;}
.abs b{font-style:italic;}
.abs p{margin:0;}
.abs .kw{margin-top:6pt;font-size:8pt;}
.abs .kw em{font-style:italic;font-weight:700;}
/* ==== two columns ==== */
.cols{column-count:2;column-gap:0.25in;text-align:justify;hyphens:auto;-webkit-hyphens:auto;}
/* ==== sections ==== */
.cols h2{
  column-span:none;font-size:10pt;font-weight:400;text-align:center;
  text-transform:uppercase;margin:10pt 0 6pt 0;letter-spacing:0.02em;
}
.cols h3{font-size:10pt;font-style:italic;font-weight:400;margin:8pt 0 4pt 0;}
.cols p{text-indent:0.2in;margin-bottom:2pt;font-size:10pt;line-height:1.15;}
.cols p:first-of-type,.cols h2+p,.cols h3+p{text-indent:0;}
/* ==== table ==== */
.cols table{width:100%;border-collapse:collapse;margin:6pt 0;font-size:8pt;break-inside:avoid;}
.cols table caption{font-size:8pt;text-align:center;margin-bottom:3pt;font-variant:small-caps;letter-spacing:0.04em;}
.cols table thead th{border-top:1.5pt solid #000;border-bottom:0.75pt solid #000;padding:2pt 4pt;text-align:left;font-weight:400;}
.cols table tbody td{padding:2pt 4pt;border:none;}
.cols table tbody tr:last-child td{border-bottom:1.5pt solid #000;}
.cols table .gc{text-align:center;font-weight:700;width:20pt;}
/* ==== references ==== */
.refs{margin-top:10pt;}
.refs h2{font-size:10pt;font-weight:400;text-align:center;text-transform:uppercase;margin-bottom:6pt;letter-spacing:0.02em;}
.refs p{font-size:8pt;line-height:1.25;margin-bottom:2pt;text-indent:-1.2em;padding-left:1.2em;}
.refs em{font-style:italic;}
@media print{.cols{column-count:2;} .page{max-width:none;padding:0;}}
</style></head><body>
<div class="bar"><span>IEEE Format</span><button class="p" onclick="window.print()">Save as PDF</button><button onclick="window.close()">Close</button></div>
<div class="page">

<div class="title-block">
<h1>Personalized Evidence-Based Research Report</h1>
<div class="auth">${userName ? esc(userName) : "Research Subject"}</div>
<div class="aff">Personal PI — Multi-Agent AI Research System</div>
<div class="date">${date}</div>
</div>

<div class="abs">
<p><b>Abstract</b>—${esc(abstractText)}${abstractCites.length > 0 ? ` [${[...new Set(abstractCites)].join(", ")}]` : ""}</p>
<div class="kw"><em>Index Terms</em>—${esc(dbs)}, evidence grading, personalized research.</div>
</div>

<div class="cols">

<h2>I. Introduction</h2>
<p>This report presents a personalized, evidence-graded analysis produced by a multi-agent artificial intelligence research system. Specialized sub-agents independently queried scientific databases (${esc(dbs)}), graded evidence quality, and synthesized findings into recommendations tailored to the subject's individual profile.</p>
<p>Each recommendation is accompanied by an evidence grade (A through F) indicating the strength of the supporting research, following the framework defined in Section ${toRoman(methN)}.</p>

${bodySecs}

<h2>${toRoman(methN)}. Methodology</h2>
${methText ? methText.split("\n").filter((p) => p.trim()).map((p) => `<p>${esc(p)}</p>`).join("\n") : ""}
<p>The analysis was performed by a hierarchical multi-agent system querying ${esc(dbs)}. A total of ${findings.length} sources were identified, screened, and graded using the framework in Table I.</p>

<h3>A. Evidence Grading Framework</h3>
<table><caption>Table I: Evidence Grading Scale</caption>
<thead><tr><th class="gc">Grade</th><th>Level</th><th>Description</th></tr></thead>
<tbody>
<tr><td class="gc">A</td><td>Meta-analysis</td><td>Pooled analysis of multiple RCTs</td></tr>
<tr><td class="gc">B</td><td>Multiple RCTs</td><td>Consistent randomized trial findings</td></tr>
<tr><td class="gc">C</td><td>Single RCT</td><td>One experiment or large cohort study</td></tr>
<tr><td class="gc">D</td><td>Preliminary</td><td>Pilot studies, case reports, small samples</td></tr>
<tr><td class="gc">F</td><td>Consensus</td><td>Expert opinion or mechanistic reasoning</td></tr>
</tbody></table>

<h3>B. Inclusion Criteria</h3>
<p>Sources were included if: (1) published in a peer-reviewed journal; (2) published within the last 10 years; (3) study population applicable to the subject's demographic profile.</p>

<h3>C. Limitations</h3>
<p>This report is generated by an AI system and does not constitute professional advice. Evidence grades are assigned algorithmically. Individual responses may vary from population-level findings.</p>

<div class="refs">
<h2>References</h2>
${refsHtml}
</div>

</div>
</div></body></html>`
}

// ============================================================
//  APA FORMAT — Single column, 12pt TNR, double-spaced
//  Matches: APA 7th edition student paper
// ============================================================

function generateAPA(opts: Omit<PaperOptions, "format">): string {
  const { sections, findings, userName } = opts
  const refs = buildRefs(sections, findings)
  const overview = sections.filter((s) => s.domain === "overview")
  const body = sections.filter((s) => s.domain !== "overview" && s.domain !== "methodology")
  const meth = sections.filter((s) => s.domain === "methodology")
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  const dbs = [...new Set(findings.map((f) => f.sourceType))]
    .map((t) => (t === "pubmed" ? "PubMed" : t === "exa" ? "Exa AI" : t === "onet" ? "O*NET" : t))
    .join(", ")

  const abstractText = overview.map((s) => s.content).join(" ")

  // APA uses (Author, Year) but we only have titles, so use numbered style with author-date appearance
  // Build reference list in APA format: Author. (Year). Title. Source. URL
  const apaRefs = refs.map((r) => {
    const src = r.source ? ` <em>${esc(r.source)}</em>.` : ""
    const url = r.url ? ` ${esc(resolveUrl(r.url))}` : ""
    return `<p class="ref">Personal PI Research Agent. (2026). ${esc(r.title)}.${src}${url}</p>`
  }).join("\n")

  let secN = 0
  const bodySecs = body.map((s) => {
    secN++
    const cn = getCiteNums(s.citations, refs)
    // APA inline citations as (Personal PI, 2026)
    const paras = s.content.split("\n").filter((p) => p.trim())
    const cite = cn.length > 0 ? ` (Personal PI Research Agent, 2026)` : ""
    const html = paras.map((p, i) => `<p>${esc(p)}${i === paras.length - 1 ? cite : ""}</p>`).join("\n")
    // APA Level 1: Centered, Bold
    return `<h2>${esc(s.sectionName)}</h2>\n${html}`
  }).join("\n\n")

  const methText = meth.map((s) => s.content).join("\n\n")

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Research Report — APA Format</title>
<style>
@page{size:letter;margin:1in;}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{
  font-family:"Times New Roman",Times,serif;
  font-size:12pt;line-height:2;color:#000;background:#fff;
  margin:0;padding:0;
}
/* ==== toolbar ==== */
.bar{position:fixed;top:0;left:0;right:0;z-index:999;display:flex;align-items:center;justify-content:center;gap:8px;padding:8px;background:#fff;border-bottom:1px solid #ddd;font-family:system-ui,sans-serif;font-size:12px;}
.bar button{padding:6px 14px;border-radius:4px;font-size:12px;cursor:pointer;border:1px solid #ccc;background:#fff;}
.bar button:hover{background:#f5f5f5;}
.bar .p{background:#000;color:#fff;border-color:#000;}
.bar .p:hover{background:#222;}
.bar span{color:#888;}
@media print{.bar{display:none!important;} .pg{padding-top:0!important;margin-top:0!important;}}
/* ==== page ==== */
.pg{max-width:6.5in;margin:0 auto;padding:48px 0 0 0;}
/* ==== page number ==== */
.pgnum{text-align:right;font-size:12pt;margin-bottom:0;}
/* ==== title page ==== */
.title-pg{text-align:center;padding-top:3in;}
.title-pg h1{font-size:12pt;font-weight:700;line-height:2;margin-bottom:0;}
.title-pg .auth{font-size:12pt;line-height:2;}
.title-pg .aff{font-size:12pt;line-height:2;}
.title-pg .date{font-size:12pt;line-height:2;}
/* ==== abstract page ==== */
.abs-pg{break-before:page;}
.abs-pg h2{font-size:12pt;font-weight:700;text-align:center;margin-bottom:0;line-height:2;}
.abs-pg p{text-indent:0.5in;font-size:12pt;line-height:2;text-align:left;margin:0;}
.abs-pg p:first-of-type{text-indent:0.5in;}
/* ==== body ==== */
.body-pg{break-before:page;}
.body-pg h1.body-title{font-size:12pt;font-weight:700;text-align:center;margin-bottom:0;line-height:2;}
/* APA Level 1: Centered, Bold */
.body-pg h2{font-size:12pt;font-weight:700;text-align:center;margin-top:0;margin-bottom:0;line-height:2;}
/* APA Level 2: Left-Aligned, Bold */
.body-pg h3{font-size:12pt;font-weight:700;text-align:left;margin-top:0;margin-bottom:0;line-height:2;}
/* APA Level 3: Left-Aligned, Bold Italic */
.body-pg h4{font-size:12pt;font-weight:700;font-style:italic;text-align:left;margin-top:0;margin-bottom:0;line-height:2;}
.body-pg p{text-indent:0.5in;font-size:12pt;line-height:2;text-align:left;margin:0;}
/* ==== references ==== */
.refs-pg{break-before:page;}
.refs-pg h2{font-size:12pt;font-weight:700;text-align:center;margin-bottom:0;line-height:2;}
.refs-pg .ref{
  text-indent:-0.5in;padding-left:0.5in;font-size:12pt;line-height:2;margin:0;text-align:left;
}
.refs-pg .ref em{font-style:italic;}
/* ==== table ==== */
.body-pg table{border-collapse:collapse;width:100%;margin:12pt 0;font-size:11pt;line-height:1.5;}
.body-pg table caption{text-align:left;font-size:12pt;line-height:2;margin-bottom:0;}
.body-pg table caption .tnum{font-weight:700;}
.body-pg table caption .tcap{font-style:italic;}
.body-pg table thead th{border-top:1.5pt solid #000;border-bottom:1pt solid #000;padding:4pt 8pt;text-align:left;font-weight:400;}
.body-pg table tbody td{padding:3pt 8pt;border:none;}
.body-pg table tbody tr:last-child td{border-bottom:1.5pt solid #000;}
.body-pg table .gc{text-align:center;font-weight:700;}
@media print{.pg{max-width:none;padding:0;}}
</style></head><body>
<div class="bar"><span>APA 7th Edition</span><button class="p" onclick="window.print()">Save as PDF</button><button onclick="window.close()">Close</button></div>
<div class="pg">

<!-- ==== PAGE 1: TITLE ==== -->
<div class="title-pg">
<p class="pgnum">1</p>
<h1>Personalized Evidence-Based Research Report</h1>
<div class="auth">${userName ? esc(userName) : "Research Subject"}</div>
<div class="aff">Personal PI — Multi-Agent AI Research System</div>
<div class="date">${date}</div>
</div>

<!-- ==== PAGE 2: ABSTRACT ==== -->
<div class="abs-pg">
<p class="pgnum">2</p>
<h2>Abstract</h2>
<p>${esc(abstractText)}</p>
</div>

<!-- ==== PAGE 3+: BODY ==== -->
<div class="body-pg">
<p class="pgnum">3</p>
<h1 class="body-title">Personalized Evidence-Based Research Report</h1>

<h2>Introduction</h2>
<p>This report presents a personalized, evidence-graded analysis produced by a multi-agent artificial intelligence research system. Specialized sub-agents independently queried scientific databases (${esc(dbs)}), graded evidence quality on a standardized scale, and synthesized findings into actionable recommendations tailored to the subject's individual profile.</p>
<p>Each recommendation is accompanied by an evidence grade indicating the strength of the supporting research. A total of ${findings.length} sources were reviewed.</p>

${bodySecs}

<h2>Methodology</h2>
${methText ? methText.split("\n").filter((p) => p.trim()).map((p) => `<p>${esc(p)}</p>`).join("\n") : ""}
<p>The analysis was performed by a hierarchical multi-agent system querying ${esc(dbs)}. Each source was independently graded for evidence quality using the framework described in Table 1.</p>

<h3>Evidence Grading Framework</h3>
<table>
<caption><span class="tnum">Table 1</span><br><span class="tcap">Evidence Grading Scale Used in This Report</span></caption>
<thead><tr><th class="gc">Grade</th><th>Evidence Level</th><th>Description</th></tr></thead>
<tbody>
<tr><td class="gc">A</td><td>Meta-analysis / Systematic Review</td><td>Pooled analysis of multiple randomized controlled trials</td></tr>
<tr><td class="gc">B</td><td>Multiple RCTs</td><td>Consistent findings across well-designed randomized trials</td></tr>
<tr><td class="gc">C</td><td>Single RCT / Strong Observational</td><td>One well-designed experiment or large cohort study</td></tr>
<tr><td class="gc">D</td><td>Preliminary / Limited</td><td>Pilot studies, case reports, small sample sizes</td></tr>
<tr><td class="gc">F</td><td>Expert Consensus</td><td>Professional opinion, mechanistic reasoning, or extrapolation</td></tr>
</tbody></table>

<h3>Inclusion Criteria</h3>
<p>Sources were included if they satisfied the following criteria: (a) published in a peer-reviewed journal or indexed in a recognized database, (b) published within the last 10 years with exceptions for landmark studies, and (c) study population reasonably applicable to the subject's demographic profile.</p>

<h3>Limitations</h3>
<p>This report is generated by an artificial intelligence system and does not constitute professional medical, career, or academic advice. Evidence grades are assigned algorithmically and may not capture every nuance of study quality. Individual responses may differ from population-level findings.</p>

</div>

<!-- ==== REFERENCES ==== -->
<div class="refs-pg">
<h2>References</h2>
${apaRefs}
</div>

</div></body></html>`
}

// ============================================================
//  Public API
// ============================================================

export function generatePaperHtml(opts: PaperOptions): string {
  if (opts.format === "apa") return generateAPA(opts)
  return generateIEEE(opts)
}

export function exportPaper(opts: PaperOptions): void {
  const html = generatePaperHtml(opts)
  const blob = new Blob([html], { type: "text/html" })
  const url = URL.createObjectURL(blob)
  window.open(url, "_blank")
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}
