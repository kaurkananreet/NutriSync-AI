
const API_BASE_URL = "http://127.0.0.1:8000";

// Nutrition data types
export interface Meal {
  _id: string;
  meal_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meal_type?: string;
  created_at?: string;
}

export interface MealInput {
  meal_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meal_type?: string;
}

// Check backend connection
export async function checkBackendConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);

    if (!response.ok) {
      throw new Error("Backend request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Backend connection error:", error);
    throw error;
  }
}

// Add a meal
export async function addMeal(meal: MealInput) {
  const response = await fetch(`${API_BASE_URL}/api/nutrition/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(meal),
  });

  if (!response.ok) {
    throw new Error("Failed to save meal");
  }

  return await response.json();
}

// Get all saved meals
export async function getMeals(): Promise<Meal[]> {
  const response = await fetch(`${API_BASE_URL}/api/nutrition/`);

  if (!response.ok) {
    throw new Error("Failed to fetch meals");
  }

  const result = await response.json();
  return result.data;
}

// Delete a meal
export async function deleteMeal(mealId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/nutrition/${mealId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete meal");
  }

  return await response.json();
}
