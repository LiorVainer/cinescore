import { NextRequest, NextResponse } from "next/server";
import { searchMovies } from "@/app/actions/searchMovies";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  if (q.length < 2) {
    return NextResponse.json({ ok: true, results: [] });
  }

  try {
    const results = await searchMovies(q);
    return NextResponse.json({ ok: true, results });
  } catch (e) {
    console.error("/api/search error", e);
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  }
}

