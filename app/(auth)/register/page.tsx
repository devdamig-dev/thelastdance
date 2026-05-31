import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = { title: "Registrarse - Prode Mundial" };

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      <RegisterForm />
    </div>
  );
}
