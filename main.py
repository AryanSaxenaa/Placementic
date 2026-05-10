from fastapi import FastAPI
from pydantic import BaseModel
import asyncio, base64
from dotenv import load_dotenv
import os

load_dotenv()

from resume_parser import parse_resume
from jd_decoder import decode_jd
from scraper_runner import scrape_all
from report_builder import build_report
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    resume_base64: str
    company_name: str
    jd_text: str
    college_name: str

@app.post("/analyze")
async def analyze(req: AnalyzeRequest):
    # Run resume parse, jd decode, and all scrapers in parallel
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
async def root():
    return {"status": "ok", "message": "Backend is running"}

@app.get("/health")
async def health():
    return {"status": "ok"}
