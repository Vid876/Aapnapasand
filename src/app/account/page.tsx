import { OrdersList } from "@/components/account/OrdersList";

export default function AccountPage() {
  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b87811]">Overview</p>
      <h2 className="mt-2 font-display text-2xl font-bold text-stone-950">Recent Orders</h2>
      <div className="mt-6">
        <OrdersList limit={5} />
      </div>
    </section>
  );
}
