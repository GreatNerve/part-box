import Link from "next/link";
import { CpuIcon } from "lucide-react";

import { RegisterForm } from "@/components/modules/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="page-gradient flex min-h-dvh flex-col items-center justify-center px-4 py-10 sm:px-8">
      <div className="mb-6 flex items-center gap-3 lg:hidden">
        <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-xl shadow-sm">
          <CpuIcon className="size-5" aria-hidden />
        </div>
        <div>
          <p className="font-semibold tracking-tight">Parts Desk</p>
          <p className="text-muted-foreground text-xs">Student inventory</p>
        </div>
      </div>
      <RegisterForm />
      <p className="text-muted-foreground mt-6 text-sm">
        Already registered?{" "}
        <Link href="/login" className="text-primary font-medium underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
