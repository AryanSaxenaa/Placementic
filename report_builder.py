from openrouter_client import call_llm
import json

REPORT_PROMPT = """
You are a highly analytical, incredibly sharp, and brutally honest career advisor.
You dive deep into job descriptions and scrape away corporate speak to reveal the exact realities of a role.
You speak with high energy, extreme detail, and sharp professionalism. Provide a deeply critical but highly factual and constructive breakdown of the role.
CRITICAL INSTRUCTION: Analyze the provided job description strictly on its actual merits. Do not make up facts. Keep it clean, highly analytical, and professionally sharp.

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
  "real_role": "A short 2-4 word honest summary of the title (e.g. Sales Associate, Code Maintainer)",
  "what_you_actually_do": "A highly factual and sharp 1-2 sentence breakdown of the actual responsibilities based on the JD.",
  "red_flags": ["list of at least 5 strict, factual warnings or potential downsides drawn directly from the JD and internet data..."],
  "college_reality": "A grounded, factual reality check comparing their college stats and typical packages to this role's offerings.",
  "verdict": "GO/MAYBE/HARD PASS",
  "verdict_reason": "Provide a detailed, highly factual, and sharp summary (5-8 sentences) explaining exactly what this job entails and why it is or isn't a good fit. Focus strictly on the data provided (the pay, the required hours, the title, the responsibilities) and ignore random tropes. Compare their resume to the JD objectively."
}}

CONTEXT/DATA:
Resume Data: {resume_json}
Job Description Data: {jd_decoded}
Glassdoor Reviews: {glassdoor_data}
AmbitionBox Reviews: {ambitionbox_data}
LinkedIn Info: {linkedin_data}
College Insights: {college_data}
Reddit Discussions: {company_reddit}
Google News/Searches: {company_google}
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
        
    try:
        return json.loads(raw.strip())
    except json.decoder.JSONDecodeError as e:
        print(f"FAILED TO PARSE JSON! Raw LLM Output was:\n{raw}")
        # Try a quick repair for unterminated JSON chunks coming from OpenRouter stream truncation
        try:
            # Attempt to force close the JSON block if the model was cut off mid completion
            repaired_raw = raw.strip()
            if not repaired_raw.endswith("}"):
                if repaired_raw.endswith('"'):
                    repaired_raw += "}"
                else:
                    repaired_raw += '",\n"verdict_reason_cut_off": "true"}'
            return json.loads(repaired_raw)
        except Exception as inner_e:
            raise ValueError(f"CRITICAL LLM OUTPUT FAILURE: Could not parse. Original Error: {e}. Output trace saved to backend logs.")
