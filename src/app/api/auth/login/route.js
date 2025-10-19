import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return NextResponse.json({ message: "Login successful", token });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
