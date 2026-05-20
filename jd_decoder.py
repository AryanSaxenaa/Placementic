from openrouter_client import call_llm
import json

FALLBACK_JD = {
    "real_role": "unknown",
    "what_you_actually_do": "Unable to determine from the provided job description.",
    "red_flags": [],
    "required_skills": [],
    "seniority_expected": "fresher",
}

JD_PROMPT = """
Analyze this job description. Return ONLY valid JSON, no explanation, no markdown:
{{
  "real_role": "one of: field_sales/inside_sales/account_mgmt/consulting/analyst/operations/product/engineering/marketing/hr",
  "what_you_actually_do": "2 sentences plain English, zero corporate speak",
  "red_flags": ["only real ones like bond/targets/stipend-trap — empty array if none"],
  "required_skills": ["skill1", "skill2"],
  "seniority_expected": "fresher/junior/mid/senior"
}}

JD:
{jd_text}
"""

async def decode_jd(jd_text: str) -> dict:
    raw = await call_llm(JD_PROMPT.format(jd_text=jd_text))
    if not raw:
        return FALLBACK_JD
    try:
        return json.loads(raw.strip())
    except json.JSONDecodeError:
        return FALLBACK_JD
