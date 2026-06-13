import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth/auth";
import { LandingPage } from "@/components/modules/landing/LandingPage";

export const metadata: Metadata = {
  title: "Parts Desk — Student electronics inventory",
  description:
    "Track Arduinos, sensors, and ICs across labeled boxes. Box-level stock, full audit trail, built for solo students.",
};

export default async function HomePage() {
  const session = await auth();

  if (session?.accessToken) {
    redirect("/components");
  }

  return <LandingPage />;
}
