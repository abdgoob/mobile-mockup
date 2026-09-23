"use client";

/* eslint-disable @next/next/no-img-element -- local blob previews are intentionally not sent through image optimization */

import { useRef, useState, type ComponentType, type ChangeEvent, type SVGProps } from "react";
import {
  ArrowLeft, ArrowRight, Bath, BedDouble, Check, ChefHat, CircleHelp,
  Droplets, House, Info, LockKeyhole, MoveHorizontal, Plus, Sofa,
  Sparkles, Sun, Upload, Volume2, Warehouse, Wind, X,
} from "lucide-react";

import { BrandLockup } from "@/components/consultation/landing-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  improvementOptions, materialOptions, roomOptions, styleOptions,
  timingOptions, windowCountOptions,
} from "@/data/project-content";
import type {
  OptionIcon, PlannerDraft, PlannerErrors, PlannerOption, PlannerStep,
} from "@/types/project-planner";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const iconMap: Record<OptionIcon, IconComponent> = {
  air: Wind,
  audio: Volume2,
  droplets: Droplets,
  move: MoveHorizontal,
  sparkles: Sparkles,
  sun: Sun,
  sofa: Sofa,
  cooking: ChefHat,
  bed: BedDouble,
  bath: Bath,
  basement: Warehouse,
  home: House,
  plus: Plus,
  help: CircleHelp,
};

interface PlannerViewProps {
  draft: PlannerDraft;
  errors: PlannerErrors;
  step: PlannerStep;
  onBack: () => void;
  onContinue: () => void;
  onSubmit: () => void;
  onUpdate: (changes: Partial<PlannerDraft>) => void;
}

