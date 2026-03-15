import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-white/50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-ink/65 sm:px-6 lg:grid-cols-[2fr_1fr_1fr] lg:px-8">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">OpenCourseMap</h2>
          <p className="mt-3 max-w-xl leading-7">
            Free-to-enroll AI course discovery with external enrollment links, private progress tracking,
            guided learning paths, and skill-gap dashboards.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-ink">Product</h3>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/courses">Courses</Link>
            <Link href="/paths">Paths</Link>
            <Link href="/about">About</Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-ink">Disclosure</h3>
          <p className="mt-3 leading-7">
            Enrollment happens on the provider website. Progress tracking and recommendations happen inside
            OpenCourseMap.
          </p>
        </div>
      </div>
    </footer>
  );
}
