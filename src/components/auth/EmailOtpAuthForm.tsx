"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/Button";

type EmailOtpAuthFormProps = { mode: "login" | "register" };

export function EmailOtpAuthForm({ mode }: EmailOtpAuthFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "code">("details");
  const [form, setForm] = useState({ name: "", email: "", phone: "", otp: "" });
  const [maskedEmail, setMaskedEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  async function requestCode() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          name: mode === "register" ? form.name : undefined,
          phone: mode === "register" ? form.phone : undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to send verification code");
      setMaskedEmail(data.email || form.email);
      setStep("code");
      setCooldown(60);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to send verification code");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (step === "details") {
      await requestCode();
      return;
    }

    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email: form.email, otp: form.otp, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("The code is incorrect or has expired. Request a new code and try again.");
      return;
    }

    const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
    router.replace(callbackUrl?.startsWith("/") ? callbackUrl : "/account");
    router.refresh();
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#dfd3c0] bg-[#fbfaf7] shadow-[0_25px_75px_rgba(23,63,79,0.14)]">
      <div className="h-1.5 bg-gradient-to-r from-[#173f4f] via-[#c38a2c] to-[#8c3b30]" />
      <div className="p-7 sm:p-9">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173f4f] text-white shadow-lg shadow-[#173f4f]/15">
          {step === "details" ? <Mail size={21} /> : <KeyRound size={21} />}
        </div>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-[#b87811]">Secure customer access</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-stone-950">
          {mode === "register" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-3 text-sm leading-7 text-stone-600">
          {step === "details"
            ? "We will email a one-time security code. No customer password is required."
            : `Enter the six-digit code sent to ${maskedEmail}.`}
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">{error}</div> : null}

          {step === "details" ? (
            <>
              {mode === "register" ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-stone-800">Full name</span>
                  <span className="relative block">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="min-h-13 w-full rounded-xl border border-stone-300 bg-white px-11 py-3 text-sm outline-none transition focus:border-[#173f4f] focus:ring-4 focus:ring-[#173f4f]/10" autoComplete="name" required minLength={2} />
                  </span>
                </label>
              ) : null}

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-stone-800">Email address</span>
                <span className="relative block">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="min-h-13 w-full rounded-xl border border-stone-300 bg-white px-11 py-3 text-sm outline-none transition focus:border-[#173f4f] focus:ring-4 focus:ring-[#173f4f]/10" autoComplete="email" required />
                </span>
              </label>

              {mode === "register" ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-stone-800">Phone number <span className="font-normal text-stone-400">(optional)</span></span>
                  <span className="relative block">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <input type="tel" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="min-h-13 w-full rounded-xl border border-stone-300 bg-white px-11 py-3 text-sm outline-none transition focus:border-[#173f4f] focus:ring-4 focus:ring-[#173f4f]/10" autoComplete="tel" />
                  </span>
                </label>
              ) : null}
            </>
          ) : (
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-stone-800">Verification code</span>
              <input value={form.otp} onChange={(event) => setForm((current) => ({ ...current, otp: event.target.value.replace(/\D/g, "").slice(0, 6) }))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" placeholder="000000" className="min-h-16 w-full rounded-xl border border-stone-300 bg-white px-5 text-center font-display text-3xl font-bold tracking-[0.35em] text-[#173f4f] outline-none transition focus:border-[#b87811] focus:ring-4 focus:ring-[#b87811]/10" required />
            </label>
          )}

          <Button type="submit" size="lg" className="w-full rounded-xl" isLoading={loading}>
            {step === "details" ? "Email me a secure code" : "Verify and continue"}
          </Button>

          {step === "code" ? (
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <button type="button" onClick={() => { setStep("details"); setForm((current) => ({ ...current, otp: "" })); setError(""); }} className="inline-flex items-center gap-1.5 font-semibold text-[#173f4f]"><ArrowLeft size={15} /> Change email</button>
              <button type="button" disabled={cooldown > 0 || loading} onClick={requestCode} className="font-semibold text-[#9a620b] disabled:cursor-not-allowed disabled:text-stone-400">{cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}</button>
            </div>
          ) : null}
        </form>

        <div className="mt-7 flex items-start gap-3 rounded-xl bg-[#eef4f0] p-4 text-xs leading-6 text-[#365246]">
          <ShieldCheck className="mt-0.5 shrink-0 text-[#276070]" size={18} />
          The code expires in 10 minutes and works once. BOHOBLOCKPRINTED will never ask you to share it.
        </div>
        <p className="mt-7 text-center text-sm text-stone-500">
          {mode === "register" ? "Already have an account?" : "New to BOHOBLOCKPRINTED?"}{" "}
          <Link href={mode === "register" ? "/login" : "/register"} className="font-semibold text-[#173f4f] hover:text-[#b87811]">
            {mode === "register" ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </div>
    </div>
  );
}
