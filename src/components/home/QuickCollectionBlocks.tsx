import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { QUICK_LINK_BLOCKS } from "@/lib/brand";

export function QuickCollectionBlocks() {
  return (
    <section className="border-b border-stone-200 bg-white py-8 lg:py-10">
      <div className="container-app">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {QUICK_LINK_BLOCKS.map((block) => (
            <Link
              key={block.href}
              href={block.href}
              className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-950/10"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <Image
                  src={block.image}
                  alt={block.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-stone-950">{block.title}</h2>
                  <ArrowRight className="shrink-0 text-[#276070]" size={15} />
                </div>
                <p className="mt-2 text-xs leading-5 text-stone-600">{block.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
