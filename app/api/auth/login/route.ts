import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Set HTTP-only Cookie
    await setAuthCookie({
      userId: user.id,
      email: user.email,
      role: user.role as "SELLER" | "ADMIN",
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("[Login Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
