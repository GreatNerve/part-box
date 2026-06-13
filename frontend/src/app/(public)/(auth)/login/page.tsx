import Link from "next/link";
import { BoxesIcon, CpuIcon, PackageIcon } from "lucide-react";

import { LoginForm } from "@/components/modules/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <section className="auth-grid page-gradient relative hidden flex-col justify-between overflow-hidden p-10 lg:flex">
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-xl shadow-sm">
            <CpuIcon className="size-5" aria-hidden />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">Parts Desk</p>
            <p className="text-muted-foreground text-sm">Student electronics inventory</p>
          </div>
        </div>

        <div className="relative z-10 max-w-md space-y-6">
          <h1 className="text-3xl leading-tight font-semibold tracking-tight">
            Know exactly what&apos;s in every box.
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Track Arduinos, sensors, and ICs across labeled storage. Log every change with
            box-level detail.
          </p>
          <div className="grid gap-3">
            {[
              { icon: BoxesIcon, text: "Organize parts by category and box" },
              { icon: PackageIcon, text: "See stock levels at a glance" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 px-4 py-3 backdrop-blur-sm"
              >
                <Icon className="text-primary size-4 shrink-0" aria-hidden />
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-muted-foreground relative z-10 text-xs">
          Built for solo students managing lab parts.
        </p>
      </section>

      <section className="flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <LoginForm />
        <p className="text-muted-foreground mt-6 text-sm">
          Need an account?{" "}
          <Link href="/register" className="text-primary font-medium underline-offset-4 hover:underline">
            Create one
          </Link>
        </p>
      </section>
    </div>
  );
}
