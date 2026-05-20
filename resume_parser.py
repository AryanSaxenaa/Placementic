from openrouter_client import call_llm
import json
import base64
import fitz

def extract_text_from_pdf(pdf_base64: str) -> str:
    pdf_bytes = base64.b64decode(pdf_base64)
    with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
        return "\n".join(page.get_text() for page in doc)

FALLBACK_RESUME = {
    "skills": [],
    "years_experience": 0,
    "domain": "other",
    "education": {"college": "", "degree": "", "grad_year": 0},
    "seniority_level": "fresher",
}

RESUME_PROMPT = """
Extract from this resume text. Return ONLY valid JSON, no explanation, no markdown:
{{
  "skills": ["skill1", "skill2"],
  "years_experience": 0,
  "domain": "tech/finance/sales/operations/other",
  "education": {{ "college": "", "degree": "", "grad_year": 0 }},
  "seniority_level": "fresher/junior/mid/senior"
}}

Resume text:
{resume_text}
"""

async def parse_resume(pdf_base64: str) -> dict:
    try:
        text = extract_text_from_pdf(pdf_base64)
    except (fitz.FileDataError, ValueError):
        return FALLBACK_RESUME
    raw = await call_llm(RESUME_PROMPT.format(resume_text=text))
    if not raw:
        return FALLBACK_RESUME
    try:
        return json.loads(raw.strip())
    except json.JSONDecodeError:
        return FALLBACK_RESUME
