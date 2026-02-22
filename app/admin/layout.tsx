import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 min-h-[52px] max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:h-16 sm:py-0">
          <Link
            href="/admin"
            className="text-lg font-semibold text-slate-900 tracking-tight sm:text-xl"
          >
            MediTrack <span className="text-primary-600">Admin</span>
          </Link>
          <Link
            href="/"
            className="rounded-xl px-4 py-3 min-h-[44px] text-sm font-medium text-slate-600 transition-colors hover:bg-primary-50 hover:text-primary-700 flex items-center"
          >
            Patient Portal
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
