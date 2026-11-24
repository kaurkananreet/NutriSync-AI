
import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY is missing from .env")

client = genai.Client(api_key=API_KEY)

MODEL_NAME = "gemini-3.6-flash"


def generate_wellness_insight(prompt: str) -> str:
    """
    Generate general nutrition and wellness insights
    using Google Gemini.
    """

    if not prompt or not prompt.strip():
        raise ValueError("Prompt cannot be empty")

    if len(prompt) > 2000:
        raise ValueError("Prompt is too long")

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=(
                "You are NutriSync AI, a friendly nutrition and "
                "general wellness assistant. Provide clear, practical, "
                "evidence-aware information. Do not diagnose medical "
                "conditions, prescribe treatments, or recommend "
                "restrictive diets. Encourage users to consult a "
                "qualified healthcare professional for medical concerns."
            ),
            temperature=0.4,
            max_output_tokens=500
        )
    )

    if not response.text:
        raise RuntimeError("Gemini returned an empty response")

    return response.text
