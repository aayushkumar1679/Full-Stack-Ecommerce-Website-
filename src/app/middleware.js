import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const JWT_SECRET = process.env.JWT_SECRET;
  const { pathname } = req.nextUrl;

  // ✅ Allow public routes (login/register)
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // ✅ Check token for protected routes
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized middle" }, { status: 401 });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
}
