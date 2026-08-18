import mongoose, { Document, Model, Schema } from "mongoose";

export interface IEmailOtp extends Document {
  email: string;
  otpHash: string;
  name?: string;
  phone?: string;
  purpose: "login" | "register" | "password-reset";
  requestIp?: string;
  attempts: number;
  expiresAt: Date;
  consumedAt?: Date;
  createdAt: Date;
}

const EmailOtpSchema = new Schema<IEmailOtp>(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    otpHash: { type: String, required: true },
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    purpose: {
      type: String,
      enum: ["login", "register", "password-reset"],
      required: true,
      index: true,
    },
    requestIp: { type: String },
    attempts: { type: Number, default: 0, min: 0 },
    expiresAt: { type: Date, required: true },
    consumedAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

EmailOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
EmailOtpSchema.index({ email: 1, createdAt: -1 });

export const EmailOtp: Model<IEmailOtp> =
  mongoose.models.EmailOtp || mongoose.model<IEmailOtp>("EmailOtp", EmailOtpSchema);
