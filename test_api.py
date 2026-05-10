import asyncio
import httpx
import base64
import json

async def test_health():
    async with httpx.AsyncClient() as client:
        response = await client.get("http://localhost:8000/health")
        print("Health Check:", response.status_code, response.json())

async def test_analyze():
    with open("dummy.pdf", "wb") as f:
        f.write(b"%PDF-1.4 dummy pdf content for testing")
    with open("dummy.pdf", "rb") as f:
        pdf_base64 = base64.b64encode(f.read()).decode("utf-8")

    payload = {
        "resume_base64": pdf_base64,
        "company_name": "Google",
        "jd_text": "We are looking for a Software Engineer with Python and React skills.",
        "college_name": "IIT Bombay"
    }

    print("Hitting /analyze endpoint. This will call Apify and OpenRouter...")
    async with httpx.AsyncClient(timeout=180.0) as client:
        response = await client.post("http://localhost:8011/analyze", json=payload)
        print("Analyze Response Status:", response.status_code)
        try:
            print("Response:", json.dumps(response.json(), indent=2))
        except Exception as e:
            print("Response text:", response.text)

if __name__ == "__main__":
    asyncio.run(test_health())
    asyncio.run(test_analyze())
