import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = { title: "Crear cuenta · Prode Mundial" };

export default function RegisterPage() {
  return (
    <div
      className="flex relative overflow-hidden"
      style={{ minHeight: "100dvh", padding: "64px 20px 40px" }}
    >
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: "30%", left: "50%", transform: "translate(-50%, -50%)",
          width: 400, height: 400,
          background: "rgba(0,208,132,0.06)", filter: "blur(100px)",
        }}
      />
      <div style={{ margin: "auto", width: "100%" }}>
        <RegisterForm />
      </div>
    </div>
  );
}
