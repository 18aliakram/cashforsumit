import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const conversations = await db.conversation.findMany({
      include: {
        submission: {
          include: {
            seller: {
              select: { id: true, firstName: true, lastName: true, email: true, phone: true },
            },
          },
        },
        messages: {
          include: {
            sender: { select: { id: true, firstName: true, role: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ conversations });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { id, label } = body;

    if (!id || !label) {
      return NextResponse.json({ error: "Conversation ID and label required" }, { status: 400 });
    }

    const updatedConv = await db.conversation.update({
      where: { id },
      data: { label },
      include: {
        submission: { include: { seller: true } },
      },
    });

    return NextResponse.json({ success: true, conversation: updatedConv });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update conversation label" }, { status: 500 });
  }
}
