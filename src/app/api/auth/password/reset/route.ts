import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { noStoreJson } from "@/lib/api-response";
import { connectDB } from "@/lib/db";
import { normalizeEmail, verifyOtpChallenge } from "@/lib/otp";
import { EmailOtp } from "@/models/EmailOtp";
import { User } from "@/models/User";

const resetSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  otp: z.string().regex(/^\d{6}$/, "Enter the six-digit verification code"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
});

export async function POST(request: NextRequest) {
  try {
    const data = resetSchema.parse(await request.json());
    const email = normalizeEmail(data.email);
    await connectDB();

    const challenge = await verifyOtpChallenge(email, data.otp, "password-reset");
    if (!challenge) {
      return noStoreJson(
        { error: "The verification code is incorrect or has expired." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await User.findOneAndUpdate(
      { email, isActive: true },
      {
        $set: {
          password: hashedPassword,
          emailVerifiedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!user) {
      return noStoreJson(
        { error: "This password reset request is no longer valid." },
        { status: 400 }
      );
    }

    await EmailOtp.updateMany(
      {
        email,
        purpose: "password-reset",
        consumedAt: { $exists: false },
      },
      { $set: { consumedAt: new Date() } }
    );

    return noStoreJson({ message: "Password updated successfully." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return noStoreJson({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Password reset error:", error);
    return noStoreJson({ error: "Unable to reset password." }, { status: 500 });
  }
}
