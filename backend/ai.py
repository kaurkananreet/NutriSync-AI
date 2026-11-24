
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from ai_service import generate_wellness_insight

router = APIRouter(prefix="/api/ai", tags=["AI"])


class InsightRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=2000)


@router.post("/insights")
def get_ai_insight(request: InsightRequest):
    try:
        result = generate_wellness_insight(request.prompt)
        return {
            "success": True,
            "insight": result
        }

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    except Exception:
        raise HTTPException(
            status_code=502,
            detail="AI service is temporarily unavailable. Please try again."
        )
