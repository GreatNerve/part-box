import type { LucideIcon } from "lucide-react";
import {
  ActivityIcon,
  ArrowLeftRightIcon,
  BoxesIcon,
  HistoryIcon,
  PackageSearchIcon,
  ShieldCheckIcon,
} from "lucide-react";

export const landingImages = {
  hero: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=85&auto=format&fit=crop",
  lab: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=85&auto=format&fit=crop",
  bench: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85&auto=format&fit=crop",
} as const;

export type LandingFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const landingFeatures: LandingFeature[] = [
  {
    title: "Box-level tracking",
    description:
      "Every part lives in a labeled box. See counts per bin, not just totals on a spreadsheet.",
    icon: BoxesIcon,
  },
  {
    title: "Full audit trail",
    description:
      "Stock in, stock out, moves between boxes — every change is logged with a timestamp.",
    icon: HistoryIcon,
  },
  {
    title: "Low-stock alerts",
    description:
      "Set thresholds per category so you know when to reorder before a project stalls.",
    icon: PackageSearchIcon,
  },
  {
    title: "Move & reallocate",
    description:
      "Shift inventory between boxes in one action. History keeps the from → to trail intact.",
    icon: ArrowLeftRightIcon,
  },
  {
    title: "Activity feed",
    description:
      "Scan recent changes across your whole desk — perfect before lab sessions or builds.",
    icon: ActivityIcon,
  },
  {
    title: "Private by default",
    description:
      "Your inventory is yours alone. Sign in and every part, box, and log stays under your account.",
    icon: ShieldCheckIcon,
  },
];

export const landingSteps = [
  {
    step: "01",
    title: "Catalog your parts",
    body: "Add components with categories, specs, and resource links. Group them the way your bench is organized.",
  },
  {
    step: "02",
    title: "Assign boxes",
    body: "Record stock per labeled container — Drawer A, Bin 3, anti-static bag. Quantities stay precise.",
  },
  {
    step: "03",
    title: "Log every change",
    body: "Take parts for a project, restock after an order, or move stock between boxes. History never lies.",
  },
] as const;

export const landingStats = [
  { value: "∞", label: "Components tracked" },
  { value: "Per box", label: "Granular stock" },
  { value: "100%", label: "Change history" },
] as const;
