import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { noStoreJson } from "@/lib/api-response";
import { connectDB } from "@/lib/db";
import { verifyOtpChallenge } from "@/lib/otp";
import { User } from "@/models/User";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
  otp: z
    .string({ required_error: "Email verification is required before registration." })
    .regex(/^\d{6}$/, "Enter the six-digit verification code"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    await connectDB();

    const existingUser = await User.exists({ email: data.email });
    if (existingUser) {
      return noStoreJson({ error: "Email already registered" }, { status: 400 });
    }

    const challenge = await verifyOtpChallenge(data.email, data.otp, "register");
    if (!challenge) {
      return noStoreJson(
        { error: "The verification code is incorrect or has expired." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await User.create({
      name: challenge.name?.trim() || data.email.split("@")[0],
      email: data.email,
      password: hashedPassword,
      phone: challenge.phone?.trim() || undefined,
      emailVerifiedAt: new Date(),
      signupSource: "password",
    });

    return noStoreJson(
      {
        message: "Account created successfully",
        user: { id: user._id, name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return noStoreJson({ error: error.errors[0].message }, { status: 400 });
    }
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      return noStoreJson({ error: "Email already registered" }, { status: 400 });
    }
    console.error("Registration error:", error);
    return noStoreJson({ error: "Registration failed" }, { status: 500 });
  }
}
