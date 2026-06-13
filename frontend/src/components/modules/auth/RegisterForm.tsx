"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormGenerator } from "@/components/includes/FormGenerator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { grpcRegister } from "@/lib/grpc/mutations";
import { getGrpcErrorMessage } from "@/lib/grpc/mappers";
import { registerSchema, type RegisterFormValues } from "@/schema";

export function RegisterForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: "", email: "", password: "" },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const auth = await grpcRegister({
        email: values.email,
        password: values.password,
        displayName: values.displayName || null,
      });

      const signInResult = await signIn("credentials", {
        email: auth.user.email,
        accessToken: auth.token,
        id: auth.user.id,
        name: auth.user.displayName ?? auth.user.email,
        redirect: false,
      });

      if (signInResult?.error) {
        setErrorMessage("Account created, but sign-in failed. Try logging in.");
        setIsSubmitting(false);
        return;
      }

      router.push("/components");
      router.refresh();
    } catch (error) {
      setErrorMessage(getGrpcErrorMessage(error));
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Track your parts across labeled boxes.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormGenerator
            form={form}
            fields={[
              { name: "displayName", label: "Name", type: "text", placeholder: "Your name" },
              { name: "email", label: "Email", type: "email", placeholder: "you@school.edu" },
              { name: "password", label: "Password", type: "password" },
            ]}
          />
          {errorMessage ? (
            <p className="text-destructive text-sm" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Spinner className="size-4" /> : null}
            Create account
          </Button>
          <p className="text-muted-foreground text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
