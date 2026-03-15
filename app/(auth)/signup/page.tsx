import Link from "next/link";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <Card>
        <SectionHeading
          eyebrow="Create account"
          title="Track every course in one place"
          description="This scaffold includes profile, preferences, and per-course status APIs. The Supabase auth wiring is prepared and can replace demo mode via environment variables."
        />
        <div className="mt-8 grid gap-4">
          <Button variant="secondary">Continue with Google</Button>
          <div className="grid gap-3">
            <Input type="text" placeholder="Full name" />
            <Input type="email" placeholder="Email address" />
            <Input type="password" placeholder="Password" />
            <Button>Create account</Button>
          </div>
          <p className="text-sm text-ink/58">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-copper">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
