import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Ingresar · Prode Mundial" };

export default function LoginPage() {
  return (
    <div
      className="flex relative overflow-hidden"
      style={{ minHeight: "100dvh", padding: "64px 20px 40px" }}
    >
      {/* bg glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: "30%", left: "50%", transform: "translate(-50%, -50%)",
          width: 400, height: 400,
          background: "rgba(0,208,132,0.06)", filter: "blur(100px)",
        }}
      />
      <div style={{ margin: "auto", width: "100%" }}>
        <LoginForm />
      </div>
    </div>
  );
}
