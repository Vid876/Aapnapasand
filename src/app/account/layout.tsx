import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { authOptions } from "@/lib/auth";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/account");

  return (
    <div className="container-app py-8 lg:py-12">
      <h1 className="mb-8 font-display text-3xl font-bold text-stone-950">My Account</h1>
      <div className="grid gap-8 lg:grid-cols-4">
        <AccountSidebar name={session.user.name} email={session.user.email} />
        <main className="min-w-0 lg:col-span-3">{children}</main>
      </div>
    </div>
  );
}
