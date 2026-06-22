export default function ContactPage() {
  return (
    <div className="container-app py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-display font-bold mb-6">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Have a question? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
      </p>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea rows={5} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" required />
        </div>
        <button type="submit" className="px-6 py-3 bg-brand-900 text-white rounded-lg font-medium hover:bg-brand-800">
          Send Message
        </button>
      </form>
      <div className="mt-12 pt-8 border-t border-gray-100">
        <p className="text-gray-600"><strong>Email:</strong> support@aapnapasand.com</p>
        <p className="text-gray-600 mt-2"><strong>Phone:</strong> +91 98765 43210</p>
      </div>
    </div>
  );
}
