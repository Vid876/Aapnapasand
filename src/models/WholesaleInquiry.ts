import mongoose, { Document, Model, Schema } from "mongoose";

export type WholesaleInquiryStatus = "new" | "contacted" | "closed";

export interface IWholesaleInquiry extends Document {
  service: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  website?: string;
  productInterest: string;
  estimatedQuantity?: string;
  message: string;
  status: WholesaleInquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

const WholesaleInquirySchema = new Schema<IWholesaleInquiry>(
  {
    service: { type: String, required: true, trim: true },
    businessName: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    website: { type: String, trim: true },
    productInterest: { type: String, required: true, trim: true },
    estimatedQuantity: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true }
);

WholesaleInquirySchema.index({ createdAt: -1 });
WholesaleInquirySchema.index({ email: 1, createdAt: -1 });

export const WholesaleInquiry: Model<IWholesaleInquiry> =
  mongoose.models.WholesaleInquiry ||
  mongoose.model<IWholesaleInquiry>(
    "WholesaleInquiry",
    WholesaleInquirySchema
  );
