import { OrdersList } from "@/components/account/OrdersList";

export default function AccountOrdersPage() {
  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b87811]">Order history</p>
      <h2 className="mt-2 font-display text-2xl font-bold text-stone-950">All Orders</h2>
      <p className="mt-2 text-sm text-stone-600">Every order placed with this account appears here.</p>
      <div className="mt-6">
        <OrdersList />
      </div>
    </section>
  );
}
