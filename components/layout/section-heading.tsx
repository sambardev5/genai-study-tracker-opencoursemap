import { Badge } from "@/components/ui/badge";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-3">
      {eyebrow ? <Badge>{eyebrow}</Badge> : null}
      <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">{title}</h1>
      {description ? <p className="max-w-3xl text-base leading-8 text-ink/68 sm:text-lg">{description}</p> : null}
    </div>
  );
}
