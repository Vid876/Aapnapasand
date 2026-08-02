"use client";

import { useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";

const initialForm = {
  service: "Wholesale Orders",
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  country: "",
  website: "",
  productInterest: "",
  estimatedQuantity: "",
  message: "",
};

const inputClass =
  "mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#276070] focus:ring-2 focus:ring-[#276070]/20";

export function WholesaleInquiryForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to submit inquiry");
      setSuccess(data.message);
      setForm(initialForm);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit inquiry"
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto text-green-600" size={48} />
        <h3 className="mt-5 font-display text-2xl font-bold text-stone-950">
          Inquiry received
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-stone-600">
          {success}
        </p>
        <button
          type="button"
          onClick={() => setSuccess("")}
          className="mt-6 rounded-lg border border-[#173f4f] px-5 py-3 text-sm font-semibold text-[#173f4f]"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl bg-white p-5 shadow-sm sm:p-8"
      aria-labelledby="inquiry-form-heading"
    >
      <label className="mb-4 block text-sm font-medium text-stone-950">
        Inquiry service
        <select
          name="service"
          value={form.service}
          onChange={update}
          className={inputClass}
        >
          <option>Wholesale Orders</option>
          <option>Bulk Manufacturing</option>
          <option>Private Label Services</option>
          <option>Custom Labeling</option>
          <option>Custom Packaging</option>
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ["Business name", "businessName", "text"],
          ["Contact name", "contactName", "text"],
          ["Email address", "email", "email"],
          ["Mobile / WhatsApp", "phone", "tel"],
          ["Country", "country", "text"],
          ["Business website (optional)", "website", "text"],
          ["Product interest", "productInterest", "text"],
          ["Estimated quantity / MOQ", "estimatedQuantity", "text"],
        ].map(([label, name, type]) => (
          <label key={name} className="block text-sm font-medium text-stone-950">
            {label}
            <input
              required={!label.includes("optional") && name !== "estimatedQuantity"}
              type={type}
              name={name}
              value={form[name as keyof typeof form]}
              onChange={update}
              className={inputClass}
            />
          </label>
        ))}
      </div>

      <label className="mt-4 block text-sm font-medium text-stone-950">
        Custom sizing, private label, or catalog request
        <textarea
          required
          minLength={10}
          rows={6}
          name="message"
          value={form.message}
          onChange={update}
          className={inputClass}
        />
      </label>

      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#173f4f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#245d70] disabled:cursor-wait disabled:opacity-60"
      >
        <Mail size={16} />
        {loading ? "Sending inquiry..." : "Request Catalog"}
      </button>
    </form>
  );
}
