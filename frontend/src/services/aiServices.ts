
const API_BASE_URL = 'http://127.0.0.1:8000';

export async function generateInsight(prompt: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/ai/insights`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Unable to generate AI insight.');
  }

  return data.insight;
}
