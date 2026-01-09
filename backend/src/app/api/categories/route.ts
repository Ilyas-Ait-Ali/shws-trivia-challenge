import { NextResponse } from "next/server";

export const runtime = "nodejs";

type CategoryResponse = {
  trivia_categories: Array<{ id: number; name: string }>;
};

async function fetchWithTimeout(url: string, ms: number) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { cache: "no-store", signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

export async function GET() {
  try {
    const res = await fetchWithTimeout("https://opentdb.com/api_category.php", 5000);

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Failed to fetch categories", opentdb_status: res.status, body: text.slice(0, 200) },
        { status: 502 }
      );
    }

    const data = (await res.json()) as CategoryResponse;
    return NextResponse.json({ categories: data.trivia_categories });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Unexpected error", cause: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
