import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  hasAdminSecretConfigured,
  isValidAdminSecret,
} from "@/lib/server/admin-auth";

export async function POST(request: Request) {
  if (!hasAdminSecretConfigured()) {
    return NextResponse.json(
      { error: "Admin şifresi yapılandırılmamış. .env içine ADMIN_UI_PASSWORD ekleyin." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as { password?: string };
  const password = body.password?.trim();

  if (!isValidAdminSecret(password)) {
    return NextResponse.json({ error: "Geçersiz şifre" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, password as string, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
