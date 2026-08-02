"use client";

import { useEffect } from "react";

export function InquiryHashFocus() {
  useEffect(() => {
    const focusInquiry = () => {
      if (window.location.hash !== "#inquiry-form") return;
      window.requestAnimationFrame(() => {
        document.getElementById("inquiry-form-heading")?.focus();
      });
    };

    focusInquiry();
    window.addEventListener("hashchange", focusInquiry);
    return () => window.removeEventListener("hashchange", focusInquiry);
  }, []);

  return null;
}
