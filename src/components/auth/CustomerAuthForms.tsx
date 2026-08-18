"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

type OtpPurpose = "login" | "register" | "password-reset";

function useCooldown() {
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(
      () => setCooldown((value) => Math.max(0, value - 1)),
      1000
    );
    return () => window.clearInterval(timer);
  }, [cooldown]);

  return { cooldown, startCooldown: () => setCooldown(60) };
}

async function requestOtp(payload: {
  email: string;
  purpose: OtpPurpose;
  name?: string;
  phone?: string;
}) {
  const response = await fetch("/api/auth/otp/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Unable to send verification code");
  return data as { email?: string };
}

function AuthCard({
  icon,
  eyebrow,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#dfd3c0] bg-[#fbfaf7] shadow-[0_25px_75px_rgba(23,63,79,0.14)]">
      <div className="h-1.5 bg-gradient-to-r from-[#173f4f] via-[#c38a2c] to-[#8c3b30]" />
      <div className="p-7 sm:p-9">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173f4f] text-white shadow-lg shadow-[#173f4f]/15">
          {icon}
        </div>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-[#b87811]">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-stone-950">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-stone-600">{description}</p>
        {children}
      </div>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
      {message}
    </div>
  );
}

function OtpInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-800">Verification code</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 6))}
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]{6}"
        placeholder="000000"
        className="min-h-16 w-full rounded-xl border border-stone-300 bg-white px-5 text-center font-display text-3xl font-bold tracking-[0.35em] text-[#173f4f] outline-none transition focus:border-[#b87811] focus:ring-4 focus:ring-[#b87811]/10"
        required
      />
    </label>
  );
}

function SecurityNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-7 flex items-start gap-3 rounded-xl bg-[#eef4f0] p-4 text-xs leading-6 text-[#365246]">
      <ShieldCheck className="mt-0.5 shrink-0 text-[#276070]" size={18} />
      <span>{children}</span>
    </div>
  );
}

