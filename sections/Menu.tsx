"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Cookie,
  Drumstick,
  Flame,
  GlassWater,
  IceCreamBowl,
  Leaf,
  Minus,
  Plus,
  Salad,
  Sparkles,
  Trash2,
  UtensilsCrossed,
  Wheat,
  X,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { copy, waLink } from "@/config/site";
import { menu, menuPresets } from "@/config/menu";
import { t } from "@/lib/copy";
import { cn } from "@/lib/utils";

/**
 * THE MENU — a quote builder. Visitors walk the menu course by course (or start
 * from a classic), tap + to build their own menu card, set the guest count,
 * add a name and any special requests, and send it all to WhatsApp as a
 * ready-written quote request. Dishes come from config/menu.ts (shared Kerala
 * wedding menu, overridable per event). No prices on purpose.
 */
const GUESTS = { min: 50, max: 2000, step: 25, initial: 300 };
const GUEST_TICKS = [50, 500, 1000, 1500, 2000];
const EASE = [0.22, 1, 0.36, 1] as const;

/** Course icons for the shared menu ids; anything else gets the cutlery icon. */
const COURSE_ICONS: Record<string, LucideIcon> = {
  welcome: GlassWater,
  starters: Cookie,
  sadya: Leaf,
  "breads-rice": Wheat,
  "non-veg": Drumstick,
  "veg-mains": Salad,
  desserts: IceCreamBowl,
  live: Flame,
};
const iconFor = (id: string) => COURSE_ICONS[id] ?? UtensilsCrossed;

const c = copy.menu;

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function VegMark({ veg }: { veg?: boolean }) {
  if (veg === undefined) return null;
  return (
    <span
      title={veg ? c.veg : c.nonVeg}
      aria-label={veg ? c.veg : c.nonVeg}
      className={cn("mt-[0.45rem] grid h-3 w-3 shrink-0 place-items-center rounded-[2px] border", veg ? "border-[#2f7d4a]" : "border-[#9b2c2c]")}
    >
      <span className={cn("block h-1.5 w-1.5 rounded-full", veg ? "bg-[#2f7d4a]" : "bg-[#9b2c2c]")} />
    </span>
  );
}

