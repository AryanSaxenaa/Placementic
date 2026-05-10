from openrouter_client import call_llm
import json

REPORT_PROMPT = """
You are an objective, data-driven, and slightly strict career analyst.
You evaluate job descriptions directly against the provided context (scraped data, resume data) and calculate fair, realistic estimations based *only* on the provided JSON data.

CRITICAL INSTRUCTIONS:
1. Do not hallucinate or invent any information. Do not guess salaries or job roles if they are not stated in the JD or the scraped data.
2. Ensure you ONLY rate the company and job based on the actual JSON data dumped in the CONTEXT/DATA block at the bottom of the prompt.
3. Keep the tone professional, objective, and realistic. You are NOT unhinged, you are an analyst helping a student.

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
  "real_role": "A short 2-4 word honest summary of the title",
  "what_you_actually_do": "A factual 1-2 sentence breakdown of the actual responsibilities based on the provided JD.",
  "red_flags": ["list of factual warnings or potential downsides drawn directly from the JD and internet data..."],
  "college_reality": "A grounded, factual reality check comparing their provided college data to this role's offerings.",
  "verdict": "GO/MAYBE/HARD PASS",
  "verdict_reason": "Provide a detailed, highly factual summary explaining exactly what this job entails and why it is or isn't a good fit. Focus strictly on the data provided (the pay, the required hours, the title, the responsibilities)."
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
