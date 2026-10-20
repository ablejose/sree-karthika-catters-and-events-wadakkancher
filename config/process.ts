/** DERIVED — shared "how we work" steps, optionally overridden per event. */
import { event } from "@/event.config";
import { templateProcess, type TemplateStep } from "@/config/template";

export const processSteps: TemplateStep[] = event.overrides?.process ?? templateProcess;
