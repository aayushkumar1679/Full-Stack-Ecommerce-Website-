import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    await connectToDatabase();

    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
}
