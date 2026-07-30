import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://save-art.ddev.site";

// Проксі потрібен, бо react-pdf вантажить файл через fetch (не через <a>/<iframe>),
// а сховище на save-art.ddev.site не віддає CORS-заголовки — браузер блокує читання
// байтів PDF з іншого origin. Дозволяємо проксувати лише файли з нашого API_BASE.
export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = request.nextUrl.searchParams.get("url");

  if (!url || !url.startsWith(API_BASE)) {
    return NextResponse.json({ message: "Invalid url" }, { status: 400 });
  }

  const upstream = await fetch(url);

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ message: "Failed to fetch PDF" }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
