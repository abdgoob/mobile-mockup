import type { PlannerDraft, PlannerOption } from "@/types/project-planner";

export const phoneDisplay = "847-562-1212";
export const phoneHref = "tel:+18475621212";
export const draftStorageKey = "mccann-window-planner-v1";

export const initialDraft: PlannerDraft = {
  goals: [],
  rooms: [],
  windowCount: "",
  styles: [],
  materials: [],
  photo: null,
  zip: "",
  timing: "",
  name: "",
  phone: "",
  email: "",
  marketingSms: false,
};

export const improvementOptions: PlannerOption[] = [
  { id: "drafts", label: "Drafts", icon: "air" },
  { id: "noise", label: "Noise", icon: "audio" },
  { id: "condensation", label: "Condensation", icon: "droplets" },
  { id: "hard-to-open", label: "Hard to open", icon: "move" },
  { id: "appearance", label: "Appearance", icon: "sparkles" },
  { id: "natural-light", label: "More natural light", icon: "sun" },
];

export const roomOptions: PlannerOption[] = [
  { id: "living-room", label: "Living room", icon: "sofa" },
  { id: "kitchen", label: "Kitchen", icon: "cooking" },
  { id: "bedroom", label: "Bedroom", icon: "bed" },
  { id: "bathroom", label: "Bathroom", icon: "bath" },
  { id: "basement", label: "Basement", icon: "basement" },
  { id: "whole-home", label: "Whole home", icon: "home" },
  { id: "other", label: "Other", icon: "plus" },
  { id: "not-sure", label: "I’m not sure", icon: "help" },
];

export const windowCountOptions: PlannerOption[] = [
  { id: "1", label: "1 window" },
  { id: "2-3", label: "2–3" },
  { id: "4-6", label: "4–6" },
  { id: "7-10", label: "7–10" },
  { id: "11+", label: "11+" },
  { id: "not-sure", label: "I’m not sure" },
];

export const styleOptions: PlannerOption[] = [
  { id: "double-hung", label: "Double-hung" },
  { id: "casement-awning", label: "Casement / awning" },
  { id: "picture", label: "Picture windows" },
  { id: "bay-bow", label: "Bay / bow" },
  { id: "sliding", label: "Sliding" },
  { id: "not-sure", label: "I’m not sure" },
];

export const materialOptions: PlannerOption[] = [
  { id: "wood", label: "Wood" },
  { id: "fiberglass", label: "Fiberglass" },
  { id: "vinyl", label: "Vinyl" },
  { id: "composite", label: "Composite" },
  { id: "not-sure", label: "I’m not sure" },
];

export const timingOptions: PlannerOption[] = [
  { id: "asap", label: "As soon as possible" },
  { id: "within-3-months", label: "Within 3 months" },
  { id: "3-6-months", label: "3–6 months" },
  { id: "6-plus-months", label: "6+ months" },
  { id: "researching", label: "Just researching" },
];

export function optionLabel(options: PlannerOption[], id: string) {
  return options.find((option) => option.id === id)?.label ?? id;
}
