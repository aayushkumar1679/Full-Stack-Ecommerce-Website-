import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
