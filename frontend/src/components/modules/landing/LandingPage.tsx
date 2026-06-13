import Image from "next/image";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import {
  ArrowRightIcon,
  CheckIcon,
  CpuIcon,
  SparklesIcon,
} from "lucide-react";

import { ThemeToggle } from "@/components/modules/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  landingFeatures,
  landingImages,
  landingStats,
  landingSteps,
} from "@/components/modules/landing/landing-content";
import { cn } from "@/lib/utils";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

export function LandingPage() {
  return (
    <div
      className={cn(display.variable, "font-display relative min-h-dvh overflow-x-hidden bg-background")}
    >
      {/* ── Nav ── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[oklch(0.13_0.025_255/0.82)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[oklch(0.72_0.14_65)] text-[oklch(0.16_0.03_255)] shadow-lg shadow-[oklch(0.72_0.14_65/0.25)]">
              <CpuIcon className="size-4" aria-hidden />
            </div>
            <span className="text-base font-semibold tracking-tight text-white">Parts Desk</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {[
              { href: "#features", label: "Features" },
              { href: "#workflow", label: "How it works" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="hidden text-white/80 hover:bg-white/10 hover:text-white sm:inline-flex"
              render={<Link href="/login" />}
            >
              Sign in
            </Button>
            <Button
              size="sm"
              className="bg-[oklch(0.72_0.14_65)] text-[oklch(0.16_0.03_255)] hover:bg-[oklch(0.78_0.14_65)]"
              render={<Link href="/register" />}
            >
              Get started
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="landing-hero-mesh landing-grain relative pt-16">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,oklch(0.985_0.002_250)_92%)]" />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8 lg:pb-32 lg:pt-24">
          <div className="max-w-xl">
            <div className="landing-rise mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[oklch(0.85_0.08_65)]">
              <SparklesIcon className="size-3.5" aria-hidden />
              Built for solo electronics students
            </div>

            <h1 className="landing-rise landing-rise-delay-1 text-4xl leading-[1.05] font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              Your bench,{" "}
              <span className="text-[oklch(0.78_0.14_65)]">catalogued</span>{" "}
              down to every box.
            </h1>

            <p className="landing-rise landing-rise-delay-2 mt-6 text-lg leading-relaxed text-white/65">
              Parts Desk tracks Arduinos, sensors, and ICs across labeled storage — with a
              complete audit trail so you always know what moved, when, and from which bin.
            </p>

            <div className="landing-rise landing-rise-delay-3 mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="h-11 gap-2 bg-[oklch(0.72_0.14_65)] px-6 text-[oklch(0.16_0.03_255)] hover:bg-[oklch(0.78_0.14_65)]"
                render={<Link href="/register" />}
              >
                Start free
                <ArrowRightIcon className="size-4" aria-hidden />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 border-white/15 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white"
                render={<Link href="/login" />}
              >
                Sign in
              </Button>
            </div>

            <ul className="landing-rise landing-rise-delay-4 mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/55">
              {["Box-level stock", "Move between bins", "Private inventory"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckIcon className="size-3.5 text-[oklch(0.72_0.14_65)]" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Hero imagery */}
          <div className="landing-rise landing-rise-delay-2 relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40 sm:aspect-[5/6]">
              <Image
                src={landingImages.hero}
                alt="Close-up of a microchip on a circuit board"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 520px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.13_0.025_255/0.55)] via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-6 -left-4 hidden w-[52%] overflow-hidden rounded-xl border border-white/15 shadow-xl sm:block lg:-left-8">
              <div className="relative aspect-[4/3]">
                <Image
                  src={landingImages.lab}
                  alt="Student working with electronics at a lab bench"
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>
            </div>

            <div className="absolute -top-3 -right-2 rounded-xl border border-[oklch(0.72_0.14_65/0.35)] bg-[oklch(0.16_0.03_255/0.92)] px-4 py-3 shadow-xl backdrop-blur-sm sm:-right-6">
              <p className="text-[11px] font-medium tracking-widest text-[oklch(0.72_0.14_65)] uppercase">
                Live stock
              </p>
              <p className="mt-0.5 text-2xl font-semibold text-white">Box B-12</p>
              <p className="text-sm text-white/60">24 × Arduino Nano</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto grid max-w-6xl divide-y divide-border/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {landingStats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center px-6 py-10 text-center">
              <p className="text-3xl font-semibold tracking-tight text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="page-gradient scroll-mt-20 px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-widest text-[oklch(0.55_0.14_65)] uppercase">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything your parts drawer needs — nothing it doesn&apos;t.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              No enterprise bloat. Just the tools to keep your components findable, accountable,
              and ready for the next build.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {landingFeatures.map((feature, index) => (
              <article
                key={feature.title}
                className={cn(
                  "group rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md",
                  index === 0 && "lg:col-span-2 lg:flex lg:items-start lg:gap-6",
                )}
              >
                <div
                  className={cn(
                    "mb-4 flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground",
                    index === 0 && "lg:mb-0",
                  )}
                >
                  <feature.icon className="size-5" aria-hidden />
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workflow ── */}
      <section id="workflow" className="scroll-mt-20 border-y border-border/60 bg-muted/30 px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-medium tracking-widest text-[oklch(0.55_0.14_65)] uppercase">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                From messy drawer to searchable inventory in three steps.
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Whether you inherit a club&apos;s parts cabinet or start fresh in a dorm room,
                Parts Desk mirrors how you actually store hardware.
              </p>
            </div>

            <ol className="space-y-6">
              {landingSteps.map((item) => (
                <li
                  key={item.step}
                  className="relative flex gap-5 rounded-2xl border border-border/70 bg-card p-5 shadow-sm"
                >
                  <span className="font-display text-2xl font-semibold text-[oklch(0.72_0.14_65)]">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Showcase band ── */}
      <section className="relative min-h-[420px] overflow-hidden">
        <Image
          src={landingImages.bench}
          alt="Hands assembling electronics at a workbench"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[oklch(0.13_0.025_255/0.78)]" />
        <div className="relative mx-auto flex min-h-[420px] max-w-6xl flex-col justify-center px-4 py-20 sm:px-6">
          <blockquote className="max-w-2xl">
            <p className="text-2xl leading-snug font-semibold tracking-tight text-white sm:text-3xl">
              &ldquo;I stopped buying duplicate sensors because I could finally see what was
              already in Drawer C.&rdquo;
            </p>
            <footer className="mt-6 text-sm text-white/60">
              — The problem every electronics student knows
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="page-gradient px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card px-6 py-14 shadow-lg sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-[oklch(0.72_0.14_65/0.15)] blur-3xl" />

            <div className="relative max-w-xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Ready to tame the parts drawer?
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Create a free account in seconds. Add your first component, assign a box, and
                never lose track of stock again.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="h-11 gap-2 px-6"
                  render={<Link href="/register" />}
                >
                  Create account
                  <ArrowRightIcon className="size-4" aria-hidden />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 px-6"
                  render={<Link href="/login" />}
                >
                  I already have one
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/60 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CpuIcon className="size-3.5" aria-hidden />
            </div>
            <span className="text-sm font-medium">Parts Desk</span>
          </div>
          <p className="text-muted-foreground text-center text-xs sm:text-sm">
            Student electronics inventory — private, box-aware, audit-ready.
          </p>
          <div className="flex gap-4 text-sm">
            <Link href="/login" className="text-muted-foreground hover:text-foreground">
              Sign in
            </Link>
            <Link href="/register" className="text-primary font-medium hover:underline">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
