import Icon from "./Icon";
import type { Testimonial } from "@/data/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="soft-card rounded-2xl p-4 sm:p-6 h-full flex flex-col hover:border-amber/40 transition-colors duration-300">
      <div className="flex items-center gap-0.5 mb-2.5 sm:mb-4 text-amber drop-shadow-[0_0_6px] drop-shadow-amber/40">
        {Array.from({ length: 5 }).map((_, index) => (
          <Icon
            key={index}
            name="star"
            size={13}
            className={index < testimonial.rating ? "" : "text-line"}
          />
        ))}
      </div>

      <p className="text-[13px] sm:text-sm text-ink-soft leading-relaxed flex-1 line-clamp-5">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      <div className="mt-3.5 pt-3 sm:mt-5 sm:pt-4 border-t border-line">
        <p className="text-[13px] sm:text-sm font-bold text-ink">
          {testimonial.name}
        </p>
        <p className="text-[11px] sm:text-xs text-ink-soft">
          {testimonial.location} &middot; {testimonial.vehicle}
        </p>
      </div>
    </div>
  );
}
