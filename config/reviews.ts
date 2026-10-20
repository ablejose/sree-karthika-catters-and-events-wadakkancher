/** DERIVED — real reviews from the event config. Never invent testimonials. */
import { event } from "@/event.config";

export interface Review {
  name: string;
  rating: number;
  quote: string;
  source?: string;
}

export const reviews: Review[] = event.reviews;
