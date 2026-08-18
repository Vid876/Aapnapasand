import nodemailer from "nodemailer";
import { formatPrice } from "@/lib/utils";
import type { CurrencyCode } from "@/types";

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; quantity: number; size: string; color: string; price: number; currency?: CurrencyCode }[];
  total: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
  currency?: CurrencyCode;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] || character
  );
}

export type LoginOtpEmailData = {
  email: string;
  name?: string;
  otp: string;
  expiresInMinutes: number;
};

export async function sendLoginOtpEmail(data: LoginOtpEmailData): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.error("[Email] SMTP is not configured for login OTP delivery.");
    return false;
  }

  const from = process.env.FROM_EMAIL || process.env.SMTP_USER;
  if (!from) return false;
  const firstName = escapeHtml(data.name?.trim().split(/\s+/)[0] || "there");
  const digits = data.otp
    .split("")
    .map(
      (digit) =>
        `<span style="display:inline-block;width:42px;padding:11px 0;margin:0 3px;border:1px solid #d9c7a8;border-radius:10px;background:#fffdf8;color:#173f4f;font-family:Georgia,serif;font-size:27px;font-weight:700;text-align:center;box-shadow:0 5px 14px rgba(23,63,79,.08)">${digit}</span>`
    )
    .join("");

  const html = `<!doctype html>
  <html><body style="margin:0;padding:0;background:#eee9df;color:#2d2925;font-family:Arial,Helvetica,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eee9df;padding:28px 12px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;overflow:hidden;border:1px solid #d8cbb7;border-radius:22px;background:#fbfaf7;box-shadow:0 20px 55px rgba(40,29,19,.12)">
          <tr><td style="height:8px;background:linear-gradient(90deg,#173f4f,#b87811,#8f3b2f)"></td></tr>
          <tr><td align="center" style="padding:38px 34px 18px">
            <div style="font-size:12px;font-weight:700;letter-spacing:4px;color:#b87811">HANDMADE IN JAIPUR</div>
            <h1 style="margin:12px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:32px;line-height:1.2;color:#173f4f">BOHOBLOCKPRINTED</h1>
          </td></tr>
          <tr><td style="padding:6px 42px 36px;text-align:center">
            <h2 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;color:#241d18">Your secure sign-in code</h2>
            <p style="margin:16px auto 24px;max-width:460px;font-size:15px;line-height:1.7;color:#625950">Hello ${firstName}, use the code below to securely sign in to your BOHOBLOCKPRINTED account.</p>
            <div style="margin:0 auto 24px;white-space:nowrap">${digits}</div>
            <p style="margin:0;font-size:13px;line-height:1.7;color:#756b62">This code expires in <strong>${data.expiresInMinutes} minutes</strong> and can be used only once.</p>
            <div style="margin:28px 0 0;padding:17px;border-radius:14px;background:#eef4f0;color:#3e554c;font-size:13px;line-height:1.6">If you did not request this code, you can safely ignore this email. Never share this code with anyone.</div>
          </td></tr>
          <tr><td style="padding:20px 34px;background:#173f4f;text-align:center;color:#d9e4df;font-size:12px;line-height:1.6">Authentic hand block printed textiles from Jaipur, India<br><span style="color:#f1cc82">Worldwide shipping - Wholesale welcome</span></td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;

  try {
    await transporter.sendMail({
      from: `BOHOBLOCKPRINTED <${from}>`,
      to: data.email,
      subject: `${data.otp} is your BOHOBLOCKPRINTED sign-in code`,
      text: `Your BOHOBLOCKPRINTED sign-in code is ${data.otp}. It expires in ${data.expiresInMinutes} minutes. Do not share this code.`,
      html,
    });
    return true;
  } catch (error) {
    console.error("[Email] Failed to send login OTP:", error);
    return false;
  }
}

function buildOrderEmailHtml(data: OrderEmailData): string {
  const itemsHtml = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.size} / ${item.color}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${formatPrice(item.price * item.quantity, item.currency || data.currency)}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h1 style="color:#2f1912;">BOHOBLOCKPRINTED</h1>
      <h2>Order Confirmation</h2>
      <p>Hi ${data.customerName},</p>
      <p>Thank you for your order! We've received your order <strong>#${data.orderNumber}</strong>.</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <thead>
          <tr style="background:#f9f9f9;">
            <th style="padding:8px;text-align:left;">Item</th>
            <th style="padding:8px;text-align:left;">Variant</th>
            <th style="padding:8px;text-align:left;">Qty</th>
            <th style="padding:8px;text-align:left;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <p><strong>Subtotal:</strong> ${formatPrice(data.subtotal, data.currency)}</p>
      ${data.discount > 0 ? `<p><strong>Discount:</strong> -${formatPrice(data.discount, data.currency)}</p>` : ""}
      <p><strong>Shipping:</strong> ${data.shippingCost === 0 ? "FREE" : formatPrice(data.shippingCost, data.currency)}</p>
      <p><strong>Total:</strong> ${formatPrice(data.total, data.currency)}</p>
      <p><strong>Payment:</strong> ${data.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}</p>
      <hr style="margin:20px 0;border:none;border-top:1px solid #eee;" />
      <p><strong>Shipping to:</strong><br/>
        ${data.shippingAddress.fullName}<br/>
        ${data.shippingAddress.addressLine1}${data.shippingAddress.addressLine2 ? `, ${data.shippingAddress.addressLine2}` : ""}<br/>
        ${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.pincode}
      </p>
      <p style="color:#666;font-size:14px;">Questions? Reply to this email or contact support@bohoblockprinted.com</p>
    </div>
  `;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  const transporter = getTransporter();
  const from = process.env.FROM_EMAIL || "noreply@bohoblockprinted.com";

  if (!transporter) {
    console.log("[Email] SMTP not configured. Order confirmation for:", data.orderNumber);
    return false;
  }

  try {
    await transporter.sendMail({
      from: `BOHOBLOCKPRINTED <${from}>`,
      to: data.customerEmail,
      subject: `Order Confirmed - #${data.orderNumber}`,
      html: buildOrderEmailHtml(data),
    });
    return true;
  } catch (error) {
    console.error("[Email] Failed to send order confirmation:", error);
    return false;
  }
}

