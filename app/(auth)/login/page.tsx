import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Ingresar · Prode Mundial" };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16 relative">
      {/* Extra glow behind form */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#00D084]/6 blur-[100px] rounded-full pointer-events-none" />
      <LoginForm />
    </div>
  );
}
