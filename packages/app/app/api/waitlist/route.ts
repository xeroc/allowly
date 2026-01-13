import { NextRequest, NextResponse } from "next/server";

const emailStore: string[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (emailStore.includes(normalizedEmail)) {
      return NextResponse.json(
        { error: "This email is already on the waitlist" },
        { status: 409 },
      );
    }

    emailStore.push(normalizedEmail);

    console.log(`[Waitlist] New signup: ${normalizedEmail}`);
    console.log(`[Waitlist] Total signups: ${emailStore.length}`);

    return NextResponse.json(
      { message: "Successfully joined the waitlist" },
      { status: 201 },
    );
  } catch (error) {
    console.error("[Waitlist] Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    count: emailStore.length,
    message: "This endpoint accepts POST requests to join the waitlist",
  });
}
