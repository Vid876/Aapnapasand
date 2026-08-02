import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    // Historical ratings remain intact for audit. Public submission policy is
    // enforced in the review API and only ratings from 3 to 5 are published.
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    comment: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, isApproved: 1 });

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
