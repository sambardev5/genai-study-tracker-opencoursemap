import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-full border border-black/10 bg-white px-4 text-sm outline-none transition placeholder:text-ink/40 focus:border-copper/50 focus:ring-2 focus:ring-copper/15",
        props.className,
      )}
    />
  );
}
