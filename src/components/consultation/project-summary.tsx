import { Check, Phone, RefreshCcw } from "lucide-react";

import { BrandLockup } from "@/components/consultation/landing-view";
import { Button } from "@/components/ui/button";
import {
  improvementOptions,
  materialOptions,
  optionLabel,
  phoneDisplay,
  phoneHref,
  roomOptions,
  styleOptions,
  timingOptions,
  windowCountOptions,
} from "@/data/project-content";
import type { PlannerDraft, PlannerOption } from "@/types/project-planner";

interface ProjectSummaryProps {
  draft: PlannerDraft;
  onReset: () => void;
}

function labelsFor(options: PlannerOption[], values: string[]) {
  return values.map((value) => optionLabel(options, value)).join(", ");
}

export function ProjectSummary({ draft, onReset }: ProjectSummaryProps) {
  const rows = [
    { label: "Goal", value: labelsFor(improvementOptions, draft.goals) },
    { label: "Room", value: labelsFor(roomOptions, draft.rooms) },
    { label: "Windows", value: optionLabel(windowCountOptions, draft.windowCount) },
    {
      label: "Preferences",
      value:
        [...draft.styles.map((value) => optionLabel(styleOptions, value)), ...draft.materials.map((value) => optionLabel(materialOptions, value))].join(", ") ||
        "Open to guidance",
    },
    { label: "Photo", value: draft.photo ? "Added" : "Not added" },
    { label: "Timing", value: optionLabel(timingOptions, draft.timing) },
  ];

  return (
    <div className="animate-view-in min-h-screen bg-[#f7f4ee]">
      <header className="border-b border-[#17343d]/8 bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-5">
          <BrandLockup />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-10 sm:py-16">
        <div className="grid size-14 place-items-center rounded-full bg-[#d66a2c] text-white shadow-[0_12px_30px_rgba(179,79,30,0.24)]">
          <Check className="size-7" strokeWidth={2.5} aria-hidden="true" />
        </div>
        <p className="mt-7 text-xs font-extrabold tracking-[0.16em] text-[#b9531f] uppercase">Planner complete</p>
        <h1 className="text-balance mt-3 text-[2.35rem] leading-[1.04] font-extrabold tracking-[-0.045em] text-[#17343d] sm:text-5xl">
          Your project summary is ready.
        </h1>
        <p className="mt-4 text-base leading-7 text-[#5d7075]">
          In a connected version, McCann would use these details to follow up and arrange your free consultation.
        </p>

        <section className="mt-8 overflow-hidden rounded-[14px] border border-[#d9ded9] bg-white shadow-[0_12px_36px_rgba(23,52,61,0.07)]" aria-labelledby="summary-heading">
          <div className="border-b border-[#e5e8e5] px-5 py-4">
            <h2 id="summary-heading" className="text-lg font-extrabold text-[#17343d]">{draft.name.trim() ? `${draft.name.trim()}’s project` : "Project summary"}</h2>
          </div>
          <dl className="divide-y divide-[#e8ebe8] px-5">
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-[88px_1fr] gap-3 py-4">
                <dt className="text-xs font-bold tracking-wide text-[#728388] uppercase">{row.label}</dt>
                <dd className="text-sm font-semibold leading-5 text-[#29464e]">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-6 rounded-[12px] border border-[#cfdad6] bg-[#edf3f1] p-4">
          <p className="text-sm font-bold text-[#17343d]">What happens next?</p>
          <p className="mt-1 text-sm leading-6 text-[#52666b]">
            This is a front-end concept, so nothing was submitted. A future integration could send the summary to McCann’s existing consultation process.
          </p>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <a
            href={phoneHref}
            aria-label={`Call McCann at ${phoneDisplay}`}
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[11px] bg-[#d66a2c] px-4 text-base font-bold text-white outline-none transition hover:bg-[#bd5722] focus-visible:ring-3 focus-visible:ring-[#d66a2c]/30"
          >
            <Phone className="size-4" aria-hidden="true" />
            Call McCann now
          </a>
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="h-[52px] rounded-[11px] border-[#cbd3d0] bg-white px-4 text-base font-bold text-[#29464e]"
          >
            <RefreshCcw className="size-4" aria-hidden="true" />
            Start a new project plan
          </Button>
        </div>
      </main>
    </div>
  );
}
