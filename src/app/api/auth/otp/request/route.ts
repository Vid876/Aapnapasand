import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { generateOtp, hashOtp, normalizeEmail, otpExpiry } from "@/lib/otp";
import { sendLoginOtpEmail } from "@/lib/email";
import { EmailOtp } from "@/models/EmailOtp";

const requestSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  name: z.string().trim().min(2).max(80).optional(),
  phone: z.string().trim().max(30).optional(),
});

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  return `${local.slice(0, 2)}${"*".repeat(Math.max(2, local.length - 2))}@${domain}`;
}

export async function POST(request: NextRequest) {
  try {
    const data = requestSchema.parse(await request.json());
    const email = normalizeEmail(data.email);
    const requestIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    await connectDB();
    const now = new Date();
    const cooldown = new Date(Date.now() - 60_000);
    const windowStart = new Date(Date.now() - 15 * 60_000);

    const [recent, emailRequests, ipRequests] = await Promise.all([
      EmailOtp.findOne({ email, createdAt: { $gte: cooldown } }).select("createdAt").lean(),
      EmailOtp.countDocuments({ email, createdAt: { $gte: windowStart } }),
      EmailOtp.countDocuments({ requestIp, createdAt: { $gte: windowStart } }),
    ]);

    if (recent) {
      const retryAfter = Math.max(
        1,
        60 - Math.floor((now.getTime() - new Date(recent.createdAt).getTime()) / 1000)
      );
      return NextResponse.json(
        { error: `Please wait ${retryAfter} seconds before requesting another code.` },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    if (emailRequests >= 5 || ipRequests >= 20) {
      return NextResponse.json(
        { error: "Too many verification requests. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    await EmailOtp.updateMany(
      { email, consumedAt: { $exists: false } },
      { $set: { consumedAt: now } }
    );

    const otp = generateOtp();
    const challenge = await EmailOtp.create({
      email,
      otpHash: hashOtp(email, otp),
      name: data.name,
      phone: data.phone,
      requestIp,
      expiresAt: otpExpiry(),
      purpose: "login",
    });

    const sent = await sendLoginOtpEmail({
      email,
      name: data.name,
      otp,
      expiresInMinutes: 10,
    });

    if (!sent) {
      await EmailOtp.deleteOne({ _id: challenge._id });
      return NextResponse.json(
        { error: "Verification email could not be sent. Please try again shortly." },
        { status: 503 }
      );
    }

    return NextResponse.json({
      message: "A secure verification code has been sent.",
      email: maskEmail(email),
      expiresInSeconds: 600,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("OTP request error:", error);
    return NextResponse.json({ error: "Unable to send verification code." }, { status: 500 });
  }
}