export default function Menu() {
  const [catIdx, setCatIdx] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [guests, setGuests] = useState(GUESTS.initial);
  const [occasion, setOccasion] = useState<string>(c.eventTypes[0]);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [preset, setPreset] = useState<string | null>(null);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [inSection, setInSection] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);

  const pickedSet = useMemo(() => new Set(picked), [picked]);
  const active = menu[catIdx] ?? menu[0];
  const isLast = catIdx === menu.length - 1;

  const countIn = (i: number) => menu[i].items.filter((x) => pickedSet.has(x.id)).length;
  const activeCount = countIn(catIdx);
  const allIn = activeCount === active.items.length;

  const flash = (text: string) => setToast({ id: Date.now(), text });
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 1600);
    return () => window.clearTimeout(id);
  }, [toast]);

  const toggle = (id: string, label?: string) => {
    setPreset(null);
    const adding = !pickedSet.has(id);
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
    if (adding && label) flash(label);
  };

  const toggleAll = () => {
    setPreset(null);
    const ids = active.items.map((i) => i.id);
    setPicked((p) => (allIn ? p.filter((x) => !ids.includes(x)) : [...p, ...ids.filter((x) => !p.includes(x))]));
    if (!allIn) flash(active.title);
  };

  const applyPreset = (title: string, items: string[]) => {
    setPreset(title);
    setPicked(items);
    flash(title);
  };

  // Keep the active course tile in view inside the rail (phones; the desktop rail doesn't scroll).
  useEffect(() => {
    const rail = railRef.current;
    const tile = rail?.querySelector<HTMLElement>(`[data-idx="${catIdx}"]`);
    if (!rail || !tile || rail.scrollWidth <= rail.clientWidth) return;
    rail.scrollTo({ left: tile.offsetLeft - rail.clientWidth / 2 + tile.clientWidth / 2, behavior: "smooth" });
  }, [catIdx]);

  const goTo = (i: number) => {
    setCatIdx(i);
    const top = cardRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 60) cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToPanel = () => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Selected dishes grouped in menu order (not click order) — reads like a real menu card.
  const grouped = useMemo(
    () =>
      menu
        .map((m) => ({ id: m.id, title: m.title, items: m.items.filter((i) => pickedSet.has(i.id)) }))
        .filter((g) => g.items.length > 0),
    [pickedSet]
  );

  // Mobile helper bar: only while the menu is on screen and the quote panel isn't.
  useEffect(() => {
    const s = sectionRef.current;
    const p = panelRef.current;
    if (!s || !p) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.target === s) setInSection(e.isIntersecting);
          if (e.target === p) setPanelVisible(e.isIntersecting);
        }),
      { threshold: [0, 0.2] }
    );
    io.observe(s);
    io.observe(p);
    return () => io.disconnect();
  }, []);

  const pct = ((guests - GUESTS.min) / (GUESTS.max - GUESTS.min)) * 100;
  const nudge = (d: number) => setGuests((g) => Math.min(GUESTS.max, Math.max(GUESTS.min, g + d)));

  const send = () => {
    const lines = [t(copy.cta.waQuoteIntro), ""];
    if (name.trim()) lines.push(`${c.waName}: ${name.trim()}`);
    lines.push(`${c.waEvent}: ${occasion}`);
    lines.push(`${c.waGuests}: ${guests}`);
    if (date) lines.push(`${c.waDate}: ${formatDate(date)}`);
    lines.push("");
    if (grouped.length) {
      lines.push(`${c.waMenu} (${picked.length} ${picked.length === 1 ? "dish" : "dishes"}):`);
      grouped.forEach((g) => lines.push(`• ${g.title}: ${g.items.map((i) => i.name).join(", ")}`));
    } else {
      lines.push(`${c.waMenu}: please suggest one.`);
    }
    if (notes.trim()) lines.push("", `${c.waNotes}: ${notes.trim()}`);
    lines.push("", c.waOutro);
    window.open(waLink(lines.join("\n")), "_blank", "noopener,noreferrer");
  };

  const ActiveIcon = iconFor(active.id);
  const step = picked.length === 0 ? 0 : 1;

  return (
    <section ref={sectionRef} id="menu" data-hide-fab aria-labelledby="menu-heading" className="relative bg-cream py-16 md:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(196,137,46,0.45), transparent)" }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 top-10 h-[34rem] w-[34rem] rounded-full" style={{ background: "radial-gradient(circle, rgba(196,137,46,0.12) 0%, rgba(196,137,46,0) 70%)" }} />
        <div className="absolute -left-40 bottom-20 h-[30rem] w-[30rem] rounded-full" style={{ background: "radial-gradient(circle, rgba(196,137,46,0.08) 0%, rgba(196,137,46,0) 70%)" }} />
      </div>

      <div className="relative mx-auto max-w-shell px-6">
        {/* Heading + 3-step guide */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow eyebrow-center">{c.eyebrow}</p>
          <h2 id="menu-heading" className="display mt-4" style={{ fontSize: "clamp(2.1rem, 4.4vw, 3.6rem)" }}>
            {c.heading}
          </h2>
          <p className="body-copy mx-auto mt-4 max-w-xl">{t(c.body)}</p>
          <ol className="mx-auto mt-7 flex max-w-lg flex-wrap items-center justify-center gap-2 font-sans text-[0.72rem] font-medium sm:gap-3 sm:text-xs">
            {c.steps.map((s, i) => (
              <li key={s} className="flex items-center gap-2 sm:gap-3">
                <span className={cn("flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors", i <= step ? "bg-espresso text-ivory" : "bg-white text-muted ring-1 ring-sand")}>
                  <span className={cn("grid h-4 w-4 place-items-center rounded-full text-[0.6rem]", i <= step ? "bg-saffron text-espresso" : "bg-sand text-ink/60")}>{i + 1}</span>
                  {s}
                </span>
                {i < c.steps.length - 1 && <span className="hidden h-px w-5 bg-sand sm:block" />}
              </li>
            ))}
          </ol>
        </Reveal>

        {/* Presets */}
        {menuPresets.length > 0 && (
          <Reveal className="mt-10" delay={0.05}>
            <p className="text-center font-sans text-[0.7rem] font-medium uppercase tracking-[0.24em] text-muted">{c.presetsLabel}</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {menuPresets.map((p) => {
                const on = preset === p.title;
                return (
                  <button
                    key={p.title}
                    type="button"
                    onClick={() => applyPreset(p.title, p.items)}
                    aria-pressed={on}
                    className={cn(
                      "group flex items-center justify-between gap-4 rounded-brand border px-5 py-4 text-left transition-all duration-300",
                      on ? "border-espresso bg-espresso text-ivory shadow-[0_18px_40px_-24px_rgba(36,28,21,0.8)]" : "border-sand bg-white hover:-translate-y-0.5 hover:border-saffron/60"
                    )}
                  >
                    <span>
                      <span className={cn("block font-display text-lg", on ? "text-ivory" : "text-espresso")}>{p.title}</span>
                      <span className={cn("mt-0.5 block font-sans text-xs", on ? "text-ivory/70" : "text-muted")}>
                        {p.note} · {p.items.length} dishes
                      </span>
                    </span>
                    {on ? <Check size={18} className="text-saffron" /> : <Sparkles size={18} className="text-saffron-2/60 transition-colors group-hover:text-saffron-2" />}
                  </button>
                );
              })}
            </div>
          </Reveal>
        )}

        {/* COURSE RAIL — sticky on phones so switching course is always one tap away */}
        <div className="sticky top-[74px] z-20 -mx-6 mt-10 bg-cream/90 px-6 py-3 backdrop-blur-md lg:static lg:mx-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-0">
          <div
            ref={railRef}
            role="tablist"
            aria-label="Menu courses"
            data-lenis-prevent
            className="flex snap-x gap-2 overflow-x-auto [scrollbar-width:none] lg:grid lg:grid-cols-8 lg:gap-3 lg:overflow-visible lg:pt-1 [&::-webkit-scrollbar]:hidden"
          >
            {menu.map((m, i) => {
              const on = i === catIdx;
              const n = countIn(i);
              const Icon = iconFor(m.id);
              return (
                <button
                  key={m.id}
                  data-idx={i}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  aria-controls="menu-panel"
                  onClick={() => goTo(i)}
                  className={cn(
                    "group relative flex w-[6.6rem] shrink-0 snap-start flex-col items-center gap-2 rounded-2xl border px-2 pb-3 pt-3.5 text-center transition-all duration-300 lg:w-auto",
                    on
                      ? "border-espresso bg-espresso text-ivory shadow-[0_18px_36px_-20px_rgba(36,28,21,0.9)] lg:-translate-y-1"
                      : "border-sand bg-white text-espresso hover:-translate-y-0.5 hover:border-saffron/60"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-11 w-11 place-items-center rounded-full transition-colors",
                      on ? "bg-saffron text-espresso" : n > 0 ? "bg-[var(--saffron-soft)] text-saffron-2" : "bg-cream text-saffron-2 group-hover:bg-[var(--saffron-soft)]"
                    )}
                  >
                    <Icon size={20} strokeWidth={1.7} />
                  </span>
                  <span className="font-sans text-[0.72rem] font-semibold leading-tight">{m.title}</span>
                  <span className={cn("font-sans text-[0.62rem]", on ? "text-ivory/60" : "text-muted")}>
                    {n > 0 ? `${n}/${m.items.length} ${c.picked}` : `${m.items.length} dishes`}
                  </span>
                  {n > 0 && (
                    <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-saffron text-espresso">
                      <Check size={11} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-10">
          {/* MENU CARD — one course in focus */}
          <div ref={cardRef} className="scroll-mt-48 lg:scroll-mt-24">
            <div className="relative rounded-[24px] border border-sand bg-white p-2 shadow-[0_40px_80px_-50px_rgba(36,28,21,0.5)]">
              <div className="rounded-[18px] border border-saffron/25 px-5 pb-5 pt-6 md:px-9 md:pb-7 md:pt-8">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active.id}
                    id="menu-panel"
                    role="tabpanel"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    {/* Course header */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-espresso text-saffron">
                          <ActiveIcon size={26} strokeWidth={1.6} />
                        </span>
                        <div>
                          <p className="font-sans text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-saffron-2">
                            {c.courseLabel} {String(catIdx + 1).padStart(2, "0")} {c.of} {String(menu.length).padStart(2, "0")}
                          </p>
                          <h3 className="mt-1 font-display text-[2rem] italic leading-none text-espresso md:text-[2.5rem]">{active.title}</h3>
                          {active.ml && <p className="mt-2 font-sans text-sm text-saffron-2">{active.ml}</p>}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={toggleAll}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-sans text-xs font-semibold transition-colors",
                          allIn ? "border-espresso/20 text-muted hover:border-espresso/40" : "border-saffron bg-[var(--saffron-soft)] text-saffron-2 hover:bg-saffron hover:text-espresso"
                        )}
                      >
                        {allIn ? <X size={13} /> : <Plus size={13} />}
                        {allIn ? c.removeAll : `${c.addAll} ${active.items.length}`}
                      </button>
                    </div>

                    {/* Progress for this course */}
                    <div className="mt-5 h-1 overflow-hidden rounded-full bg-sand/70">
                      <motion.div className="h-full rounded-full bg-saffron" animate={{ width: `${(activeCount / active.items.length) * 100}%` }} transition={{ duration: 0.4, ease: EASE }} />
                    </div>

                    <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 md:gap-x-10 lg:grid-cols-1 xl:grid-cols-2">
                      {active.items.map((item) => {
                        const on = pickedSet.has(item.id);
                        return (
                          <li key={item.id} className="border-b border-dashed border-sand/90">
                            <button
                              type="button"
                              onClick={() => toggle(item.id, item.name)}
                              aria-pressed={on}
                              aria-label={`${on ? c.remove : c.add} ${item.name}`}
                              className={cn(
                                "group -mx-2 flex w-[calc(100%+1rem)] items-start gap-3 rounded-xl px-2 py-4 text-left transition-colors",
                                on ? "bg-[rgba(196,137,46,0.08)]" : "hover:bg-cream"
                              )}
                            >
                              <VegMark veg={item.veg} />
                              <span className="min-w-0 flex-1">
                                <span className={cn("block font-display text-[1.14rem] leading-snug transition-colors", on ? "text-saffron-2" : "text-espresso")}>{item.name}</span>
                                {item.ml && <span className="mt-0.5 block font-sans text-[0.8rem] text-saffron-2/90">{item.ml}</span>}
                                {item.note && <span className="mt-0.5 block font-sans text-[0.8rem] leading-relaxed text-muted">{item.note}</span>}
                              </span>
                              <motion.span
                                aria-hidden
                                animate={on ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                                transition={{ duration: 0.35 }}
                                className={cn(
                                  "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors duration-300",
                                  on
                                    ? "border-saffron bg-saffron text-espresso shadow-[0_8px_20px_-8px_rgba(196,137,46,0.8)]"
                                    : "border-sand bg-white text-espresso group-hover:border-saffron group-hover:bg-[var(--saffron-soft)]"
                                )}
                              >
                                {on ? <Check size={16} strokeWidth={2.4} /> : <Plus size={16} strokeWidth={2} />}
                              </motion.span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                </AnimatePresence>

                {/* Course navigation */}
                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => goTo(catIdx - 1)}
                    disabled={catIdx === 0}
                    className="inline-flex items-center gap-2 rounded-full px-3 py-2.5 font-sans text-sm text-muted transition-colors hover:text-espresso disabled:pointer-events-none disabled:opacity-0"
                  >
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">{menu[catIdx - 1]?.title ?? c.prev}</span>
                    <span className="sm:hidden">{c.prev}</span>
                  </button>
                  {isLast ? (
                    <button
                      type="button"
                      onClick={scrollToPanel}
                      className="inline-flex items-center gap-2 rounded-full bg-saffron px-5 py-3 font-sans text-sm font-semibold text-espresso transition-all hover:-translate-y-0.5 hover:brightness-110 lg:hidden"
                    >
                      {c.done} <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => goTo(catIdx + 1)}
                      className="group inline-flex items-center gap-3 rounded-full bg-espresso py-2.5 pl-5 pr-2.5 font-sans text-sm font-medium text-ivory transition-all hover:-translate-y-0.5"
                    >
                      <span className="text-left leading-tight">
                        <span className="block text-[0.62rem] uppercase tracking-[0.18em] text-ivory/55">{c.next}</span>
                        {menu[catIdx + 1].title}
                      </span>
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-saffron text-espresso transition-transform group-hover:translate-x-0.5">
                        <ArrowRight size={15} />
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* QUOTE PANEL — the visitor's own menu card. On desktop it sticks, scrolls inside, and keeps the button in view. */}
          <div ref={panelRef} className="scroll-mt-24 lg:sticky lg:top-24">
            <div className="flex flex-col overflow-hidden rounded-[24px] bg-espresso text-ivory shadow-[0_40px_80px_-40px_rgba(36,28,21,0.9)] lg:max-h-[calc(100svh-7.5rem)]">
              <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-color:rgba(196,137,46,0.5)_transparent] [scrollbar-width:thin]" data-lenis-prevent>
                {/* Card header */}
                <div className="relative px-6 pb-4 pt-6 text-center">
                  <span aria-hidden className="mx-auto block h-px w-16 bg-saffron/60" />
                  <p className="mt-3 font-display text-[1.7rem] italic leading-none">{c.listTitle}</p>
                  <label htmlFor="menu-name" className="sr-only">
                    {c.nameLabel}
                  </label>
                  <input
                    id="menu-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={c.namePlaceholder}
                    maxLength={60}
                    className="mx-auto mt-3 block w-full max-w-[16rem] border-b border-dashed border-ivory/20 bg-transparent pb-1 text-center font-display text-base italic text-saffron outline-none placeholder:font-sans placeholder:text-sm placeholder:not-italic placeholder:text-ivory/30 focus:border-saffron"
                  />
                  {picked.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setPicked([]);
                        setPreset(null);
                      }}
                      className="absolute right-5 top-5 inline-flex items-center gap-1 font-sans text-[0.7rem] text-ivory/50 transition-colors hover:text-ivory"
                    >
                      <Trash2 size={12} /> {c.clear}
                    </button>
                  )}
                </div>

                {/* Courses covered */}
                <div className="px-6">
                  <p className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-ivory/45">{c.coverage}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {menu.map((m, i) => {
                      const Icon = iconFor(m.id);
                      const n = countIn(i);
                      return (
                        <button
                          key={m.id}
                          type="button"
                          title={m.title}
                          aria-label={`${m.title}: ${n} ${c.picked}`}
                          onClick={() => goTo(i)}
                          className={cn(
                            "grid h-8 w-8 place-items-center rounded-full border transition-colors",
                            n > 0 ? "border-saffron bg-saffron text-espresso" : "border-ivory/15 text-ivory/35 hover:border-ivory/40"
                          )}
                        >
                          <Icon size={14} strokeWidth={1.8} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected dishes */}
                <div className="mt-4 px-6">
                  {grouped.length === 0 ? (
                    <p className="rounded-brand border border-dashed border-ivory/15 px-4 py-5 text-center font-sans text-sm leading-relaxed text-ivory/55">{c.listEmpty}</p>
                  ) : (
                    <AnimatePresence initial={false}>
                      {grouped.map((g) => (
                        <motion.div key={g.id} layout="position" className="mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <p className="flex items-center gap-2 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-saffron/90">
                            {g.title}
                            <span className="h-px flex-1 bg-ivory/10" />
                          </p>
                          <ul className="mt-1">
                            <AnimatePresence initial={false}>
                              {g.items.map((i) => (
                                <motion.li
                                  key={i.id}
                                  layout="position"
                                  initial={{ opacity: 0, x: 12 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -12 }}
                                  transition={{ duration: 0.25, ease: EASE }}
                                  className="flex items-center justify-between gap-3 py-0.5"
                                >
                                  <span className="font-display text-[0.98rem] text-ivory/90">{i.name}</span>
                                  <button
                                    type="button"
                                    aria-label={`${c.remove} ${i.name}`}
                                    onClick={() => toggle(i.id)}
                                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-ivory/35 transition-colors hover:bg-ivory/10 hover:text-ivory"
                                  >
                                    <X size={13} />
                                  </button>
                                </motion.li>
                              ))}
                            </AnimatePresence>
                          </ul>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>

                <div className="mt-4 border-t border-ivory/10 px-6 pb-5 pt-5">
                  {/* Guests slider */}
                  <div className="flex items-end justify-between">
                    <label htmlFor="menu-guests" className="font-sans text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ivory/55">
                      {c.guestsLabel}
                    </label>
                    <p className="font-display text-3xl leading-none text-ivory">
                      {guests}
                      <span className="ml-1.5 font-sans text-xs text-ivory/50">{c.guestsUnit}</span>
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Fewer guests"
                      onClick={() => nudge(-GUESTS.step)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ivory/20 text-ivory/80 hover:border-saffron hover:text-saffron"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      id="menu-guests"
                      type="range"
                      min={GUESTS.min}
                      max={GUESTS.max}
                      step={GUESTS.step}
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="guest-range w-full"
                      style={{ "--fill": `${pct}%` } as React.CSSProperties}
                      aria-valuetext={`${guests} ${c.guestsUnit}`}
                    />
                    <button
                      type="button"
                      aria-label="More guests"
                      onClick={() => nudge(GUESTS.step)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ivory/20 text-ivory/80 hover:border-saffron hover:text-saffron"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  {/* Tick labels sit at their real position on the track (thumb is 22px wide). */}
                  <div className="relative mx-11 mt-2 h-4 font-sans text-[0.65rem] text-ivory/40">
                    {GUEST_TICKS.map((v) => {
                      const at = (v - GUESTS.min) / (GUESTS.max - GUESTS.min);
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setGuests(v)}
                          className="absolute top-0 -translate-x-1/2 hover:text-saffron"
                          style={{ left: `calc(${at * 100}% + ${11 - at * 22}px)` }}
                        >
                          {v >= 1000 ? `${v / 1000}k` : v}
                        </button>
                      );
                    })}
                  </div>

                  {/* Occasion */}
                  <p className="mt-6 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ivory/55">{c.eventLabel}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {c.eventTypes.map((ev) => (
                      <button
                        key={ev}
                        type="button"
                        aria-pressed={occasion === ev}
                        onClick={() => setOccasion(ev)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 font-sans text-xs transition-colors",
                          occasion === ev ? "border-saffron bg-saffron text-espresso" : "border-ivory/20 text-ivory/75 hover:border-ivory/50"
                        )}
                      >
                        {ev}
                      </button>
                    ))}
                  </div>

                  {/* Date */}
                  <label htmlFor="menu-date" className="mt-6 block font-sans text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ivory/55">
                    {c.dateLabel} <span className="normal-case tracking-normal text-ivory/35">({c.dateOptional})</span>
                  </label>
                  <input
                    id="menu-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-ivory/15 bg-ivory/5 px-4 py-2.5 font-sans text-sm text-ivory outline-none [color-scheme:dark] focus:border-saffron"
                  />

                  {/* Special requests */}
                  <label htmlFor="menu-notes" className="mt-6 block font-sans text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ivory/55">
                    {c.notesLabel} <span className="normal-case tracking-normal text-ivory/35">({c.dateOptional})</span>
                  </label>
                  <textarea
                    id="menu-notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={c.notesPlaceholder}
                    className="mt-2 w-full resize-none rounded-xl border border-ivory/15 bg-ivory/5 px-4 py-2.5 font-sans text-sm text-ivory outline-none placeholder:text-ivory/30 focus:border-saffron"
                  />
                </div>
              </div>

              {/* Always-visible call to action */}
              <div className="border-t border-ivory/10 bg-[#1c150f] px-6 pb-5 pt-4">
                <button
                  type="button"
                  onClick={send}
                  className="quote-cta group relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-full bg-saffron py-2.5 pl-6 pr-2.5 text-left text-espresso transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-14px_rgba(196,137,46,0.75)]"
                >
                  <span className="relative z-10 min-w-0 leading-tight">
                    <span className="block font-sans text-[0.95rem] font-bold">{c.submit}</span>
                    <span className="block truncate font-sans text-[0.7rem] font-medium text-espresso/75">
                      {picked.length > 0 ? `${picked.length} ${picked.length === 1 ? "dish" : "dishes"}` : "Menu to suggest"} · {guests} {c.guestsUnit} · {occasion}
                    </span>
                  </span>
                  <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-espresso text-[#25D366] transition-transform duration-300 group-hover:scale-105">
                    <WhatsAppIcon size={20} />
                  </span>
                </button>
                <p className="mt-2.5 text-center font-sans text-[0.68rem] text-ivory/45">{c.submitNote}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: a small confirmation when a dish lands on the menu card */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="pointer-events-none fixed bottom-6 left-1/2 z-[66] hidden -translate-x-1/2 items-center gap-2 rounded-full bg-espresso px-4 py-2.5 font-sans text-xs text-ivory shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)] lg:flex"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-saffron text-espresso">
              <Check size={12} strokeWidth={3} />
            </span>
            <strong className="font-semibold">{toast.text}</strong> {c.toastAdded}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile: quick jump to the quote panel once dishes are picked */}
      <AnimatePresence>
        {picked.length > 0 && inSection && !panelVisible && (
          <motion.button
            type="button"
            onClick={scrollToPanel}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed bottom-5 left-4 right-4 z-[65] mx-auto max-w-md flex items-center justify-between gap-3 rounded-full bg-espresso py-2.5 pl-5 pr-2.5 text-left text-ivory shadow-[0_20px_40px_-16px_rgba(0,0,0,0.6)] lg:hidden"
          >
            <span className="min-w-0 truncate font-sans text-xs">
              {toast ? (
                <>
                  <strong className="font-semibold text-saffron">+</strong> {toast.text}
                </>
              ) : (
                <>
                  <strong className="font-semibold text-saffron">{picked.length}</strong> dishes · {guests} {c.guestsUnit}
                </>
              )}
            </span>
            <span className="shrink-0 rounded-full bg-saffron px-4 py-2 font-sans text-xs font-semibold text-espresso">{c.mobileBarCta}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}
