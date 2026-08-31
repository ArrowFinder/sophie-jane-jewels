import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = request.headers.get("x-sjj-secret") ?? new URL(request.url).searchParams.get("secret");
  if (!process.env.SHOPIFY_REVALIDATION_SECRET || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidateTag("products", "max");
  revalidateTag("collections", "max");
  return NextResponse.json({ ok: true, revalidated: true });
}
