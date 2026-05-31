import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Ingresar - Prode Mundial" };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      <LoginForm />
    </div>
  );
}
