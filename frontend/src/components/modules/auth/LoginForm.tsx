"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CpuIcon, ShieldCheckIcon } from "lucide-react";

import { FormGenerator } from "@/components/includes/FormGenerator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { loginSchema, type LoginFormValues } from "@/schema";

export function LoginForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setErrorMessage("Invalid email or password. Check your credentials and try again.");
      return;
    }

    router.push("/components");
    router.refresh();
  };

  return (
    <Card className="border-border/60 w-full max-w-md shadow-xl backdrop-blur-sm">
      <CardHeader className="space-y-3 pb-2">
        <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
          <CpuIcon className="size-5" aria-hidden />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl tracking-tight">Welcome back</CardTitle>
          <CardDescription className="leading-relaxed">
            Sign in to manage your parts inventory across labeled boxes.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormGenerator
            form={form}
            fields={[
              { name: "email", label: "Email", type: "email", placeholder: "you@school.edu" },
              { name: "password", label: "Password", type: "password" },
            ]}
          />
          {errorMessage ? (
            <p
              className="text-destructive rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm"
              role="alert"
            >
              {errorMessage}
            </p>
          ) : null}
          <Button type="submit" className="h-11 w-full gap-2 shadow-sm" disabled={isSubmitting}>
            {isSubmitting ? <Spinner className="size-4" /> : null}
            Sign in
          </Button>
          <p className="text-muted-foreground flex items-center justify-center gap-1.5 text-xs">
            <ShieldCheckIcon className="size-3.5" aria-hidden />
            Private inventory — only you can see your parts
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
