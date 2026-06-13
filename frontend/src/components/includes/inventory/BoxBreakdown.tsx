"use client";

import { PackageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type BoxQuantityEntry = {
  box: string;
  quantity: number;
};

type BoxBreakdownProps = {
  entries: BoxQuantityEntry[];
  selectedBox?: string | null;
  onSelectBox?: (box: string | null) => void;
  className?: string;
};

function isSameBox(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

type IsometricBoxProps = {
  quantity: number;
  selected?: boolean;
};

/** Isometric storage box — count centered on front face. */
function IsometricBox({ quantity, selected = false }: IsometricBoxProps) {
  const stroke = selected ? "var(--primary)" : "var(--border)";
  const topFill = selected ? "color-mix(in oklch, var(--primary) 18%, var(--card))" : "var(--muted)";
  const leftFill = selected ? "color-mix(in oklch, var(--primary) 10%, var(--card))" : "var(--card)";
  const rightFill = selected ? "color-mix(in oklch, var(--primary) 22%, var(--muted))" : "color-mix(in oklch, var(--muted) 80%, var(--border))";
  const countFill = selected ? "var(--primary)" : "var(--foreground)";

  return (
    <svg
      viewBox="0 0 72 80"
      className="h-[4.5rem] w-16 shrink-0 drop-shadow-sm"
      aria-hidden
    >
      {/* top face */}
      <path
        d="M36 4 L62 18 L36 32 L10 18 Z"
        fill={topFill}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* left face — front */}
      <path
        d="M10 18 L10 54 L36 70 L36 32 Z"
        fill={leftFill}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* right face */}
      <path
        d="M36 32 L62 18 L62 54 L36 70 Z"
        fill={rightFill}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* tape strip */}
      <path
        d="M22 38 L30 42 L30 48 L22 44 Z"
        fill="color-mix(in oklch, var(--primary) 35%, transparent)"
        opacity={selected ? 0.9 : 0.45}
      />
      {/* count — center of left (front) face */}
      <text
        x="23"
        y="46"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={countFill}
        fontSize="20"
        fontWeight="600"
        fontFamily="var(--font-geist-sans, system-ui, sans-serif)"
      >
        {quantity}
      </text>
    </svg>
  );
}

export function BoxBreakdown({
  entries,
  selectedBox = null,
  onSelectBox,
  className,
}: BoxBreakdownProps) {
  if (entries.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-8 text-center",
          className,
        )}
      >
        <PackageIcon className="text-muted-foreground mx-auto mb-2 size-8 opacity-60" aria-hidden />
        <p className="text-sm font-medium">No boxes yet</p>
        <p className="text-muted-foreground mt-1 text-sm">
          Record your first log to create a box location.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border/50 bg-linear-to-b from-muted/40 to-muted/15 p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex flex-wrap gap-x-8 gap-y-5">
        {entries.map((entry) => {
          const isSelected = selectedBox ? isSameBox(selectedBox, entry.box) : false;

          return (
            <button
              key={entry.box}
              type="button"
              onClick={() => onSelectBox?.(isSelected ? null : entry.box)}
              aria-pressed={isSelected}
              aria-label={`${entry.box}, ${entry.quantity} units. ${isSelected ? "Showing logs for this box." : "Click to filter logs."}`}
              className={cn(
                "group flex min-w-[4.5rem] flex-col items-center gap-2 rounded-xl px-2 py-2",
                "transition-[background-color,box-shadow,transform] duration-150",
                "hover:bg-background/70 hover:shadow-sm",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
                isSelected && "bg-background shadow-md ring-2 ring-primary/30",
              )}
            >
              <IsometricBox quantity={entry.quantity} selected={isSelected} />
              <div className="max-w-[5.5rem] text-center">
                <p className="truncate text-xs font-medium">{entry.box}</p>
                <p className="text-muted-foreground text-[10px] tabular-nums">
                  {entry.quantity} unit{entry.quantity === 1 ? "" : "s"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function logMatchesBox(
  log: { box: string; fromBox?: string | null; type: string },
  box: string,
): boolean {
  const normalized = box.trim().toLowerCase();
  if (log.box.trim().toLowerCase() === normalized) return true;
  if (log.fromBox?.trim().toLowerCase() === normalized) return true;
  return false;
}
