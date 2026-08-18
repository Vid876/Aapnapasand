import { RegisterForm } from "@/components/auth/CustomerAuthForms";

export default function RegisterPage() {
  return (
    <section className="relative overflow-hidden bg-[#f4f0e8] py-14 sm:py-20">
      <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-[#dce9e2] blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-[#edd7b1] blur-3xl" />
      <div className="container-app relative mx-auto max-w-lg"><RegisterForm /></div>
    </section>
  );
}
