import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CheckCircle2, Globe2, Instagram, Quote, Sparkles } from "lucide-react";
import { BRAND, INSTAGRAM_POSTS, PROCESS_STEPS, TESTIMONIALS, WHY_CHOOSE } from "@/lib/brand";
import { SectionHeader } from "@/components/marketing/PublicPage";

export function HeroIntroText() {
  return (
    <section className="relative overflow-hidden border-b border-stone-200/70 bg-white py-11 text-center lg:py-16">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9902e] to-transparent" />
      <div className="container-app relative">
        <div className="mx-auto flex max-w-5xl items-center gap-4">
          <span className="hidden h-px flex-1 bg-gradient-to-r from-transparent to-[#c9902e]/55 sm:block" />
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#276070] sm:text-sm">Manufacturer &amp; Exporter From Jaipur, India</p>
          <span className="hidden h-px flex-1 bg-gradient-to-l from-transparent to-[#c9902e]/55 sm:block" />
        </div>
        <h2 className="mx-auto mt-4 max-w-4xl font-display text-2xl font-bold leading-tight text-stone-950 sm:text-3xl lg:text-4xl">Hand Block Printed Home Textiles, Fashion &amp; Bags</h2>
        <p className="mt-4 text-sm font-medium tracking-wide text-stone-600 sm:text-base">Manufacturer <span className="mx-1 text-[#c9902e]">|</span> Exporter <span className="mx-1 text-[#c9902e]">|</span> Wholesale Supplier <span className="mx-1 text-[#c9902e]">|</span> Private Label Partner</p>
      </div>
    </section>
  );
}

export function WhyChooseSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-24">
      <div className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-[#eef4f0] blur-3xl" />
      <div className="container-app">
        <SectionHeader
          align="center"
          title="Why Choose Bohoblockprinted"
          description="Handmade quality, flexible manufacturing, and dependable worldwide service."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE.map((item, index) => (
            <div
              key={item}
              className="group relative overflow-hidden rounded-xl border border-stone-200 bg-[#fbfaf7] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#276070]/25 hover:bg-white hover:shadow-xl hover:shadow-stone-950/5"
            >
              <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#c9902e] transition-transform duration-300 group-hover:scale-x-100" />
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-[#173f4f] text-white shadow-md shadow-[#173f4f]/15">
                <BadgeCheck size={20} />
              </div>
              <h3 className="text-lg font-semibold text-stone-950">{item}</h3>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                {index === 0 && "Textiles are positioned around Jaipur craft rather than generic fashion."}
                {index === 1 && "Hand printing gives each piece a human surface and an artisan story."}
                {index === 2 && "Cotton and linen fabrics support breathable home and wardrobe use."}
                {index === 3 && "Custom sizing is available for suitable products and production requirements."}
                {index === 4 && "Labels, packaging, and branding can be tailored for business buyers."}
                {index === 5 && "The store supports international buyers with worldwide shipping."}
                {index === 6 && "Boutiques, retailers, designers, hotels, and brands are welcome."}
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

const privateLabelItems = ["Custom Labels", "Custom Packaging", "Private Label Manufacturing", "Bulk Orders", "Wholesale Supply"] as const;

export function PrivateLabelSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-24">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(23,63,79,0.035)_0_1px,transparent_1px_44px)]" />
      <div className="container-app">
        <div className="relative mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader
            title="Private Label & Custom Branding"
            description="We offer custom labels, custom packaging, and private label manufacturing services for brands, boutiques, retailers, and wholesalers worldwide."
          />
          <Link
            href="/wholesale"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#173f4f] px-5 py-3 text-sm font-semibold text-[#173f4f] transition-colors hover:bg-[#173f4f] hover:text-white"
          >
            Discuss Your Requirements
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {privateLabelItems.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#c9902e]/40 hover:shadow-lg">
              <CheckCircle2 className="shrink-0 text-[#276070]" size={22} />
              <h3 className="font-semibold text-stone-950">{item}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BulkOrdersBanner() {
  return (
    <section className="bg-[#eef4f0] py-12 lg:py-16">
      <div className="container-app relative overflow-hidden rounded-2xl bg-[#173f4f] px-6 py-12 text-center text-white shadow-xl sm:px-10 lg:py-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,199,107,0.2),transparent_35%),repeating-linear-gradient(135deg,rgba(255,255,255,0.035)_0_1px,transparent_1px_18px)]" />
        <div className="relative">
        <h2 className="font-display text-3xl font-bold text-white lg:text-4xl">Looking for Wholesale or Bulk Orders?</h2>
        <p className="mx-auto mt-4 max-w-3xl leading-7 text-white/80">We work with boutiques, retailers, interior designers, hotels, wedding planners, and brands worldwide.</p>
        <Link href="/wholesale#inquiry-form" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#173f4f] transition hover:bg-[#f5c76b]">
          Request a Quote <ArrowRight size={16} />
        </Link>
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
              className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-950/10"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#f4f1eb]">
                <Image
                  src={post.image}
                  alt=""
                  fill
                  aria-hidden="true"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="scale-110 object-cover opacity-25 blur-2xl"
                />
                <div className="absolute inset-0 bg-white/45" />
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain p-3 transition duration-500 group-hover:scale-[1.015]"
                />
                <div className="pointer-events-none absolute inset-3 rounded-xl border border-white/40" />
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
