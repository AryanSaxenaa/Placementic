import asyncio
import httpx
import base64
import json

# Minimal valid PDF with text "Rahul Sharma, B.Com, Skills: Sales, Communication, Business Development"
MINIMAL_PDF = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >>\nendobj\n4 0 obj\n<< /Length 110 >>\nstream\nBT /F1 12 Tf 10 700 Td (Rahul Sharma, B.Com, Skills: Sales, Communication, Business Development) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000288 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n447\n%%EOF"

async def run_e2e_test():
    pdf_base64 = base64.b64encode(MINIMAL_PDF).decode("utf-8")

    payload = {
        "resume_base64": pdf_base64,
        "company_name": "Unlox",
        "jd_text": "Business Development Executive. Generate leads, cold calling, close sales, field work, achieve aggressive targets.",
        "college_name": "Delhi University"
    }

    print("Hitting /analyze endpoint...")
    async with httpx.AsyncClient(timeout=300.0) as client:
        try:
            response = await client.post("http://localhost:8011/analyze", json=payload)
            print("Status:", response.status_code)
            print("Response:", json.dumps(response.json(), indent=2))
        except Exception as e:
            print("Error making request:", e)

if __name__ == "__main__":
    asyncio.run(run_e2e_test())
