const FAQS = [
  {
    q: "What is your return policy?",
    a: "We offer a 7-day easy return policy. Items must be unused, with tags attached, in original packaging.",
  },
  {
    q: "How long does shipping take?",
    a: "Standard delivery takes 3-7 business days. Express delivery (1-3 days) is available in select cities.",
  },
  {
    q: "Do you offer free shipping?",
    a: "Yes! Free shipping on all orders above ₹999.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Cash on Delivery, UPI, credit/debit cards, and net banking.",
  },
  {
    q: "How do I track my order?",
    a: "Once shipped, you'll receive a tracking link via email and SMS. You can also check order status in your account.",
  },
];

export default function FAQPage() {
  return (
    <div className="container-app py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-display font-bold mb-8">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {FAQS.map((faq) => (
          <div key={faq.q} className="border-b border-gray-100 pb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
