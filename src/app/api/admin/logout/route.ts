import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  (await cookies()).delete(COOKIE_NAME);
  return NextResponse.redirect(new URL("/admin/login", request.url));
}
