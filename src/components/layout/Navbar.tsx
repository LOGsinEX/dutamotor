"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAVIGATION } from "@/data/constants";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { buildWhatsAppLink, normalizeUrl } from "@/lib/utils";
import type { SiteSettings } from "@/data/types";

interface NavbarProps {
  settings: SiteSettings;
}

export default function Navbar({ settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const waLink = buildWhatsAppLink(settings);
  const tiktok = normalizeUrl(settings.tiktokUrl);
  const instagram = normalizeUrl(settings.instagramUrl);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-canvas/80 backdrop-blur-xl border-b border-line shadow-lg shadow-black/20"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        {/* Garis gradien RGB tipis muncul saat halaman digulir */}
        <div
          aria-hidden="true"
          className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-brand via-cyan to-violet transition-opacity duration-500 ${
            isScrolled ? "opacity-70" : "opacity-0"
          }`}
        />
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
  {/* Logo */}
  <Link href="/" className="flex items-center gap-3 shrink-0">
    <Image
      src="/images/logo.png"
      alt="Logo Duta Motor"
      width={240}
      height={96}
      priority
      className="h-10 lg:h-12 w-auto object-contain transition-[filter] duration-300 dark:[filter:drop-shadow(0_0_1px_rgba(255,255,255,0.95))_drop-shadow(0_0_4px_rgba(255,255,255,0.45))]"
    />

    <div className="flex flex-col justify-center">
      <p className="font-extrabold text-ink text-sm lg:text-base leading-tight">
        DUTA
      </p>
      <p className="text-[10px] lg:text-xs text-brand font-bold tracking-widest uppercase leading-tight">
        MOTOR
      </p>
    </div>
  </Link>

            {/* Menu desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {NAVIGATION.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="px-4 py-2 text-sm font-semibold text-ink-soft hover:text-ink hover:bg-surface/70 rounded-lg transition-all cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Aksi desktop */}
            <div className="hidden lg:flex items-center gap-2">
              <ThemeToggle />
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Duta Motor"
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-ink-soft hover:text-brand hover:bg-brand-soft transition-colors"
                >
                  <Icon name="instagram" size={18} />
                </a>
              )}
              {tiktok && (
                <a
                  href={tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok Duta Motor"
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-ink-soft hover:text-ink hover:bg-surface-soft transition-colors"
                >
                  <Icon name="tiktok" size={18} />
                </a>
              )}
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="sm">
                  <Icon name="whatsapp" size={16} />
                  Hubungi Kami
                </Button>
              </a>
              {/* Login admin (pojok kanan atas) */}
              <Link
                href="/admin/login"
                aria-label="Login admin"
                title="Login admin"
                className="w-10 h-10 flex items-center justify-center rounded-xl text-ink-muted hover:text-ink hover:bg-surface-soft transition-colors"
              >
                <Icon name="lock" size={16} />
              </Link>
            </div>

            {/* Aksi mobile */}
            <div className="flex items-center gap-1 lg:hidden">
              <ThemeToggle />

              {/* Tombol menu mobile */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 text-ink hover:bg-surface-soft rounded-xl transition-colors cursor-pointer"
                aria-label={isOpen ? "Tutup menu" : "Buka menu"}
              >
                <Icon name={isOpen ? "close" : "menu"} size={24} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Latar gelap menu mobile */}
      <div
        className={`fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Panel menu mobile */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-surface/95 backdrop-blur-2xl shadow-2xl transition-transform duration-500 ease-out lg:hidden border-l border-line ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-line">
            <p className="font-bold text-ink text-sm">Menu</p>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-ink-muted hover:text-ink hover:bg-surface-soft rounded-lg transition-colors cursor-pointer"
              aria-label="Tutup menu"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <div className="space-y-1">
              {NAVIGATION.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="w-full text-left px-4 py-3.5 text-sm font-semibold text-ink-soft hover:text-ink hover:bg-surface-soft rounded-xl transition-all cursor-pointer flex items-center gap-3"
                >
                  <span className="w-1.5 h-1.5 bg-brand rounded-full" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 border-t border-line">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="whatsapp" size="lg" className="w-full">
                <Icon name="whatsapp" size={18} />
                Chat WhatsApp
              </Button>
            </a>
            <div className="mt-4 flex items-center justify-center gap-3">
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-11 h-11 flex items-center justify-center rounded-xl bg-brand-soft text-brand"
                >
                  <Icon name="instagram" size={20} />
                </a>
              )}
              {tiktok && (
                <a
                  href={tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-11 h-11 flex items-center justify-center rounded-xl bg-surface-soft text-ink"
                >
                  <Icon name="tiktok" size={20} />
                </a>
              )}
              <Link
                href="/admin/login"
                aria-label="Login admin"
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-surface-soft text-ink-soft"
              >
                <Icon name="lock" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