export async function sendOrderEmailFromOrder(
  order: {
    orderNumber: string;
    guestEmail?: string;
    items: { name: string; quantity: number; size: string; color: string; price: number; currency?: CurrencyCode }[];
    total: number;
    subtotal: number;
    shippingCost: number;
    discount: number;
    currency?: CurrencyCode;
    paymentMethod: string;
    shippingAddress: {
      fullName: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      pincode: string;
    };
  },
  userEmail?: string
): Promise<void> {
  const email = userEmail || order.guestEmail;
  if (!email) return;

  await sendOrderConfirmationEmail({
    orderNumber: order.orderNumber,
    customerName: order.shippingAddress.fullName,
    customerEmail: email,
    items: order.items,
    total: order.total,
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    discount: order.discount,
    currency: order.currency,
    paymentMethod: order.paymentMethod,
    shippingAddress: order.shippingAddress,
  });
}

export type WholesaleInquiryEmailData = {
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
};

export async function sendWholesaleInquiryEmails(
  data: WholesaleInquiryEmailData
): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.log("[Email] SMTP not configured. Wholesale inquiry from:", data.email);
    return false;
  }

  const from = process.env.FROM_EMAIL || "noreply@bohoblockprinted.com";
  const businessEmail =
    process.env.WHOLESALE_NOTIFICATION_EMAIL ||
    process.env.SMTP_USER ||
    "bohoblockprinted@gmail.com";
  const rows = [
    ["Service", data.service],
    ["Business", data.businessName],
    ["Contact", data.contactName],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Country", data.country],
    ["Website", data.website || "Not provided"],
    ["Product interest", data.productInterest],
    ["Estimated quantity", data.estimatedQuantity || "Not provided"],
  ]
    .map(
      ([label, value]) =>
        `<tr><th style="padding:8px;text-align:left;border-bottom:1px solid #eee;">${escapeHtml(label)}</th><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  try {
    await Promise.all([
      transporter.sendMail({
        from: `BOHOBLOCKPRINTED <${from}>`,
        to: businessEmail,
        replyTo: data.email,
        subject: `New wholesale inquiry — ${data.businessName}`,
        html: `<div style="font-family:sans-serif;max-width:680px;margin:auto"><h1>New wholesale inquiry</h1><table style="width:100%;border-collapse:collapse">${rows}</table><h2>Request</h2><p style="white-space:pre-line">${escapeHtml(data.message)}</p></div>`,
      }),
      transporter.sendMail({
        from: `BOHOBLOCKPRINTED <${from}>`,
        to: data.email,
        subject: "We received your wholesale inquiry",
        html: `<div style="font-family:sans-serif;max-width:600px;margin:auto"><h1>BOHOBLOCKPRINTED</h1><p>Hi ${escapeHtml(data.contactName)},</p><p>Thank you for contacting us about ${escapeHtml(data.service)}. Your inquiry has been saved and our team will review the product, quantity, sizing, and branding requirements.</p><p>We will reply to this email with the next steps.</p><p>Regards,<br/>BOHOBLOCKPRINTED</p></div>`,
      }),
    ]);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send wholesale inquiry email:", error);
    return false;
  }
}
