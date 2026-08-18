import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: "customer" | "admin" | "vendor";
  addresses: IAddress[];
  wishlist: mongoose.Types.ObjectId[];
  isActive: boolean;
  emailVerifiedAt?: Date;
  lastLoginAt?: Date;
  loginCount: number;
  signupSource: "password" | "email-otp" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, select: false },
    phone: { type: String },
    role: {
      type: String,
      enum: ["customer", "admin", "vendor"],
      default: "customer",
    },
    addresses: [AddressSchema],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    isActive: { type: Boolean, default: true },
    emailVerifiedAt: { type: Date },
    lastLoginAt: { type: Date },
    loginCount: { type: Number, default: 0, min: 0 },
    signupSource: {
      type: String,
      enum: ["password", "email-otp", "admin"],
      default: "password",
    },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
