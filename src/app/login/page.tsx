import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "ログイン | Ryu Keiri",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 sm:px-6">
      <div className="flex w-full flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-foreground">Ryu Keiri</h1>
          <p className="mt-1 text-sm text-muted-foreground">経理業務 SaaS</p>
        </div>
        <LoginForm />
        <p className="text-xs text-muted-foreground">
          モック: <span className="font-mono">demo / demo</span> でログインできます
        </p>
      </div>
    </main>
  );
}
