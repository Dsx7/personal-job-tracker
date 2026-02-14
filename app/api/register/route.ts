import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email, password, secretCode } = await req.json(); // <--- Expect secretCode

    // 1. CHECK SECRET CODE
    const MY_SECRET = process.env.REGISTRATION_SECRET;
    
    if (!MY_SECRET) {
       return NextResponse.json({ message: "Registration disabled (No secret set)" }, { status: 403 });
    }

    if (secretCode !== MY_SECRET) {
       return NextResponse.json({ message: "Invalid Registration Code" }, { status: 403 });
    }

    await connectToDB();

    // 2. CHECK EXISTING USER
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // 3. CREATE USER
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword });
    
    return NextResponse.json({ message: "User created" }, { status: 201 });

  } catch (err: any) {
    console.error("REGISTER ERROR:", err); 
    return NextResponse.json({ message: "Error", details: err.message }, { status: 500 });
  }
}