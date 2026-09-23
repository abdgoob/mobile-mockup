export type ExperienceView = "landing" | "planner" | "success";
export type PlannerStep = 1 | 2 | 3;

export type OptionIcon =
  | "air"
  | "audio"
  | "droplets"
  | "move"
  | "sparkles"
  | "sun"
  | "sofa"
  | "cooking"
  | "bed"
  | "bath"
  | "basement"
  | "home"
  | "plus"
  | "help";

export interface PlannerOption {
  id: string;
  label: string;
  icon?: OptionIcon;
}

export interface PhotoSelection {
  name: string;
  url: string;
}

export interface PlannerDraft {
  goals: string[];
  rooms: string[];
  windowCount: string;
  styles: string[];
  materials: string[];
  photo: PhotoSelection | null;
  zip: string;
  timing: string;
  name: string;
  phone: string;
  email: string;
  marketingSms: boolean;
}

export type PlannerErrors = Partial<Record<keyof PlannerDraft, string>>;
