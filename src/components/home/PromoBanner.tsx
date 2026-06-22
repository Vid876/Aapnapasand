import Link from "next/link";
import Image from "next/image";

export function PromoBanner() {
  return (
    <section className="py-8">
      <div className="container-app">
        <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
          <Link
            href="/shop?gender=men"
            className="group relative h-64 lg:h-80 overflow-hidden rounded-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80"
              alt="Men's collection"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <p className="text-sm uppercase tracking-widest mb-2">Collection</p>
              <h3 className="text-3xl font-display font-bold">Men&apos;s Wear</h3>
              <span className="mt-4 text-sm underline underline-offset-4">Shop Now</span>
            </div>
          </Link>

          <Link
            href="/shop?gender=women"
            className="group relative h-64 lg:h-80 overflow-hidden rounded-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
              alt="Women's collection"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <p className="text-sm uppercase tracking-widest mb-2">Collection</p>
              <h3 className="text-3xl font-display font-bold">Women&apos;s Wear</h3>
              <span className="mt-4 text-sm underline underline-offset-4">Shop Now</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
