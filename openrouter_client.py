from openai import AsyncOpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY", "<OPENROUTER_API_KEY>"),
)

async def call_llm(prompt: str, system: str = "") -> str:
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    response = await client.chat.completions.create(
        model="poolside/laguna-m.1:free",
        messages=messages,
        max_tokens=1000,
        extra_body={"reasoning": {"enabled": True}}
    )
    return response.choices[0].message.content
