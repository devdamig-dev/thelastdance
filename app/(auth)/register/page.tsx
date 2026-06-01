import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = { title: "Crear cuenta · Prode Mundial" };

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#00D084]/6 blur-[100px] rounded-full pointer-events-none" />
      <RegisterForm />
    </div>
  );
}
