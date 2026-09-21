import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, setAuthCookie } from "@/lib/auth";

const DEMO_USERS = [
  {
    id: "admin-user-id",
    email: "admin@cashforhousessummit.com",
    password: "admin123",
    firstName: "Summit",
    lastName: "Admin",
    role: "ADMIN" as const,
  },
  {
    id: "seller-user-id-1",
    email: "seller@example.com",
    password: "password123",
    firstName: "Marcus",
    lastName: "Vance",
    role: "SELLER" as const,
  },
  {
    id: "seller-user-id-2",
    email: "sarah.j@example.com",
    password: "password123",
    firstName: "Sarah",
    lastName: "Jenkins",
    role: "SELLER" as const,
  },
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Try DB lookup first
    let user = null;
    try {
      user = await db.user.findUnique({
        where: { email: cleanEmail },
      });
    } catch (e) {
      console.warn("DB user find error, checking demo credentials", e);
    }

    if (user) {
      const isMatch = await verifyPassword(password, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }

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
    }

    // 2. Fallback demo user check if DB is unseeded on serverless instance
    const demoUser = DEMO_USERS.find(
      (d) => d.email.toLowerCase() === cleanEmail && d.password === password
    );

    if (demoUser) {
      await setAuthCookie({
        userId: demoUser.id,
        email: demoUser.email,
        role: demoUser.role,
        firstName: demoUser.firstName,
        lastName: demoUser.lastName,
      });

      return NextResponse.json({
        success: true,
        user: {
          id: demoUser.id,
          email: demoUser.email,
          firstName: demoUser.firstName,
          lastName: demoUser.lastName,
          role: demoUser.role,
        },
      });
    }

    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  } catch (error: any) {
    console.error("[Login API Error]", error);
    return NextResponse.json({ error: "Authentication failed. Please try again." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await import("@/lib/auth").then((m) => m.getSession());
    if (!session) {
      return NextResponse.json({ user: null });
    }
    return NextResponse.json({ user: session });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
