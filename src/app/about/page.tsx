export default function AboutPage() {
  return (
    <div className="container-app py-12 lg:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-display font-bold mb-6">About Aapnapasand</h1>
        <div className="prose prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
          <p className="text-lg">
            Aapnapasand is your destination for premium Indian fashion. We believe everyone deserves
            to express their unique style with quality clothing that fits perfectly and feels amazing.
          </p>
          <p>
            Founded with a vision to make fashion accessible across India, we curate collections for
            men and women that blend contemporary trends with timeless elegance. From casual everyday
            wear to elegant ethnic pieces, our range is designed for the modern Indian shopper.
          </p>
          <h2 className="text-2xl font-display font-bold text-gray-900 mt-8">Our Mission</h2>
          <p>
            To deliver a seamless shopping experience with high-quality products, honest pricing, and
            exceptional customer service. We are committed to sustainability, ethical sourcing, and
            supporting local artisans wherever possible.
          </p>
          <h2 className="text-2xl font-display font-bold text-gray-900 mt-8">Why Choose Us</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Premium quality fabrics and craftsmanship</li>
            <li>Free shipping on orders above ₹999</li>
            <li>7-day easy returns and exchanges</li>
            <li>Secure payments with multiple options</li>
            <li>Dedicated customer support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
