/** DERIVED — the quote-builder menu, optionally overridden per event. */
import { event } from "@/event.config";
import { templateMenu, templateMenuPresets } from "@/config/template";
import type { MenuItem } from "@/config/event-schema";

export const menu = event.overrides?.menu ?? templateMenu;

/** Presets keep only ids that exist in this event's menu. */
const ids = new Set(menu.flatMap((c) => c.items.map((i) => i.id)));
export const menuPresets = (event.overrides?.menuPresets ?? templateMenuPresets).map((p) => ({
  ...p,
  items: p.items.filter((id) => ids.has(id)),
}));

/** id -> item + its category, for the "Your menu" list and the WhatsApp message. */
export const menuIndex: Record<string, MenuItem & { category: string }> = Object.fromEntries(
  menu.flatMap((c) => c.items.map((i) => [i.id, { ...i, category: c.title }]))
);
