import Image from "next/image";
import Link from "next/link";

export function LuxuryFestiveBanner() {
  return (
    <section className="w-full py-10 lg:py-14">
      <Link
        href="/collections"
        aria-label="Go to collections"
        className="block w-full overflow-hidden"
      >
        <Image
          src="/festive-luxury-banner.png"
          alt="Festive luxury banner"
          width={2172}
          height={724}
          sizes="100vw"
          className="h-auto w-full object-contain"
          priority={false}
        />
      </Link>
    </section>
  );
}