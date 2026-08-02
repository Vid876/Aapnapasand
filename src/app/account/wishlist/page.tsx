import { WishlistProducts } from "@/components/account/WishlistProducts";

export default function AccountWishlistPage() {
  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b87811]">Saved products</p>
      <h2 className="mt-2 font-display text-2xl font-bold text-stone-950">My Wishlist</h2>
      <p className="mb-6 mt-2 text-sm text-stone-600">All available products saved to this account.</p>
      <WishlistProducts compactTitle />
    </section>
  );
}
