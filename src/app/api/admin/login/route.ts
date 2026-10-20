import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, createSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = formData.get("password")?.toString() ?? "";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.redirect(new URL("/admin/login?error=config", request.url));
  }

  if (password !== adminPassword) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url));
  }

  const token = await createSessionToken();
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login?error=config", request.url));
  }

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return NextResponse.redirect(new URL("/admin", request.url));
}
