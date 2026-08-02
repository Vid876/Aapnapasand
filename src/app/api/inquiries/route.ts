import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { BRAND } from "@/lib/brand";
import { connectDB } from "@/lib/db";
import { sendWholesaleInquiryEmails } from "@/lib/email";
import { sendSMS } from "@/lib/sms";
import { WholesaleInquiry } from "@/models/WholesaleInquiry";

const inquirySchema = z.object({
  service: z.string().trim().min(2).max(100),
  businessName: z.string().trim().min(2).max(150),
  contactName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().min(7).max(30),
  country: z.string().trim().min(2).max(100),
  website: z.string().trim().max(200).optional(),
  productInterest: z.string().trim().min(2).max(250),
  estimatedQuantity: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10).max(4000),
});

export async function POST(request: NextRequest) {
  try {
    const data = inquirySchema.parse(await request.json());
    await connectDB();
    const inquiry = await WholesaleInquiry.create(data);

    await Promise.allSettled([
      sendWholesaleInquiryEmails(data),
      sendSMS({
        phone: BRAND.phoneDisplay,
        message: `New wholesale inquiry from ${data.contactName}, ${data.businessName}. Phone: ${data.phone}. Check the BOHOBLOCKPRINTED admin panel.`,
      }),
      sendSMS({
        phone: data.phone,
        message:
          "BOHOBLOCKPRINTED received your wholesale inquiry. Our team will contact you shortly.",
      }),
    ]);

    return NextResponse.json(
      {
        message:
          "Thank you. Your inquiry has been saved and a confirmation has been sent.",
        inquiryId: String(inquiry._id),
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || "Please check the form details" },
        { status: 400 }
      );
    }
    console.error("Wholesale inquiry submit error:", error);
    return NextResponse.json(
      { error: "Unable to submit the inquiry. Please try again." },
      { status: 500 }
    );
  }
}
