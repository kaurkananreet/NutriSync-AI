
from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from database import db

router = APIRouter(prefix="/api/nutrition", tags=["Nutrition"])

nutrition_collection = db["nutrition"]


class Meal(BaseModel):
    meal_name: str = Field(min_length=1)
    calories: float = Field(ge=0)
    protein: float = Field(ge=0)
    carbs: float = Field(ge=0)
    fats: float = Field(ge=0)
    meal_type: Optional[str] = None


def serialize_meal(meal):
    meal["_id"] = str(meal["_id"])
    return meal


@router.post("/")
def add_meal(meal: Meal):
    meal_data = meal.model_dump()
    meal_data["created_at"] = datetime.now(timezone.utc)

    result = nutrition_collection.insert_one(meal_data)

    saved_meal = nutrition_collection.find_one(
        {"_id": result.inserted_id}
    )

    return {
        "status": "success",
        "message": "Meal saved successfully",
        "data": serialize_meal(saved_meal)
    }


@router.get("/")
def get_meals():
    meals = list(
        nutrition_collection.find().sort("created_at", -1)
    )

    return {
        "status": "success",
        "data": [serialize_meal(meal) for meal in meals]
    }


@router.delete("/{meal_id}")
def delete_meal(meal_id: str):
    if not ObjectId.is_valid(meal_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid meal ID"
        )

    result = nutrition_collection.delete_one(
        {"_id": ObjectId(meal_id)}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Meal not found"
        )

    return {
        "status": "success",
        "message": "Meal deleted successfully"
    }
