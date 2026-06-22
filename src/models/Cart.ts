import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

export interface ICart extends Document {
  user?: mongoose.Types.ObjectId;
  sessionId?: string;
  items: ICartItem[];
  couponCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    size: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: true }
);

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    sessionId: { type: String },
    items: [CartItemSchema],
    couponCode: { type: String },
  },
  { timestamps: true }
);

CartSchema.index({ user: 1 });
CartSchema.index({ sessionId: 1 });

export const Cart: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
