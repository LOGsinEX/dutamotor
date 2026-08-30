"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import ThemeToggle from "@/components/layout/ThemeToggle";

const LINKS = [
  { href: "/admin", label: "Unit Mobil", icon: "car" },
  { href: "/admin/tambah", label: "Tambah Unit", icon: "plus" },
  { href: "/admin/tiktok", label: "Video TikTok", icon: "tiktok" },
  { href: "/admin/pengaturan", label: "Kontak & Sosmed", icon: "settings" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
  <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-line">
  <div className="max-w-6xl mx-auto px-4 sm:px-6">
    <div className="flex items-center justify-between h-16">
      <Link href="/admin" className="flex items-center gap-2.5">
        <Image
          src="/images/logo.png"
          alt="Logo Duta Motor"
          width={512}
          height={512}
          priority
          className="h-9 sm:h-10 w-auto object-contain transition-[filter] duration-300 dark:[filter:drop-shadow(0_0_1px_rgba(255,255,255,0.95))_drop-shadow(0_0_4px_rgba(255,255,255,0.45))]"
        />
        <span className="text-sm font-extrabold text-ink">
          Panel Admin
        </span>
          </Link>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-soft hover:bg-surface-soft"
            >
              Lihat Website
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-brand hover:bg-brand-soft cursor-pointer min-h-[44px]"
            >
              <Icon name="logout" size={16} />
              Keluar
            </button>
          </div>
        </div>

        <nav className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-3">
          {LINKS.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors min-h-[44px] ${
                  active
                    ? "bg-brand text-white"
                    : "bg-surface-soft text-ink-soft hover:bg-line"
                }`}
              >
                <Icon name={link.icon} size={15} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
