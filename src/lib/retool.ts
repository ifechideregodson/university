export async function callRetoolWorkflow<T>(payload: unknown): Promise<T> {
  const url = process.env.RETOOL_API_URL;
  const key = process.env.RETOOL_API_KEY;

  if (!url || !key) {
    throw new Error("Retool integration is not configured.");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`
    },
    body: JSON.stringify(payload),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Retool workflow failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
