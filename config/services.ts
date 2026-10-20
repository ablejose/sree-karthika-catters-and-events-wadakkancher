/** DERIVED — shared service cards, optionally overridden per event. */
import { event } from "@/event.config";
import { templateServices } from "@/config/template";
import { asset } from "@/lib/copy";

export interface Service {
  id: string;
  title: string;
  blurb: string;
  bullets: string[];
  image: string;
}

const overrides = event.overrides?.services;

export const services: Service[] = (overrides ?? templateServices).map((s, i) => ({
  id: s.id,
  title: s.title,
  blurb: s.blurb,
  bullets: s.bullets,
  image: s.image ? asset(s.image) : templateServices[i % templateServices.length].image,
}));
