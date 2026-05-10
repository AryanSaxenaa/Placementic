import httpx, asyncio
import os
from dotenv import load_dotenv

load_dotenv()

APIFY_TOKEN = os.getenv("APIFY_TOKEN", "<your_token>")

async def run_actor(actor_id: str, input_data: dict) -> dict:
    url = f"https://api.apify.com/v2/acts/{actor_id}/run-sync-get-dataset-items"
    async with httpx.AsyncClient(timeout=90) as client:
        r = await client.post(url, params={"token": APIFY_TOKEN}, json=input_data)
        if r.status_code == 201 or r.status_code == 200:
            return r.json()
        return {} # safe fallback

async def scrape_all(company_name: str, college_name: str) -> tuple:
    return await asyncio.gather(
        run_actor("memo23/apify-glassdoor-reviews-scraper", {"queries": [company_name]}),
        run_actor("thirdwatch/ambitionbox-scraper",         {"search": company_name}),
        run_actor("dev_fusion/linkedin-profile-scraper",    {"url": f"https://www.linkedin.com/company/{company_name.lower().replace(' ', '-')}"}),
        run_actor("apify/google-search-scraper",            {"queries": f"{college_name} median package placement statistics"}),
        run_actor("epctex/reddit-scraper",                  {"startUrls": [{"url": f"https://www.reddit.com/search/?q={company_name}"}]}),
        run_actor("apify/google-search-scraper",            {"queries": f"{company_name} reviews layoffs toxic culture work life balance"}),
        return_exceptions=True
    )
