import type { Metadata } from "next";
import { SiteFrame } from "@/components/layout/site-frame";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "OpenCourseMap",
    template: "%s | OpenCourseMap",
  },
  description:
    "Discover free LLM, MCP, Generative AI, and Machine Learning courses. Track external enrollments, completions, and skill gaps in one place.",
  applicationName: "OpenCourseMap",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "OpenCourseMap",
    description:
      "Free-to-enroll AI learning resources with progress tracking, guided paths, and skill-gap dashboards.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="grain bg-canvas text-ink antialiased">
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
