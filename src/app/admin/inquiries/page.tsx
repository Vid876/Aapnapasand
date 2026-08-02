"use client";

import { useEffect, useState } from "react";
import { Mail, MessageCircle, Phone } from "lucide-react";

type Inquiry = {
  _id: string;
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
  status: "new" | "contacted" | "closed";
  createdAt: string;
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/inquiries", { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load inquiries");
        return data;
      })
      .then((data) => setInquiries(data.inquiries || []))
      .catch((fetchError) => {
        if (fetchError.name !== "AbortError") setError(fetchError.message);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const updateStatus = async (id: string, status: Inquiry["status"]) => {
    const response = await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (response.ok) {
      setInquiries((current) =>
        current.map((inquiry) =>
          inquiry._id === id ? { ...inquiry, status } : inquiry
        )
      );
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Wholesale Inquiries</h1>
        <p className="mt-1 text-sm text-gray-500">
          Customer details submitted through the wholesale inquiry form.
        </p>
      </div>

      {loading ? <p className="text-gray-500">Loading inquiries...</p> : null}
      {error ? <p className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p> : null}
      {!loading && !error && !inquiries.length ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
          No wholesale inquiries yet.
        </div>
      ) : null}

      <div className="grid gap-5">
        {inquiries.map((inquiry) => {
          const phone = inquiry.phone.replace(/\D/g, "");
          return (
            <article
              key={inquiry._id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                    {inquiry.service}
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-gray-900">
                    {inquiry.businessName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {inquiry.contactName} · {inquiry.country}
                  </p>
                </div>
                <select
                  value={inquiry.status}
                  onChange={(event) =>
                    updateStatus(
                      inquiry._id,
                      event.target.value as Inquiry["status"]
                    )
                  }
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm capitalize"
                  aria-label={`Status for ${inquiry.businessName}`}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={`mailto:${inquiry.email}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium"
                >
                  <Mail size={15} /> {inquiry.email}
                </a>
                <a
                  href={`tel:${inquiry.phone}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium"
                >
                  <Phone size={15} /> {inquiry.phone}
                </a>
                <a
                  href={`https://wa.me/${phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-800"
                >
                  <MessageCircle size={15} /> WhatsApp
                </a>
              </div>

              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
                <div>
                  <dt className="font-semibold text-gray-700">Product interest</dt>
                  <dd className="mt-1 text-gray-600">{inquiry.productInterest}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Quantity / MOQ</dt>
                  <dd className="mt-1 text-gray-600">
                    {inquiry.estimatedQuantity || "Not provided"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Submitted</dt>
                  <dd className="mt-1 text-gray-600">
                    {new Date(inquiry.createdAt).toLocaleString("en-IN")}
                  </dd>
                </div>
              </dl>

              <p className="mt-5 whitespace-pre-line rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                {inquiry.message}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
