import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { noStoreJson } from "@/lib/api-response";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().trim().optional(),
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

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
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
