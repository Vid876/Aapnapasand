import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import {
  generateOtp,
  hashOtp,
  normalizeEmail,
  otpExpiry,
  type OtpPurpose,
} from "@/lib/otp";
import { sendAuthOtpEmail } from "@/lib/email";
import { EmailOtp } from "@/models/EmailOtp";
import { User } from "@/models/User";

const requestSchema = z
  .object({
    email: z.string().trim().toLowerCase().email(),
    purpose: z.enum(["login", "register", "password-reset"]),
    name: z.string().trim().min(2).max(80).optional(),
    phone: z.string().trim().max(30).optional(),
  })
  .superRefine((data, context) => {
    if (data.purpose === "register" && !data.name) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["name"],
        message: "Full name is required to create an account.",
      });
    }
  });

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  return `${local.slice(0, 2)}${"*".repeat(Math.max(2, local.length - 2))}@${domain}`;
}

function successResponse(email: string) {
  return NextResponse.json({
    message: "If this email can be used for the requested action, a secure code has been sent.",
    email: maskEmail(email),
    expiresInSeconds: 600,
  });
}

async function smallEnumerationDelay() {
  await new Promise((resolve) => setTimeout(resolve, 250));
}

export async function POST(request: NextRequest) {
  try {
    const data = requestSchema.parse(await request.json());
    const email = normalizeEmail(data.email);
    const purpose = data.purpose as OtpPurpose;
    const requestIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    await connectDB();
    const now = new Date();
    const cooldown = new Date(Date.now() - 60_000);
    const windowStart = new Date(Date.now() - 15 * 60_000);

    const [recent, emailRequests, ipRequests, user] = await Promise.all([
      EmailOtp.findOne({ email, createdAt: { $gte: cooldown } }).select("createdAt").lean(),
      EmailOtp.countDocuments({ email, createdAt: { $gte: windowStart } }),
      EmailOtp.countDocuments({ requestIp, createdAt: { $gte: windowStart } }),
      User.findOne({ email }).select("name email isActive").lean(),
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

    if (purpose === "register" && user) {
      return NextResponse.json(
        { error: "An account already exists for this email. Please sign in instead." },
        { status: 409 }
      );
    }

    if (purpose !== "register" && (!user || !user.isActive)) {
      await EmailOtp.updateMany(
        { email, purpose, consumedAt: { $exists: false } },
        { $set: { consumedAt: now } }
      );
      const decoyOtp = generateOtp();
      await EmailOtp.create({
        email,
        otpHash: hashOtp(email, decoyOtp),
        requestIp,
        expiresAt: otpExpiry(),
        purpose,
      });
      await smallEnumerationDelay();
      return successResponse(email);
    }

    await EmailOtp.updateMany(
      { email, purpose, consumedAt: { $exists: false } },
      { $set: { consumedAt: now } }
    );

    const otp = generateOtp();
    const challenge = await EmailOtp.create({
      email,
      otpHash: hashOtp(email, otp),
      name: purpose === "register" ? data.name : user?.name,
      phone: purpose === "register" ? data.phone : undefined,
      requestIp,
      expiresAt: otpExpiry(),
      purpose,
    });

    const sent = await sendAuthOtpEmail({
      email,
      name: purpose === "register" ? data.name : user?.name,
      otp,
      expiresInMinutes: 10,
      purpose,
    });

    if (!sent) {
      await EmailOtp.deleteOne({ _id: challenge._id });
      return NextResponse.json(
        {
          error:
            "Verification email is temporarily unavailable. The site owner must configure a valid email App Password.",
        },
        { status: 503 }
      );
    }

    return successResponse(email);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("OTP request error:", error);
    return NextResponse.json({ error: "Unable to send verification code." }, { status: 500 });
  }
}
