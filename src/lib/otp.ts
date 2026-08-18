import { createHmac, randomInt, timingSafeEqual } from "crypto";
import { connectDB } from "@/lib/db";
import { EmailOtp } from "@/models/EmailOtp";
import { User } from "@/models/User";

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

export type OtpPurpose = "login" | "register" | "password-reset";

function otpSecret() {
  const secret = process.env.OTP_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("OTP_SECRET or NEXTAUTH_SECRET is required");
  return secret;
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function generateOtp() {
  return randomInt(100000, 1000000).toString();
}

export function hashOtp(email: string, otp: string) {
  return createHmac("sha256", otpSecret())
    .update(`${normalizeEmail(email)}:${otp}`)
    .digest("hex");
}

function safelyMatches(expectedHex: string, actualHex: string) {
  const expected = Buffer.from(expectedHex, "hex");
  const actual = Buffer.from(actualHex, "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function otpExpiry() {
  return new Date(Date.now() + OTP_TTL_MS);
}

export async function verifyOtpChallenge(
  emailValue: string,
  otp: string,
  purpose: OtpPurpose
) {
  await connectDB();
  const email = normalizeEmail(emailValue);
  const challenge = await EmailOtp.findOne({
    email,
    purpose,
    consumedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
    attempts: { $lt: OTP_MAX_ATTEMPTS },
  }).sort({ createdAt: -1 });

  if (!challenge) return null;

  const matches = safelyMatches(challenge.otpHash, hashOtp(email, otp));
  if (!matches) {
    challenge.attempts += 1;
    await challenge.save();
    return null;
  }

  const consumed = await EmailOtp.findOneAndUpdate(
    { _id: challenge._id, consumedAt: { $exists: false } },
    { $set: { consumedAt: new Date() } },
    { new: true }
  );
  return consumed;
}

export async function verifyLoginOtpAndGetUser(emailValue: string, otp: string) {
  const email = normalizeEmail(emailValue);
  const challenge = await verifyOtpChallenge(email, otp, "login");
  if (!challenge) return null;

  const user = await User.findOne({ email });
  if (!user || !user.isActive) return null;

  user.emailVerifiedAt ||= new Date();
  user.lastLoginAt = new Date();
  user.loginCount = (user.loginCount || 0) + 1;
  await user.save();

  return user;
}
