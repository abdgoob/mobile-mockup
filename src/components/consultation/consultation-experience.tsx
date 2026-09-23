"use client";

import { useCallback, useEffect, useState } from "react";

import { LandingView } from "@/components/consultation/landing-view";
import { PlannerView } from "@/components/consultation/planner-view";
import { ProjectSummary } from "@/components/consultation/project-summary";
import { draftStorageKey, initialDraft } from "@/data/project-content";
import type { ExperienceView, PlannerDraft, PlannerErrors, PlannerStep } from "@/types/project-planner";

function serializableDraft(draft: PlannerDraft): PlannerDraft {
  return { ...draft, photo: null };
}

function loadInitialDraft(): PlannerDraft {
  if (typeof window === "undefined") return initialDraft;
  try {
    const stored = window.sessionStorage.getItem(draftStorageKey);
    if (!stored) return initialDraft;
    const parsed = JSON.parse(stored) as Partial<PlannerDraft>;
    return { ...initialDraft, ...parsed, photo: null };
  } catch {
    window.sessionStorage.removeItem(draftStorageKey);
    return initialDraft;
  }
}

function validateStep(step: PlannerStep, draft: PlannerDraft): PlannerErrors {
  const errors: PlannerErrors = {};

  if (step === 1) {
    if (!draft.goals.length) errors.goals = "Choose at least one thing you’d like to improve.";
    if (!draft.rooms.length) errors.rooms = "Choose at least one room, or select “I’m not sure.”";
    if (!draft.windowCount) errors.windowCount = "Choose an approximate number of windows.";
  }

  if (step === 3) {
    if (!/^\d{5}$/.test(draft.zip.trim())) errors.zip = "Enter a five-digit ZIP code.";
    if (!draft.timing) errors.timing = "Choose the timing that fits best.";
    if (draft.name.trim().length < 2) errors.name = "Enter your name.";
    if (draft.phone.replace(/\D/g, "").length < 10) errors.phone = "Enter a valid phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) errors.email = "Enter a valid email address.";
  }

  return errors;
}

export function ConsultationExperience() {
  const [view, setView] = useState<ExperienceView>("landing");
  const [step, setStep] = useState<PlannerStep>(1);
  const [draft, setDraft] = useState<PlannerDraft>(loadInitialDraft);
  const [errors, setErrors] = useState<PlannerErrors>({});

  useEffect(() => {
    if (window.location.hash !== "#planner") return;
    const frame = window.requestAnimationFrame(() => setView("planner"));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (view === "landing") return;
    window.sessionStorage.setItem(draftStorageKey, JSON.stringify(serializableDraft(draft)));
  }, [draft, view]);

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash !== "#planner") {
        setView("landing");
        setStep(1);
        setErrors({});
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    return () => {
      if (draft.photo?.url) URL.revokeObjectURL(draft.photo.url);
    };
  }, [draft.photo?.url]);

  const updateDraft = useCallback((changes: Partial<PlannerDraft>) => {
    setDraft((current) => ({ ...current, ...changes }));
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(changes) as (keyof PlannerDraft)[]) delete next[key];
      return next;
    });
  }, []);

  const startPlanner = () => {
    setView("planner");
    setStep(1);
    setErrors({});
    if (window.location.hash !== "#planner") window.history.pushState({ planner: true }, "", "#planner");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const focusFirstError = (nextErrors: PlannerErrors) => {
    const firstKey = Object.keys(nextErrors)[0];
    window.setTimeout(() => document.getElementById(`field-${firstKey}`)?.focus(), 0);
  };

  const continuePlanner = () => {
    const nextErrors = validateStep(step, draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      focusFirstError(nextErrors);
      return;
    }
    setStep((current) => Math.min(3, current + 1) as PlannerStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setErrors({});
    if (step > 1) {
      setStep((current) => (current - 1) as PlannerStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (window.location.hash === "#planner") window.history.back();
    else setView("landing");
  };

  const submit = () => {
    const nextErrors = validateStep(3, draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      focusFirstError(nextErrors);
      return;
    }
    setView("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    if (draft.photo?.url) URL.revokeObjectURL(draft.photo.url);
    window.sessionStorage.removeItem(draftStorageKey);
    setDraft(initialDraft);
    setErrors({});
    setStep(1);
    setView("landing");
    window.history.replaceState({}, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (view === "landing") return <LandingView onStart={startPlanner} />;
  if (view === "success") return <ProjectSummary draft={draft} onReset={reset} />;

  return (
    <PlannerView
      draft={draft}
      errors={errors}
      step={step}
      onBack={goBack}
      onContinue={continuePlanner}
      onSubmit={submit}
      onUpdate={updateDraft}
    />
  );
}
