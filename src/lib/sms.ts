interface SMSOptions {
  phone: string;
  message: string;
}

export function isSMSConfigured(): boolean {
  return Boolean(process.env.MSG91_AUTH_KEY || (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN));
}

export async function sendSMS({ phone, message }: SMSOptions): Promise<boolean> {
  const cleanPhone = phone.replace(/\D/g, "");
  const indianPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;

  if (process.env.MSG91_AUTH_KEY && process.env.MSG91_TEMPLATE_ID) {
    try {
      const res = await fetch("https://control.msg91.com/api/v5/flow/", {
        method: "POST",
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template_id: process.env.MSG91_TEMPLATE_ID,
          recipients: [{ mobiles: indianPhone, var: message }],
        }),
      });
      return res.ok;
    } catch (error) {
      console.error("[SMS] MSG91 error:", error);
      return false;
    }
  }

  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const auth = Buffer.from(
        `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
      ).toString("base64");

      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: `+${indianPhone}`,
            From: process.env.TWILIO_PHONE_NUMBER,
            Body: message,
          }),
        }
      );
      return res.ok;
    } catch (error) {
      console.error("[SMS] Twilio error:", error);
      return false;
    }
  }

  console.log(`[SMS] Not configured. Would send to ${phone}: ${message}`);
  return false;
}

export async function sendOrderShippedSMS(
  phone: string,
  orderNumber: string,
  trackingNumber: string
): Promise<void> {
  await sendSMS({
    phone,
    message: `Your Aapnapasand order #${orderNumber} has been shipped! Track: ${trackingNumber}`,
  });
}

export async function sendOrderConfirmedSMS(phone: string, orderNumber: string): Promise<void> {
  await sendSMS({
    phone,
    message: `Order #${orderNumber} confirmed at Aapnapasand. We'll notify you when it ships.`,
  });
}
