import { tool } from "@langchain/core/tools"
import { z } from "zod"

const BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"

function apiKeyParam() {
  return process.env.NCBI_API_KEY ? `&api_key=${process.env.NCBI_API_KEY}` : ""
}

interface PubMedArticle {
  pmid: string
  title: string
  abstract: string
  authors: string[]
  journal: string
  year: string
  meshTerms: string[]
  doi?: string
}

async function fetchArticleDetails(pmids: string[]): Promise<PubMedArticle[]> {
  if (pmids.length === 0) return []

  const url = `${BASE_URL}/efetch.fcgi?db=pubmed&id=${pmids.join(",")}&retmode=xml${apiKeyParam()}`
  const res = await fetch(url)
  const xml = await res.text()

  // Parse XML to extract article data
  const articles: PubMedArticle[] = []

  for (const pmid of pmids) {
    // Extract article block for this PMID
    const articleRegex = new RegExp(
      `<PubmedArticle>[\\s\\S]*?<PMID[^>]*>${pmid}</PMID>[\\s\\S]*?</PubmedArticle>`,
      "m"
    )
    const match = xml.match(articleRegex)
    if (!match) continue

    const block = match[0]

    const title =
      block.match(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/)?.[1]?.replace(/<[^>]+>/g, "") ?? ""
    const abstract =
      block.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/)?.[1]?.replace(/<[^>]+>/g, "") ??
      ""

    const authors: string[] = []
    const authorMatches = block.matchAll(
      /<Author[^>]*>[\s\S]*?<LastName>(.*?)<\/LastName>[\s\S]*?<ForeName>(.*?)<\/ForeName>[\s\S]*?<\/Author>/g
    )
    for (const am of authorMatches) {
      authors.push(`${am[2]} ${am[1]}`)
    }

    const journal = block.match(/<Title>([\s\S]*?)<\/Title>/)?.[1] ?? ""
    const year =
      block.match(/<PubDate>[\s\S]*?<Year>(.*?)<\/Year>/)?.[1] ??
      block.match(/<PubDate>[\s\S]*?<MedlineDate>(.*?)<\/MedlineDate>/)?.[1]?.slice(0, 4) ??
      ""

    const meshTerms: string[] = []
    const meshMatches = block.matchAll(/<DescriptorName[^>]*>(.*?)<\/DescriptorName>/g)
    for (const mm of meshMatches) {
      meshTerms.push(mm[1])
    }

    const doi = block.match(/<ArticleId IdType="doi">(.*?)<\/ArticleId>/)?.[1]

    articles.push({ pmid, title, abstract, authors, journal, year, meshTerms, doi })
  }

  return articles
}

export const pubmedSearch = tool(
  async ({ query, maxResults }) => {
    // Step 1: Search for PMIDs
    const searchUrl = `${BASE_URL}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${maxResults ?? 10}&sort=relevance&retmode=json${apiKeyParam()}`
    const searchRes = await fetch(searchUrl)
    const searchData = await searchRes.json()

    const pmids: string[] = searchData.esearchresult?.idlist ?? []
    if (pmids.length === 0) {
      return JSON.stringify({ articles: [], count: 0 })
    }

    // Step 2: Fetch article details
    const articles = await fetchArticleDetails(pmids)

    return JSON.stringify({
      articles: articles.map((a) => ({
        pmid: a.pmid,
        title: a.title,
        abstract: a.abstract.slice(0, 1500),
        authors: a.authors.slice(0, 5),
        journal: a.journal,
        year: a.year,
        meshTerms: a.meshTerms.slice(0, 10),
        doi: a.doi,
      })),
      count: searchData.esearchresult?.count ?? 0,
    })
  },
  {
    name: "pubmed_search",
    description:
      "Search PubMed for biomedical research articles. Returns titles, abstracts, authors, journal, and MeSH terms. Use specific MeSH terms for better results (e.g., 'Resistance Training AND Hypertrophy').",
    schema: z.object({
      query: z
        .string()
        .describe(
          "PubMed search query. Supports Boolean operators (AND, OR, NOT) and MeSH terms."
        ),
      maxResults: z.number().min(1).max(50).optional().describe("Max results to return (default 10)"),
    }),
  }
)

export const pubmedGetFullText = tool(
  async ({ pmid }) => {
    // Try PMC first for full text
    const pmcSearchUrl = `${BASE_URL}/elink.fcgi?dbfrom=pubmed&db=pmc&id=${pmid}&retmode=json${apiKeyParam()}`
    const pmcSearchRes = await fetch(pmcSearchUrl)
    const pmcData = await pmcSearchRes.json()

    const pmcLinks = pmcData.linksets?.[0]?.linksetdbs?.find(
      (db: { linkname: string }) => db.linkname === "pubmed_pmc"
    )
    const pmcId = pmcLinks?.links?.[0]

    if (pmcId) {
      // Fetch full text from PMC
      const fullTextUrl = `${BASE_URL}/efetch.fcgi?db=pmc&id=${pmcId}&rettype=xml${apiKeyParam()}`
      const fullTextRes = await fetch(fullTextUrl)
      const xml = await fullTextRes.text()

      // Extract body text from XML
      const bodyMatch = xml.match(/<body[\s\S]*?>([\s\S]*?)<\/body>/i)
      if (bodyMatch) {
        const plainText = bodyMatch[1]
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
        return JSON.stringify({
          pmid,
          pmcId: `PMC${pmcId}`,
          fullText: plainText.slice(0, 15000),
          isFullText: true,
        })
      }
    }

    // Fallback to abstract only
    const articles = await fetchArticleDetails([pmid])
    if (articles.length === 0) {
      return JSON.stringify({ error: `Article ${pmid} not found` })
    }

    return JSON.stringify({
      pmid,
      abstract: articles[0].abstract,
      title: articles[0].title,
      isFullText: false,
    })
  },
  {
    name: "pubmed_get_full_text",
    description:
      "Get the full text of a PubMed article if available in PMC Open Access. Falls back to abstract if full text isn't available.",
    schema: z.object({
      pmid: z.string().describe("PubMed ID (PMID) of the article"),
    }),
  }
)
