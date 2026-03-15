import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "default",
  children,
}: {
  className?: string;
  tone?: "default" | "success" | "warning" | "muted";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        tone === "default" && "bg-copper/10 text-copper",
        tone === "success" && "bg-pine/10 text-pine",
        tone === "warning" && "bg-sand text-ink",
        tone === "muted" && "bg-black/5 text-ink/60",
        className,
      )}
    >
      {children}
    </span>
  );
}
