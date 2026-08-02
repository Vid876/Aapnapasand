import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { connectDB } from "@/lib/db";
import { WholesaleInquiry } from "@/models/WholesaleInquiry";

const updateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["new", "contacted", "closed"]),
});

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const inquiries = await WholesaleInquiry.find()
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();
    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("Admin inquiries fetch error:", error);
    return NextResponse.json(
      { error: "Unable to load inquiries" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const data = updateSchema.parse(await request.json());
    await connectDB();
    const inquiry = await WholesaleInquiry.findByIdAndUpdate(
      data.id,
      { status: data.status },
      { new: true }
    ).lean();
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }
    return NextResponse.json({ inquiry });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Admin inquiry update error:", error);
    return NextResponse.json(
      { error: "Unable to update inquiry" },
      { status: 500 }
    );
  }
}
