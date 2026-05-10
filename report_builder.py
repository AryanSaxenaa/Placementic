from openrouter_client import call_llm
import json

REPORT_PROMPT = """
You are an absolutely UNHINGED, brutally honest, completely fed-up career advisor.
You have seen too many students ruin their lives for corporate garbage and you hold NO punches.
You speak with high energy, extreme detail, and raw sarcasm. Rip the job description apart. Destroy inflated college claims. Be wild, detailed, and unhinged in your analysis.
CRITICAL INSTRUCTION: DO NOT USE ANY CUSS WORDS OR PROFANITY. Keep it clean but brutally aggressive and sarcastic.

Return ONLY valid JSON, no explanation, no markdown. Ensure strings inside the JSON are properly terminated and escaped:
{{
  "company_scores": {{
    "culture": 0,
    "pay_fairness": 0,
    "growth": 0,
    "survival": 0,
    "work_life": 0
  }},
  "resume_match_percent": 0,
  "red_flags": ["list of at least 5 massive, extremely specific red flags..."],
  "college_reality": "Unhinged, aggressive reality check about their college package dreams",
  "verdict": "GO/MAYBE/HARD PASS",
  "verdict_reason": "Provide a massive, detailed, unhinged rant (10-15 sentences) explaining exactly why this job is a trap or a goldmine. Spare no hurt feelings, use capitalization for emphasis, and break down exactly what their day-to-day life will look like vs their resume."
}}
"""

async def build_report(resume, jd, glassdoor, ambitionbox, linkedin, college, company_reddit, company_google) -> dict:
    prompt = REPORT_PROMPT.format(
        resume_json=json.dumps(resume),
        jd_decoded=json.dumps(jd),
        glassdoor_data=json.dumps(glassdoor),
        ambitionbox_data=json.dumps(ambitionbox),
        linkedin_data=json.dumps(linkedin),
        college_data=json.dumps(college),
        company_reddit=json.dumps(company_reddit),
        company_google=json.dumps(company_google)
    )
    raw = await call_llm(prompt)
    
    # Strip any potential markdown blocks or leading/trailing whitespace
    raw = raw.strip()
    if raw.startswith("```json"):
        raw = raw[7:]
    if raw.startswith("```"):
        raw = raw[3:]
    if raw.endswith("```"):
        raw = raw[:-3]
    return json.loads(raw.strip())
