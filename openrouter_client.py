from openai import AsyncOpenAI
import os

LLM_MODEL = os.getenv("LLM_MODEL", "poolside/laguna-m.1:free")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

client = None

def _get_client() -> AsyncOpenAI:
    global client
    if client is None:
        if not OPENROUTER_API_KEY:
            raise RuntimeError(
                "OPENROUTER_API_KEY environment variable is not set. "
                "Set it in your .env file or environment before starting the server."
            )
        client = AsyncOpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=OPENROUTER_API_KEY,
            timeout=60,
        )
    return client

async def call_llm(prompt: str, max_tokens: int = 1000):
    c = _get_client()
    messages = [{"role": "user", "content": prompt}]

    response = await c.chat.completions.create(
        model=LLM_MODEL,
        messages=messages,
        max_tokens=max_tokens,
        extra_body={"reasoning": {"enabled": True}}
    )
    return response.choices[0].message.content
