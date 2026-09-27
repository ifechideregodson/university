import { callSqliteFallback } from "@/lib/sqlite-fallback";

function unwrapResponse(value: any): any {
  if (value && typeof value === "object") {
    if (value.data && typeof value.data === "object") {
      if (value.data.data && typeof value.data.data === "object") return value.data.data;
      return value.data;
    }
    if (value.result && typeof value.result === "object") return value.result;
  }
  return value;
}

function hasUsableResponse(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value)) return true;
  if (typeof value !== "object") return true;
  return Object.keys(value).length > 0;
}

export async function callRetoolWorkflow<T>(payload: unknown): Promise<T> {
  const url = process.env.RETOOL_API_URL;
  const key = process.env.RETOOL_API_KEY;

  if (!url || !key) {
    return callSqliteFallback(payload as Record<string, unknown>) as Promise<T>;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Retool workflow failed: ${response.status}`);
    }

    const raw = await response.json();
    const data = unwrapResponse(raw);

    if (!hasUsableResponse(data)) {
      throw new Error("Retool workflow returned an empty response");
    }

    return data as T;
  } catch (error) {
    console.warn("Retool unavailable or empty; using SQLite fallback.", error);
    return callSqliteFallback(payload as Record<string, unknown>) as Promise<T>;
  }
}
