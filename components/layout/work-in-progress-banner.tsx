import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const REPEATED_MESSAGE_COUNT = 4;

export function WorkInProgressBanner({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  const items = Array.from({ length: REPEATED_MESSAGE_COUNT }, (_, index) => (
    <span
      key={`${message}-${index}`}
      className="inline-flex items-center gap-3 whitespace-nowrap px-4 text-xs font-semibold uppercase tracking-[0.26em] text-copper sm:text-sm"
    >
      <span>Work In Progress</span>
      <span className="text-copper/45">/</span>
      <span>{message}</span>
    </span>
  ));

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-copper/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(242,223,198,0.7),rgba(138,201,209,0.18))] shadow-card backdrop-blur",
        className,
      )}
      aria-label={`Work in progress: ${message}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-3 left-4 w-14 rounded-full bg-[radial-gradient(circle,rgba(182,94,50,0.24),rgba(242,223,198,0.06)_68%,transparent_72%)] blur-md"
      />
      <div className="relative flex items-center gap-4 p-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-copper/15 bg-white/85 shadow-sm">
          <Sparkles className="h-4 w-4 text-copper" />
        </div>
        <div className="overflow-hidden">
          <div className="work-in-progress-marquee flex min-w-max items-center">
            {items}
            {items}
          </div>
        </div>
      </div>
    </div>
  );
}
