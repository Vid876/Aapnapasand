import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Globe2, Handshake, Instagram, Quote, Sparkles } from "lucide-react";
import { BRAND, INSTAGRAM_POSTS, PROCESS_STEPS, TESTIMONIALS, WHY_CHOOSE } from "@/lib/brand";
import { SectionHeader } from "@/components/marketing/PublicPage";

const wholesaleCards = [
  { title: "MOQ", text: "Minimum order quantity is confirmed by product type, print complexity, and sampling needs." },
  { title: "Production capacity", text: "Capacity is shared after the product mix, sizes, fabric, and timeline are reviewed." },
  { title: "Lead time", text: "Lead time is quoted before order confirmation and depends on sampling, printing, stitching, and packing." },
  { title: "Custom printing", text: "Discuss print direction, colorways, fabric base, and repeat scale before production." },
  { title: "Private label", text: "Private label, packaging, and buyer documentation can be reviewed for wholesale orders." },
  { title: "Custom sizes", text: "Custom sizing is handled through measurement specs, approved samples, and written confirmation." },
] as const;

export function WhyChooseSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container-app">
        <SectionHeader
          align="center"
          title="Why Choose Bohoblockprinted"
          description="A permanent trust strip for handmade origin, textile quality, shipping confidence, and custom order readiness."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE.map((item, index) => (
            <div
              key={item}
              className="rounded-lg border border-stone-200 bg-[#fbfaf7] p-6 shadow-sm"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-[#173f4f] text-white">
                <BadgeCheck size={20} />
              </div>
              <h3 className="text-lg font-semibold text-stone-950">{item}</h3>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                {index === 0 && "Textiles are positioned around Jaipur craft rather than generic fashion."}
                {index === 1 && "Hand printing gives each piece a human surface and an artisan story."}
                {index === 2 && "Cotton and linen fabrics support breathable home and wardrobe use."}
                {index === 3 && "The store now speaks to international buyers as well as Indian customers."}
                {index === 4 && "Bulk, custom sizing, private label, and fabric requests are routed to inquiry."}
                {index === 5 && "Reviews, testimonials, and social proof support buyer confidence."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ArtisanStorySection() {
  return (
    <section className="bg-[#eef4f0] py-16 lg:py-24">
      <div className="container-app grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-stone-100 shadow-xl shadow-stone-950/10 lg:aspect-[5/4]">
          <Image
            src={PROCESS_STEPS[2].image}
            alt="Hand block printing artisan process"
            fill
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-cover"
          />
        </div>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold leading-tight text-stone-950 lg:text-5xl">
            Artisan Story
          </h2>
          <p className="mt-5 text-base leading-8 text-stone-700">
            {BRAND.name} is now framed around the place and process that make the brand specific: Jaipur hand block printed textiles. The story connects carved blocks, prepared fabric, hand printing, washing, stitching, and inspection to the finished home linen, table linen, fashion, accessories, and fabric by yard.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {PROCESS_STEPS.slice(0, 3).map((step) => (
              <div key={step.title} className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-stone-950">{step.title}</p>
                <p className="mt-2 text-xs leading-5 text-stone-600">{step.text}</p>
              </div>
            ))}
          </div>
          <Link
            href="/process"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#173f4f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#245d70]"
          >
            See the Process
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function WholesaleProgramSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container-app">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader
            title="Wholesale Program"
            description="A professional route for boutiques, interior studios, brands, hotels, event buyers, and makers who need custom textile production."
          />
          <Link
            href="/wholesale"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#173f4f] px-5 py-3 text-sm font-semibold text-[#173f4f] transition-colors hover:bg-[#173f4f] hover:text-white"
          >
            Wholesale Inquiry
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {wholesaleCards.map((card) => (
            <div key={card.title} className="rounded-lg border border-stone-200 bg-[#fbfaf7] p-6">
              <Handshake className="text-[#276070]" size={22} />
              <h3 className="mt-4 font-semibold text-stone-950">{card.title}</h3>
              <p className="mt-2 text-sm leading-7 text-stone-600">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CustomerReviewsSection() {
  return (
    <section className="bg-[#173f4f] py-16 text-white lg:py-24">
      <div className="container-app">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold leading-tight text-white lg:text-4xl">
            Customer Reviews
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/72 lg:text-base">
            Social proof for finished products, wholesale buyers, and handmade textile confidence.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((review) => (
            <figure key={review.name} className="rounded-lg bg-white/10 p-6 ring-1 ring-white/12">
              <Quote className="text-[#f5c76b]" size={24} />
              <blockquote className="mt-5 text-sm leading-7 text-white/86">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6">
                <p className="font-semibold text-white">{review.name}</p>
                <p className="text-xs uppercase tracking-[0.14em] text-white/55">{review.location}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-8 grid gap-4 rounded-lg bg-white p-5 text-stone-800 md:grid-cols-3">
          <div className="flex gap-3">
            <Sparkles className="shrink-0 text-[#9f2f2f]" size={20} />
            <p className="text-sm leading-6">Product reviews stay visible on product pages for conversion and trust.</p>
          </div>
          <div className="flex gap-3">
            <Globe2 className="shrink-0 text-[#276070]" size={20} />
            <p className="text-sm leading-6">Etsy review highlights can be added when verified review assets are available.</p>
          </div>
          <div className="flex gap-3">
            <Instagram className="shrink-0 text-[#c9902e]" size={20} />
            <p className="text-sm leading-6">Buyer photos can be pulled into the social story once approved for reuse.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function InstagramFeedSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container-app">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader
            title="Instagram Feed"
            description="Active social content reinforces table textiles, tote bags, wholesale messaging, and the handmade brand world."
          />
          <a
            href={BRAND.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#173f4f] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#245d70]"
          >
            Follow on Instagram
            <Instagram size={16} />
          </a>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.title}
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-950/10"
            >
              <div className="relative aspect-square overflow-hidden bg-stone-100">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-stone-950">{post.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{post.text}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
