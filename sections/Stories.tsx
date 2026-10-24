import Reveal from "@/components/Reveal";
import { StoryVideo } from "@/components/StoryVideo";
import { BananaLeaf } from "@/components/BananaLeaf";
import { Img } from "@/components/ui/Img";
import { stories } from "@/config/site";
import { cn } from "@/lib/utils";
import { langOf } from "@/lib/copy";

/**
 * THE FOOD STORY — chapters told right after the hero, each with its own short
 * clip (config `stories`). Split chapters put the clip beside the text; a wide
 * chapter runs the clip the full width of the container with dish names
 * scrolling underneath. Renders nothing when an event has no stories.
 */
const TONES: Record<string, string> = {
  white: "bg-white",
  cream: "bg-cream",
  leaf: "bg-[linear-gradient(180deg,#F4F9EF_0%,#FBFDF8_100%)]",
  gold: "bg-[linear-gradient(180deg,#FFF8EA_0%,#FDEFD3_100%)]",
};

type S = (typeof stories)[number];

function Text({ s, n, center = false }: { s: S; n: number; center?: boolean }) {
  return (
    <Reveal className={cn(center && "mx-auto max-w-3xl text-center")}>
      <p className={cn("eyebrow", center && "eyebrow-center")}>
        {String(n).padStart(2, "0")} ·{" "}
        <span lang="ml" className="ml text-[0.95rem] normal-case">
          {s.kicker}
        </span>
      </p>
      <h2
        lang={langOf(s.title)}
        className={cn("mt-4 text-espresso", langOf(s.title) ? "ml-display" : "display")}
        style={{ fontSize: langOf(s.title) ? "clamp(1.75rem, 3.4vw, 2.75rem)" : "clamp(2rem, 4vw, 3.3rem)" }}
      >
        {s.title}
      </h2>
      {s.titleMl && (
        <p lang="ml" className="ml mt-3 text-[1.15rem] text-[#2F6B3A] md:text-xl">
          {s.titleMl}
        </p>
      )}
      <div className={cn("mt-6 space-y-4", center && "mx-auto max-w-2xl")}>
        {s.body.map((p, i) => (
          <p key={i} className="body-copy" style={{ fontSize: "1.02rem" }}>
            {p}
          </p>
        ))}
      </div>
      {s.quoteMl && (
        <blockquote lang="ml" className={cn("ml mt-8 text-[1.25rem] leading-relaxed text-espresso md:text-[1.4rem]", center ? "mx-auto max-w-xl" : "border-l-2 border-saffron pl-5")}>
          {s.quoteMl}
        </blockquote>
      )}
    </Reveal>
  );
}

function SplitMedia({ s }: { s: S }) {
  if (!s.video && s.photo) {
    return (
      <Reveal delay={0.06} className="relative mx-auto w-full max-w-[26rem]">
        <BananaLeaf className="pointer-events-none absolute -left-24 top-1/3 w-[26rem] -rotate-[28deg]" style={{ opacity: 0.08 }} />
        <figure className="relative overflow-hidden rounded-[30px] shadow-[0_12px_28px_-16px_rgba(36,28,21,0.55)]">
          <div className="aspect-[4/5]">
            <Img src={s.photo.src} alt={s.photo.alt} />
          </div>
        </figure>
      </Reveal>
    );
  }
  if (!s.video) return null;
  if (s.photo) {
    return (
      <Reveal delay={0.06} className="grid grid-cols-[1fr_0.92fr] items-end gap-3 md:gap-4">
        <StoryVideo src={s.video.src} poster={s.video.poster} alt={s.video.alt} className="aspect-[9/16] rounded-[26px] shadow-[0_12px_28px_-16px_rgba(36,28,21,0.55)]" />
        <figure className="mb-10 overflow-hidden rounded-[22px] shadow-[0_10px_24px_-14px_rgba(36,28,21,0.5)] md:mb-16">
          <div className="aspect-[4/5]">
            <Img src={s.photo.src} alt={s.photo.alt} />
          </div>
        </figure>
      </Reveal>
    );
  }
  return (
    <Reveal delay={0.06} className="relative mx-auto w-full max-w-[22rem]">
      <BananaLeaf className="pointer-events-none absolute -left-24 top-1/3 w-[26rem] -rotate-[28deg]" style={{ opacity: 0.08 }} />
      <StoryVideo src={s.video.src} poster={s.video.poster} alt={s.video.alt} className="relative aspect-[9/16] rounded-[30px] shadow-[0_12px_28px_-16px_rgba(36,28,21,0.55)]" />
    </Reveal>
  );
}

export default function Stories() {
  if (stories.length === 0) return null;
  return (
    <div id="stories">
      {stories.map((s, i) => {
        const n = i + 1;
        const tone = TONES[s.tone ?? (i % 2 ? "cream" : "white")];
        if (s.layout === "wide") {
          return (
            <section key={s.id} id={`story-${s.id}`} className={cn("relative overflow-hidden py-16 md:py-24", tone)}>
              {/* Desktop: text beside the landscape clip; phones: text, then the clip. */}
              <div className="mx-auto grid max-w-shell grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-14">
                <Text s={s} n={n} />
                {s.video && (
                  <Reveal delay={0.06}>
                    <StoryVideo
                      src={s.video.src}
                      poster={s.video.poster}
                      alt={s.video.alt}
                      className="aspect-[4/3] w-full rounded-[28px] shadow-[0_12px_28px_-16px_rgba(36,28,21,0.55)] sm:aspect-video"
                    />
                  </Reveal>
                )}
              </div>
              {s.chips && s.chips.length > 0 && (
                <div lang="ml" className="mt-8 overflow-hidden md:mt-10" aria-hidden>
                  <div className="marquee-track flex w-max gap-3">
                    {[...s.chips, ...s.chips].map((c, k) => (
                      <span key={k} className="ml whitespace-nowrap rounded-full border border-[#2F6B3A]/20 bg-white/80 px-5 py-2 text-[0.95rem] text-[#2F6B3A]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        }
        const reverse = s.layout === "split-reverse";
        return (
          <section key={s.id} id={`story-${s.id}`} className={cn("relative overflow-hidden py-16 md:py-24", tone)}>
            <div className="mx-auto grid max-w-shell grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:gap-16">
              <div className={cn(!reverse && "lg:order-2")}>
                <Text s={s} n={n} />
              </div>
              <div className={cn(!reverse && "lg:order-1")}>
                <SplitMedia s={s} />
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
