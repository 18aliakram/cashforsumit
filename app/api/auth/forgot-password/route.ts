import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail, buildNotificationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      // Return success to avoid email enumeration
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a password reset link has been dispatched.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request - Cash for Houses Summit",
      html: buildNotificationEmail({
        title: "Password Reset Request",
        body: `Hello ${user.firstName},<br/><br/>We received a request to reset the password for your Cash for Houses Summit account.<br/><br/>Click the link below to set a new password. This reset link expires in 1 hour.<br/><br/><code style="background-color:#F1F5F9; padding:6px 12px; border-radius:4px; font-size:12px;">Reset Link: ${resetUrl}</code>`,
        ctaText: "Reset My Password",
        ctaUrl: resetUrl,
      }),
    });

    return NextResponse.json({
      success: true,
      message: "Password reset link sent! Check your inbox (or dev log simulation).",
      resetUrl, // Provided in development response for instant testing
    });
  } catch (error: any) {
    console.error("[Forgot Password Error]", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
