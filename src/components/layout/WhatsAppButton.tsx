import { MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/brand";

export function WhatsAppButton() {
  const message = encodeURIComponent("Hello Bohoblockprinted, I would like to ask about your products, wholesale, or private label services.");
  return (
    <a
      href={`https://wa.me/${BRAND.whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Bohoblockprinted on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#1f8f55] px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[#187747] focus:outline-none focus:ring-2 focus:ring-[#1f8f55] focus:ring-offset-2 sm:bottom-7 sm:right-7"
    >
      <MessageCircle size={21} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
