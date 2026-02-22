"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { LogoutButton } from "./LogoutButton";

export function PortalHeader({ userName }: { userName: string | null }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const close = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onResize = () => {
      if (window.innerWidth >= 768) close();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobileOpen, close]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [mobileOpen, close]);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 min-h-[52px] max-w-4xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-4">
          <Link
            href="/portal"
            className="text-lg font-semibold text-slate-900 tracking-tight sm:text-xl"
          >
            MediTrack <span className="text-primary-600">Portal</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/portal"
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-primary-50 hover:text-primary-700"
            >
              Dashboard
            </Link>
            <Link
              href="/portal/appointments"
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-primary-50 hover:text-primary-700"
            >
              Appointments
            </Link>
            <Link
              href="/portal/medications"
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-primary-50 hover:text-primary-700"
            >
              Medications
            </Link>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <img
              src="https://cdn-icons-png.flaticon.com/128/16424/16424883.png"
              alt=""
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <span className="text-sm font-medium text-slate-700">
              {userName ?? "Patient"}
            </span>
            <LogoutButton />
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Open menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile overlay + drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm md:hidden"
            aria-hidden
            onClick={close}
          />
          <div
            className="fixed right-0 top-0 z-40 flex h-full w-full max-w-[280px] flex-col border-l border-slate-200 bg-white shadow-xl md:hidden"
            role="dialog"
            aria-label="Menu"
          >
            <div className="flex h-14 items-center justify-between border-b border-slate-100 px-4">
              <span className="text-sm font-medium text-slate-500">Menu</span>
              <button
                type="button"
                onClick={close}
                className="flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 p-4">
              <Link
                href="/portal"
                onClick={close}
                className="rounded-xl px-4 py-3 text-base font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700 min-h-[44px] flex items-center"
              >
                Dashboard
              </Link>
              <Link
                href="/portal/appointments"
                onClick={close}
                className="rounded-xl px-4 py-3 text-base font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700 min-h-[44px] flex items-center"
              >
                Appointments
              </Link>
              <Link
                href="/portal/medications"
                onClick={close}
                className="rounded-xl px-4 py-3 text-base font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700 min-h-[44px] flex items-center"
              >
                Medications
              </Link>
            </nav>
            <div className="border-t border-slate-100 p-4 flex items-center gap-3">
              <img
                src="https://cdn-icons-png.flaticon.com/128/16424/16424883.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-sm font-medium text-slate-700 truncate">
                {userName ?? "Patient"}
              </span>
            </div>
            <div className="p-4 pt-0">
              <LogoutButton />
            </div>
          </div>
        </>
      )}
    </>
  );
}
