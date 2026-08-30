"use client";

import { motion } from "framer-motion";
import Script from "next/script";
import Icon from "@/components/ui/Icon";
import { sanitizeTiktokUrl } from "@/lib/tiktok";
import type { SiteSettings, TiktokVideo } from "@/data/types";

interface TiktokShowcaseProps {
  videos: TiktokVideo[];
  settings: SiteSettings;
}

/**
 * Membuat blockquote resmi TikTok. Skrip embed.js akan mengubahnya
 * menjadi pemutar video. Sebelum skrip termuat, isinya tetap berupa
 * tautan biasa sehingga tidak pernah terlihat kosong.
 */
function buildEmbed(video: TiktokVideo) {
  const id = String(video.videoId).replace(/[^0-9]/g, "");
  const url = sanitizeTiktokUrl(video.url);

  return `<blockquote class="tiktok-embed" cite="${url}" data-video-id="${id}" style="max-width:605px;min-width:280px;margin:0;"><section><a target="_blank" rel="noopener noreferrer" href="${url}">Buka video ini di TikTok</a></section></blockquote>`;
}

export default function TiktokShowcase({
  videos,
  settings,
}: TiktokShowcaseProps) {
  // Section disembunyikan selama admin belum menambahkan video
  if (videos.length === 0) return null;

  return (
    <section
      id="video"
      className="py-12 sm:py-16 lg:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 lg:mb-14"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-surface/60 backdrop-blur border border-line px-3.5 py-1.5 text-xs font-bold text-violet mb-4">
            <Icon name="tiktok" size={13} />
            Video Terbaru
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink mb-3">
            Lihat Unit Langsung <span className="text-rgb">Lewat Video</span>
          </h2>
          <p className="hidden sm:block text-sm sm:text-base text-ink-soft">
            Kondisi mesin, interior, dan eksterior kami rekam apa adanya. Tonton
            dulu sebelum datang ke showroom.
          </p>
        </motion.div>

        {/* Di HP video digeser ke samping, di PC tetap tiga kolom */}
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:mx-0 lg:px-0 lg:pb-0">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              className="group snap-center shrink-0 w-[86%] sm:w-[340px] lg:w-auto rounded-2xl soft-card p-3 hover:border-violet/40 transition-all duration-300"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: Math.min(index, 3) * 0.1 }}
            >
              <div
                className="flex justify-center overflow-hidden rounded-xl min-h-[540px]"
                dangerouslySetInnerHTML={{ __html: buildEmbed(video) }}
              />
              {video.caption && (
                <p className="mt-3 px-1 pb-1 text-sm font-semibold text-ink line-clamp-2">
                  {video.caption}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {videos.length > 1 && (
          <p className="lg:hidden text-center text-xs text-ink-muted mt-3">
            Geser ke samping untuk melihat video lainnya
          </p>
        )}

        {settings.tiktokUrl && (
          <div className="text-center mt-10">
            <a
              href={settings.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/60 backdrop-blur px-5 py-3 text-sm font-bold text-ink hover:border-brand hover:text-brand transition-colors"
            >
              <Icon name="tiktok" size={16} />
              Lihat semua video di TikTok
            </a>
          </div>
        )}
      </div>

      <Script
        src="https://www.tiktok.com/embed.js"
        strategy="lazyOnload"
        async
      />
    </section>
  );
}
