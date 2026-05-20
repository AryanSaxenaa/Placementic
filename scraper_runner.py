import httpx
import asyncio
import os

APIFY_TOKEN = os.getenv("APIFY_TOKEN")

if not APIFY_TOKEN:
    raise RuntimeError(
        "APIFY_TOKEN environment variable is not set. "
        "Set it in your .env file or environment before starting the server."
    )

async def run_actor(actor_id: str, input_data: dict) -> list:
    url = f"https://api.apify.com/v2/acts/{actor_id}/run-sync-get-dataset-items"
    async with httpx.AsyncClient(timeout=90) as client:
        r = await client.post(url, json=input_data, headers={"Authorization": f"Bearer {APIFY_TOKEN}"})
        if r.status_code == 201 or r.status_code == 200:
            return r.json()
        return []

async def scrape_all(company_name: str, college_name: str) -> tuple:
    results = await asyncio.gather(
        run_actor("memo23/apify-glassdoor-reviews-scraper", {"queries": [company_name]}),
        run_actor("thirdwatch/ambitionbox-scraper",         {"search": company_name}),
        run_actor("dev_fusion/linkedin-profile-scraper",    {"url": f"https://www.linkedin.com/company/{company_name.lower().replace(' ', '-')}"}),
        run_actor("apify/google-search-scraper",            {"queries": f"{college_name} median package placement statistics"}),
        run_actor("epctex/reddit-scraper",                  {"startUrls": [{"url": f"https://www.reddit.com/search/?q={company_name}"}]}),
        run_actor("apify/google-search-scraper",            {"queries": f"{company_name} reviews layoffs toxic culture work life balance"}),
        return_exceptions=True
    )
    return tuple(r if not isinstance(r, Exception) else [] for r in results)
