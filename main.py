from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import asyncio
from contextlib import asynccontextmanager
from dotenv import load_dotenv

load_dotenv()

from openrouter_client import _get_client
from resume_parser import parse_resume
from jd_decoder import decode_jd
from scraper_runner import scrape_all
from report_builder import build_report
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app):
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://frontend-dot-admesh-testnet.uc.r.appspot.com",
        "http://localhost:3000",
        "http://frontend-dot-admesh-testnet.uc.r.appspot.com",
        "https://admesh-testnet.uc.r.appspot.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    resume_base64: str
    company_name: str
    jd_text: str
    college_name: str

@app.post("/analyze")
async def analyze(req: AnalyzeRequest) -> dict:
    from openrouter_client import OPENROUTER_API_KEY
    from scraper_runner import APIFY_TOKEN

    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=503, detail="OPENROUTER_API_KEY is not configured on the server.")
    if not APIFY_TOKEN:
        raise HTTPException(status_code=503, detail="APIFY_TOKEN is not configured on the server. Scraping will be skipped.")

    if len(req.resume_base64) > 15 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Resume file too large (max ~10MB PDF)")

    resume_task = parse_resume(req.resume_base64)
    jd_task = decode_jd(req.jd_text)
    scrape_task = scrape_all(req.company_name, req.college_name)

    resume, jd, scraped = await asyncio.gather(resume_task, jd_task, scrape_task)
    glassdoor, ambitionbox, linkedin, college_google, company_reddit, company_google = scraped

    report = await build_report(
        resume, jd, glassdoor, ambitionbox, linkedin, 
        college_google, company_reddit, company_google
    )
    return report

@app.get("/")
async def root() -> dict:
    return {"status": "ok", "message": "Backend is running"}

@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}