function callbackPath(fallback = "/account") {
  const value = new URLSearchParams(window.location.search).get("callbackUrl");
  return value?.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

export function LoginForm() {
  const router = useRouter();
  const { cooldown, startCooldown } = useCooldown();
  const [method, setMethod] = useState<"password" | "otp">("password");
  const [otpStep, setOtpStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendLoginCode() {
    setLoading(true);
    setError("");
    try {
      const data = await requestOtp({ email, purpose: "login" });
      setMaskedEmail(data.email || email);
      setOtpStep("code");
      startCooldown();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to send code");
    } finally {
      setLoading(false);
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (method === "otp" && otpStep === "email") {
      await sendLoginCode();
      return;
    }

    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email,
      ...(method === "password" ? { password } : { otp }),
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      setError(
        method === "password"
          ? "Email or password is incorrect."
          : "The verification code is incorrect or has expired."
      );
      return;
    }

    router.replace(callbackPath());
    router.refresh();
  }

  return (
    <AuthCard
      icon={method === "password" ? <Lock size={21} /> : <KeyRound size={21} />}
      eyebrow="Secure customer access"
      title="Welcome back"
      description={
        method === "password"
          ? "Sign in with your verified email and password."
          : otpStep === "email"
            ? "We will email a one-time code to your registered address."
            : `Enter the six-digit code sent to ${maskedEmail}.`
      }
    >
      <div className="mt-7 grid grid-cols-2 rounded-xl bg-stone-100 p-1 text-sm font-semibold">
        <button
          type="button"
          onClick={() => { setMethod("password"); setError(""); }}
          className={`rounded-lg px-3 py-2.5 transition ${method === "password" ? "bg-white text-[#173f4f] shadow-sm" : "text-stone-500"}`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => { setMethod("otp"); setError(""); }}
          className={`rounded-lg px-3 py-2.5 transition ${method === "otp" ? "bg-white text-[#173f4f] shadow-sm" : "text-stone-500"}`}
        >
          Email code
        </button>
      </div>

      <form onSubmit={submit} className="mt-5 space-y-4">
        <ErrorMessage message={error} />
        {method === "otp" && otpStep === "code" ? (
          <OtpInput value={otp} onChange={setOtp} />
        ) : (
          <>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-stone-800">Email address</span>
              <span className="relative block">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="min-h-13 w-full rounded-xl border border-stone-300 bg-white px-11 py-3 text-sm outline-none transition focus:border-[#173f4f] focus:ring-4 focus:ring-[#173f4f]/10" autoComplete="email" required />
              </span>
            </label>
            {method === "password" ? (
              <label className="block">
                <span className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-stone-800">
                  Password
                  <Link href="/forgot-password" className="text-xs text-[#9a620b] hover:underline">Forgot password?</Link>
                </span>
                <span className="relative block">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="min-h-13 w-full rounded-xl border border-stone-300 bg-white px-11 py-3 text-sm outline-none transition focus:border-[#173f4f] focus:ring-4 focus:ring-[#173f4f]/10" autoComplete="current-password" required minLength={8} />
                </span>
              </label>
            ) : null}
          </>
        )}

        <Button type="submit" size="lg" className="w-full rounded-xl" isLoading={loading}>
          {method === "password" ? "Sign in" : otpStep === "email" ? "Email me a secure code" : "Verify and sign in"}
        </Button>

        {method === "otp" && otpStep === "code" ? (
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <button type="button" onClick={() => { setOtpStep("email"); setOtp(""); setError(""); }} className="inline-flex items-center gap-1.5 font-semibold text-[#173f4f]"><ArrowLeft size={15} /> Change email</button>
            <button type="button" disabled={cooldown > 0 || loading} onClick={sendLoginCode} className="font-semibold text-[#9a620b] disabled:cursor-not-allowed disabled:text-stone-400">{cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}</button>
          </div>
        ) : null}
      </form>

      <SecurityNotice>OTP codes expire in 10 minutes and work only once. Never share a code with anyone.</SecurityNotice>
      <p className="mt-7 text-center text-sm text-stone-500">New to BOHOBLOCKPRINTED? <Link href="/register" className="font-semibold text-[#173f4f] hover:text-[#b87811]">Create a verified account</Link></p>
    </AuthCard>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const { cooldown, startCooldown } = useCooldown();
  const [step, setStep] = useState<"details" | "code">("details");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", otp: "" });
  const [maskedEmail, setMaskedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function validatePasswords() {
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return "";
  }

  async function sendRegistrationCode() {
    const passwordError = validatePasswords();
    if (passwordError) { setError(passwordError); return; }
    setLoading(true);
    setError("");
    try {
      const data = await requestOtp({ email: form.email, purpose: "register", name: form.name, phone: form.phone || undefined });
      setMaskedEmail(data.email || form.email);
      setStep("code");
      startCooldown();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to send code");
    } finally {
      setLoading(false);
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (step === "details") { await sendRegistrationCode(); return; }
    const passwordError = validatePasswords();
    if (passwordError) { setError(passwordError); return; }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password, otp: form.otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to create account");

      const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (result?.error) { router.replace("/login?registered=1"); return; }
      router.replace(callbackPath());
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      icon={step === "details" ? <User size={21} /> : <KeyRound size={21} />}
      eyebrow="Verified customer account"
      title={step === "details" ? "Create your account" : "Verify your email"}
      description={step === "details" ? "Your account is created only after the email code is verified." : `Enter the six-digit code sent to ${maskedEmail}.`}
    >
      <form onSubmit={submit} className="mt-7 space-y-4">
        <ErrorMessage message={error} />
        {step === "details" ? (
          <>
            <Field icon={<User size={18} />} label="Full name"><input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="auth-input" autoComplete="name" required minLength={2} /></Field>
            <Field icon={<Mail size={18} />} label="Email address"><input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="auth-input" autoComplete="email" required /></Field>
            <Field icon={<Phone size={18} />} label="Phone number (optional)"><input type="tel" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="auth-input" autoComplete="tel" /></Field>
            <Field icon={<Lock size={18} />} label="Password"><input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} className="auth-input" autoComplete="new-password" required minLength={8} /></Field>
            <Field icon={<Lock size={18} />} label="Confirm password"><input type="password" value={form.confirmPassword} onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))} className="auth-input" autoComplete="new-password" required minLength={8} /></Field>
          </>
        ) : <OtpInput value={form.otp} onChange={(otp) => setForm((current) => ({ ...current, otp }))} />}

        <Button type="submit" size="lg" className="w-full rounded-xl" isLoading={loading}>{step === "details" ? "Send verification code" : "Verify and create account"}</Button>
        {step === "code" ? (
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <button type="button" onClick={() => { setStep("details"); setForm((current) => ({ ...current, otp: "" })); setError(""); }} className="inline-flex items-center gap-1.5 font-semibold text-[#173f4f]"><ArrowLeft size={15} /> Edit details</button>
            <button type="button" disabled={cooldown > 0 || loading} onClick={sendRegistrationCode} className="font-semibold text-[#9a620b] disabled:cursor-not-allowed disabled:text-stone-400">{cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}</button>
          </div>
        ) : null}
      </form>
      <SecurityNotice>No account is saved until the correct email code is submitted. Passwords are securely hashed.</SecurityNotice>
      <p className="mt-7 text-center text-sm text-stone-500">Already verified? <Link href="/login" className="font-semibold text-[#173f4f] hover:text-[#b87811]">Sign in</Link></p>
    </AuthCard>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-800">{label}</span>
      <span className="relative block [&_.auth-input]:min-h-13 [&_.auth-input]:w-full [&_.auth-input]:rounded-xl [&_.auth-input]:border [&_.auth-input]:border-stone-300 [&_.auth-input]:bg-white [&_.auth-input]:px-11 [&_.auth-input]:py-3 [&_.auth-input]:text-sm [&_.auth-input]:outline-none [&_.auth-input]:transition focus-within:[&_.auth-input]:border-[#173f4f] focus-within:[&_.auth-input]:ring-4 focus-within:[&_.auth-input]:ring-[#173f4f]/10">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">{icon}</span>
        {children}
      </span>
    </label>
  );
}

export function PasswordResetForm() {
  const router = useRouter();
  const { cooldown, startCooldown } = useCooldown();
  const [step, setStep] = useState<"email" | "reset" | "success">("email");
  const [form, setForm] = useState({ email: "", otp: "", password: "", confirmPassword: "" });
  const [maskedEmail, setMaskedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendResetCode() {
    setLoading(true);
    setError("");
    try {
      const data = await requestOtp({ email: form.email, purpose: "password-reset" });
      setMaskedEmail(data.email || form.email);
      setStep("reset");
      startCooldown();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to send code");
    } finally {
      setLoading(false);
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (step === "email") { await sendResetCode(); return; }
    if (step === "success") { router.push("/login"); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp: form.otp, password: form.password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to reset password");
      setStep("success");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      icon={step === "success" ? <CheckCircle2 size={22} /> : step === "email" ? <Mail size={21} /> : <KeyRound size={21} />}
      eyebrow="Secure password recovery"
      title={step === "success" ? "Password updated" : "Reset your password"}
      description={step === "email" ? "Enter your registered email and we will send a one-time verification code." : step === "reset" ? `Enter the code sent to ${maskedEmail}, then choose a new password.` : "Your new password is ready. You can now sign in securely."}
    >
      <form onSubmit={submit} className="mt-7 space-y-4">
        <ErrorMessage message={error} />
        {step === "email" ? (
          <Field icon={<Mail size={18} />} label="Registered email"><input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="auth-input" autoComplete="email" required /></Field>
        ) : step === "reset" ? (
          <>
            <OtpInput value={form.otp} onChange={(otp) => setForm((current) => ({ ...current, otp }))} />
            <Field icon={<Lock size={18} />} label="New password"><input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} className="auth-input" autoComplete="new-password" required minLength={8} /></Field>
            <Field icon={<Lock size={18} />} label="Confirm new password"><input type="password" value={form.confirmPassword} onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))} className="auth-input" autoComplete="new-password" required minLength={8} /></Field>
          </>
        ) : null}

        <Button type="submit" size="lg" className="w-full rounded-xl" isLoading={loading}>{step === "email" ? "Send reset code" : step === "reset" ? "Verify and update password" : "Return to sign in"}</Button>
        {step === "reset" ? (
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <button type="button" onClick={() => { setStep("email"); setForm((current) => ({ ...current, otp: "", password: "", confirmPassword: "" })); setError(""); }} className="inline-flex items-center gap-1.5 font-semibold text-[#173f4f]"><ArrowLeft size={15} /> Change email</button>
            <button type="button" disabled={cooldown > 0 || loading} onClick={sendResetCode} className="font-semibold text-[#9a620b] disabled:cursor-not-allowed disabled:text-stone-400">{cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}</button>
          </div>
        ) : null}
      </form>
      <SecurityNotice>The reset code is single-use and expires in 10 minutes. A password cannot be changed without it.</SecurityNotice>
      <p className="mt-7 text-center text-sm text-stone-500"><Link href="/login" className="font-semibold text-[#173f4f] hover:text-[#b87811]">Back to sign in</Link></p>
    </AuthCard>
  );
}