function OptionGrid({
  options,
  selected,
  fieldName,
  onChange,
  compact = false,
  error,
}: {
  options: PlannerOption[];
  selected: string[];
  fieldName: keyof PlannerDraft;
  onChange: (value: string) => void;
  compact?: boolean;
  error?: string;
}) {
  return (
    <div
      className={`grid gap-2.5 ${compact ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"}`}
      aria-describedby={error ? `error-${String(fieldName)}` : undefined}
    >
      {options.map((option, index) => {
        const isSelected = selected.includes(option.id);
        const Icon = option.icon ? iconMap[option.icon] : null;
        return (
          <button
            key={option.id}
            id={index === 0 ? `field-${String(fieldName)}` : undefined}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(option.id)}
            className={`relative flex min-h-14 items-center gap-3 rounded-[11px] border px-3.5 py-3 text-left text-sm font-semibold outline-none transition focus-visible:ring-3 focus-visible:ring-[#d66a2c]/30 ${
              isSelected
                ? "border-[#d66a2c] bg-[#fff7f1] text-[#17343d] shadow-[inset_0_0_0_1px_#d66a2c]"
                : "border-[#d9ded9] bg-white text-[#3e555c] hover:border-[#aebbb7]"
            }`}
          >
            {Icon ? <Icon className={`size-[18px] shrink-0 ${isSelected ? "text-[#d66a2c]" : "text-[#728388]"}`} aria-hidden="true" /> : null}
            <span>{option.label}</span>
            {isSelected ? (
              <span className="absolute top-2 right-2 grid size-4 place-items-center rounded-full bg-[#d66a2c] text-white">
                <Check className="size-2.5" aria-hidden="true" />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function SingleChoiceGrid({
  options,
  value,
  fieldName,
  onChange,
  error,
}: {
  options: PlannerOption[];
  value: string;
  fieldName: keyof PlannerDraft;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3" role="radiogroup" aria-describedby={error ? `error-${String(fieldName)}` : undefined}>
      {options.map((option, index) => {
        const isSelected = value === option.id;
        return (
          <button
            key={option.id}
            id={index === 0 ? `field-${String(fieldName)}` : undefined}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.id)}
            className={`relative min-h-12 rounded-[10px] border px-3 py-2.5 text-sm font-semibold outline-none transition focus-visible:ring-3 focus-visible:ring-[#d66a2c]/30 ${
              isSelected
                ? "border-[#d66a2c] bg-[#fff7f1] text-[#17343d] shadow-[inset_0_0_0_1px_#d66a2c]"
                : "border-[#d9ded9] bg-white text-[#52666b] hover:border-[#aebbb7]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function FieldError({ name, message }: { name: keyof PlannerDraft; message?: string }) {
  if (!message) return null;
  return (
    <p id={`error-${String(name)}`} className="mt-2 text-sm font-semibold text-[#a43d1d]" role="alert">
      {message}
    </p>
  );
}

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="mb-8">
      <p className="text-xs font-extrabold tracking-[0.16em] text-[#b9531f] uppercase">{eyebrow}</p>
      <h1 className="text-balance mt-3 text-[2rem] leading-[1.08] font-extrabold tracking-[-0.04em] text-[#17343d] sm:text-4xl">{title}</h1>
      <p className="mt-3 text-[15px] leading-6 text-[#66777c]">{copy}</p>
    </div>
  );
}

export function PlannerView({
  draft, errors, step, onBack, onContinue, onSubmit, onUpdate,
}: PlannerViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoError, setPhotoError] = useState("");
  const stepLabels = ["Project details", "Preferences", "Contact"];

  const toggleMulti = (key: "goals" | "rooms" | "styles" | "materials", value: string) => {
    const current = draft[key];
    if (value === "not-sure") {
      onUpdate({ [key]: current.includes(value) ? [] : [value] });
      return;
    }
    const withoutUnsure = current.filter((item) => item !== "not-sure");
    onUpdate({
      [key]: withoutUnsure.includes(value)
        ? withoutUnsure.filter((item) => item !== value)
        : [...withoutUnsure, value],
    });
  };

  const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoError("Choose a JPEG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPhotoError("Choose an image smaller than 10 MB.");
      event.target.value = "";
      return;
    }
    setPhotoError("");
    onUpdate({ photo: { name: file.name, url: URL.createObjectURL(file) } });
  };

  const removePhoto = () => {
    onUpdate({ photo: null });
    setPhotoError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      <header className="border-b border-[#17343d]/8 bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5">
          <BrandLockup />
          <span className="rounded-full bg-[#e8eeec] px-3 py-1.5 text-[11px] font-extrabold tracking-[0.1em] text-[#29464e] uppercase">
            Project planner
          </span>
        </div>
      </header>

      <div className="border-b border-[#17343d]/8 bg-white px-5 py-4">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between text-xs font-bold text-[#66777c]">
            <span>Step {step} of 3</span>
            <span>{stepLabels[step - 1]}</span>
          </div>
          <div className="mt-2.5 grid grid-cols-3 gap-2" aria-hidden="true">
            {[1, 2, 3].map((item) => (
              <span key={item} className={`h-1.5 rounded-full transition-colors ${item <= step ? "bg-[#d66a2c]" : "bg-[#d9ded9]"}`} />
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-5 pb-32 pt-8 sm:pt-10">
        <div key={step} className="animate-view-in">
          {step === 1 ? (
            <>
              <SectionHeading
                eyebrow="Step 1 · Your home"
                title="What would you like to improve?"
                copy="Choose as many as apply. You don’t need to diagnose the window—we’ll start with what you notice."
              />
              <fieldset>
                <legend className="mb-3 text-base font-bold text-[#17343d]">What are you noticing?</legend>
                <OptionGrid options={improvementOptions} selected={draft.goals} fieldName="goals" onChange={(value) => toggleMulti("goals", value)} error={errors.goals} />
                <FieldError name="goals" message={errors.goals} />
              </fieldset>
              <fieldset className="mt-9">
                <legend className="mb-1 text-base font-bold text-[#17343d]">Which rooms are you thinking about?</legend>
                <p className="mb-3 text-sm text-[#66777c]">Select all that apply.</p>
                <OptionGrid options={roomOptions} selected={draft.rooms} fieldName="rooms" onChange={(value) => toggleMulti("rooms", value)} error={errors.rooms} />
                <FieldError name="rooms" message={errors.rooms} />
              </fieldset>
              <fieldset className="mt-9">
                <legend className="mb-3 text-base font-bold text-[#17343d]">Approximately how many windows?</legend>
                <SingleChoiceGrid options={windowCountOptions} value={draft.windowCount} fieldName="windowCount" onChange={(windowCount) => onUpdate({ windowCount })} error={errors.windowCount} />
                <FieldError name="windowCount" message={errors.windowCount} />
              </fieldset>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <SectionHeading
                eyebrow="Step 2 · Optional"
                title="Any preferences so far?"
                copy="Skip anything you’re unsure about. McCann can help assess the right options during your consultation."
              />
              <div className="mb-7 flex gap-3 rounded-[12px] border border-[#cfdad6] bg-[#edf3f1] p-4 text-sm leading-6 text-[#3e555c]">
                <Info className="mt-0.5 size-5 shrink-0 text-[#d66a2c]" aria-hidden="true" />
                <p>You don’t need to know a window style or material to continue.</p>
              </div>
              <fieldset>
                <legend className="mb-1 text-base font-bold text-[#17343d]">Window styles</legend>
                <p className="mb-3 text-sm text-[#66777c]">Optional · choose any that interest you.</p>
                <OptionGrid options={styleOptions} selected={draft.styles} fieldName="styles" onChange={(value) => toggleMulti("styles", value)} compact />
              </fieldset>
              <fieldset className="mt-9">
                <legend className="mb-1 text-base font-bold text-[#17343d]">Frame materials</legend>
                <p className="mb-3 text-sm text-[#66777c]">Optional · it’s completely fine to be unsure.</p>
                <OptionGrid options={materialOptions} selected={draft.materials} fieldName="materials" onChange={(value) => toggleMulti("materials", value)} compact />
              </fieldset>
              <section className="mt-9" aria-labelledby="photo-heading">
                <h2 id="photo-heading" className="text-base font-bold text-[#17343d]">Add a photo of your current windows</h2>
                <p className="mt-1 text-sm text-[#66777c]">Optional · stays on this device in this prototype.</p>
                <input ref={fileInputRef} id="window-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto} className="sr-only" />
                {draft.photo ? (
                  <div className="mt-4 overflow-hidden rounded-[12px] border border-[#d9ded9] bg-white">
                    <img src={draft.photo.url} alt="Preview of the selected current window" className="aspect-[16/9] w-full object-cover" />
                    <div className="flex items-center justify-between gap-3 p-3">
                      <span className="min-w-0 truncate text-sm font-semibold text-[#3e555c]">{draft.photo.name}</span>
                      <button type="button" onClick={removePhoto} className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-lg px-2 text-sm font-bold text-[#a43d1d] outline-none hover:bg-[#fff1eb] focus-visible:ring-3 focus-visible:ring-[#d66a2c]/30">
                        <X className="size-4" aria-hidden="true" /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label htmlFor="window-photo" className="mt-4 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-[12px] border border-dashed border-[#aebbb7] bg-white px-4 text-center outline-none transition hover:border-[#d66a2c] hover:bg-[#fffaf6] focus-within:ring-3 focus-within:ring-[#d66a2c]/30">
                    <span className="grid size-9 place-items-center rounded-full bg-[#f3dfd2] text-[#b9531f]"><Upload className="size-4" aria-hidden="true" /></span>
                    <span className="mt-2 text-sm font-bold text-[#29464e]">Choose a photo</span>
                    <span className="mt-1 text-xs text-[#728388]">JPEG, PNG, or WebP · up to 10 MB</span>
                  </label>
                )}
                {photoError ? <p className="mt-2 text-sm font-semibold text-[#a43d1d]" role="alert">{photoError}</p> : null}
              </section>
            </>
          ) : null}

          {step === 3 ? (
            <form onSubmit={(event) => { event.preventDefault(); onSubmit(); }} noValidate>
              <SectionHeading
                eyebrow="Step 3 · Final step"
                title="Where should McCann follow up?"
                copy="Your project details are ready. Add your contact information to complete this consultation request."
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="field-zip" className="mb-2 text-sm font-bold text-[#17343d]">ZIP code</Label>
                  <Input id="field-zip" value={draft.zip} onChange={(event) => onUpdate({ zip: event.target.value.replace(/\\D/g, "").slice(0, 5) })} inputMode="numeric" autoComplete="postal-code" placeholder="60062" aria-invalid={Boolean(errors.zip)} aria-describedby={errors.zip ? "error-zip" : undefined} className="h-12 rounded-[10px] bg-white px-3.5 text-base" />
                  <FieldError name="zip" message={errors.zip} />
                </div>
                <div>
                  <Label htmlFor="field-timing" className="mb-2 text-sm font-bold text-[#17343d]">Project timing</Label>
                  <select id="field-timing" value={draft.timing} onChange={(event) => onUpdate({ timing: event.target.value })} aria-invalid={Boolean(errors.timing)} aria-describedby={errors.timing ? "error-timing" : undefined} className="h-12 w-full rounded-[10px] border border-[#cbd3d0] bg-white px-3.5 text-base text-[#17343d] outline-none focus:border-[#d66a2c] focus:ring-3 focus:ring-[#d66a2c]/20">
                    <option value="">Choose timing</option>
                    {timingOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                  </select>
                  <FieldError name="timing" message={errors.timing} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="field-name" className="mb-2 text-sm font-bold text-[#17343d]">Name</Label>
                  <Input id="field-name" value={draft.name} onChange={(event) => onUpdate({ name: event.target.value })} autoComplete="name" placeholder="Your name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "error-name" : undefined} className="h-12 rounded-[10px] bg-white px-3.5 text-base" />
                  <FieldError name="name" message={errors.name} />
                </div>
                <div>
                  <Label htmlFor="field-phone" className="mb-2 text-sm font-bold text-[#17343d]">Phone</Label>
                  <Input id="field-phone" type="tel" value={draft.phone} onChange={(event) => onUpdate({ phone: event.target.value })} inputMode="tel" autoComplete="tel" placeholder="(847) 555-0123" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "error-phone" : undefined} className="h-12 rounded-[10px] bg-white px-3.5 text-base" />
                  <FieldError name="phone" message={errors.phone} />
                </div>
                <div>
                  <Label htmlFor="field-email" className="mb-2 text-sm font-bold text-[#17343d]">Email</Label>
                  <Input id="field-email" type="email" value={draft.email} onChange={(event) => onUpdate({ email: event.target.value })} inputMode="email" autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "error-email" : undefined} className="h-12 rounded-[10px] bg-white px-3.5 text-base" />
                  <FieldError name="email" message={errors.email} />
                </div>
              </div>
              <div className="mt-7 rounded-[12px] border border-[#d9ded9] bg-white p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input type="checkbox" checked={draft.marketingSms} onChange={(event) => onUpdate({ marketingSms: event.target.checked })} className="mt-0.5 size-5 shrink-0 accent-[#d66a2c]" />
                  <span className="text-xs leading-5 text-[#52666b]">
                    <strong className="block text-sm text-[#17343d]">Optional marketing texts</strong>
                    Yes, I consent to receive marketing text messages from McCann Window &amp; Exteriors at the phone number provided. Message and data rates may apply; message frequency varies. Text HELP for help. Text END to opt out.
                  </span>
                </label>
                <p className="mt-3 border-t border-[#e7eae7] pt-3 text-[11px] leading-5 text-[#728388]">
                  This optional consent is separate from communications needed to respond to your project and arrange a consultation.{" "}
                  <a className="font-bold underline underline-offset-2" href="https://vip.mccannwindow.com/terms" target="_blank" rel="noreferrer">Terms</a>
                  {" · "}
                  <a className="font-bold underline underline-offset-2" href="https://vip.mccannwindow.com/privacypolicy" target="_blank" rel="noreferrer">Privacy</a>
                </p>
              </div>
              <div className="mt-5 flex items-start gap-2 text-[11px] leading-5 text-[#728388]">
                <LockKeyhole className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                Prototype only: this request is not sent to McCann or any external system.
              </div>
            </form>
          ) : null}
        </div>
      </main>

      <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-[#17343d]/10 bg-white/96 px-5 pt-3 shadow-[0_-12px_35px_rgba(23,52,61,0.08)] backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl gap-3">
          <Button type="button" variant="outline" onClick={onBack} className="h-[52px] min-w-24 rounded-[11px] border-[#cbd3d0] bg-white px-4 text-base font-bold text-[#29464e]">
            <ArrowLeft className="size-4" aria-hidden="true" /> Back
          </Button>
          <Button type="button" onClick={step === 3 ? onSubmit : onContinue} className="h-[52px] flex-1 rounded-[11px] bg-[#d66a2c] px-4 text-base font-bold hover:bg-[#bd5722]">
            {step === 1
              ? "Choose my preferences"
              : step === 2
                ? "Add my contact details"
                : "Request my free consultation"}
            {step < 3 ? <ArrowRight className="ml-1 size-4" aria-hidden="true" /> : null}
          </Button>
        </div>
      </div>
    </div>
  );
}
