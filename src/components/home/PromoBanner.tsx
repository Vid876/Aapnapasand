import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { InfoBand, PUBLIC_IMAGES } from "@/components/marketing/PublicPage";

export function PromoBanner() {
  return (
    <>
      <InfoBand
        title="Textiles built around craft, color, and use"
        text="BOHOBLOCKPRINTED brings together hand block printed home linen, table linen, relaxed fashion, accessories, and fabric by yard from Jaipur."
        image={PUBLIC_IMAGES.fabric}
        bullets={[
          "Natural cotton and linen fabrics",
          "Custom and wholesale inquiry support",
          "Everyday pieces with a handmade surface",
        ]}
      />
      <section className="pb-16 lg:pb-24">
        <div className="container-app grid gap-5 md:grid-cols-2">
          <Link
            href="/home-linen"
            className="group relative h-72 overflow-hidden rounded-[1.25rem] bg-brand-950 lg:h-96"
          >
            <Image
              src={PUBLIC_IMAGES.fabric}
              alt="Home linen collection"
              fill
              className="object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white lg:p-8">
              <h3 className="font-display text-4xl font-bold">Home linen</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/80">
                Block printed bedding, pillow covers, curtains, and layered textile pieces.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                Explore home linen <ArrowRight size={16} />
              </span>
            </div>
          </Link>

          <Link
            href="/table-linen"
            className="group relative h-72 overflow-hidden rounded-[1.25rem] bg-brand-950 lg:h-96"
          >
            <Image
              src={PUBLIC_IMAGES.tableLinen}
              alt="Table linen collection"
              fill
              className="object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white lg:p-8">
              <h3 className="font-display text-4xl font-bold">Table linen</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/80">
                Napkins, tablecloths, and runners for dining, gifting, and events.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                Explore table linen <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}

