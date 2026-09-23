"use client";

import type {
  FocusEvent,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
} from "react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play, Quote } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface CarouselItem {
  id: string | number;
  stat: string;
  quote: string;
  author: string;
  role: string;
  defaultImage: string;
  selectedImage: string;
  alt?: string;
}

export interface ConnectedCarouselProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  items: CarouselItem[];
  autoPlayInterval?: number;
  pauseOnHover?: boolean;
}

type ScreenTier = "mobile" | "tablet" | "desktop";

const VISIBLE_OFFSETS = [-1, 0, 1] as const;
const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 220,
  damping: 28,
  mass: 0.8,
} as const;

function wrapIndex(value: number, total: number) {
  return ((value % total) + total) % total;
}

export function ConnectedCarousel({
  items,
  autoPlayInterval = 8000,
  pauseOnHover = true,
  className,
  ...props
}: ConnectedCarouselProps) {
  const regionRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const previousTimeRef = useRef<number | null>(null);
  const lastProgressPaintRef = useRef(0);
  const reduceMotion = Boolean(useReducedMotion());
  const generatedId = useId().replace(/:/g, "");

  const [page, setPage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [containerWidth, setContainerWidth] = useState(390);
  const [tier, setTier] = useState<ScreenTier>("mobile");
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [nearViewport, setNearViewport] = useState(false);

  const total = items.length;
  const activeIndex = total > 0 ? wrapIndex(page, total) : 0;

  const layout = useMemo(() => {
    if (tier === "desktop") {
      return {
        activeWidth: Math.min(820, containerWidth - 300),
        activeHeight: 460,
        sideWidth: 130,
        sideHeight: 330,
        gap: 18,
      };
    }

    if (tier === "tablet") {
      return {
        activeWidth: Math.min(620, containerWidth - 150),
        activeHeight: 450,
        sideWidth: 96,
        sideHeight: 340,
        gap: 16,
      };
    }

    return {
      activeWidth: Math.max(280, Math.min(342, containerWidth - 40)),
      activeHeight: 520,
      sideWidth: 68,
      sideHeight: 410,
      gap: 12,
    };
  }, [containerWidth, tier]);

  const resetTimer = useCallback(() => {
    elapsedRef.current = 0;
    previousTimeRef.current = null;
    lastProgressPaintRef.current = 0;
    setProgress(0);
  }, []);

  const moveBy = useCallback(
    (amount: number) => {
      if (total < 2) return;
      resetTimer();
      setPage((current) => current + amount);
    },
    [resetTimer, total],
  );

  const handlePrevious = useCallback(() => moveBy(-1), [moveBy]);
  const handleNext = useCallback(() => moveBy(1), [moveBy]);

  useEffect(() => {
    const region = regionRef.current;
    if (!region) return;

    let resizeFrame = 0;
    const updateSize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        const width = region.getBoundingClientRect().width;
        setContainerWidth(width);
        setTier(width < 640 ? "mobile" : width < 1024 ? "tablet" : "desktop");
      });
    };

    const resizeObserver = new ResizeObserver(updateSize);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => setNearViewport(entry.isIntersecting),
      { rootMargin: "180px 0px", threshold: 0.08 },
    );

    updateSize();
    resizeObserver.observe(region);
    intersectionObserver.observe(region);

    return () => {
      cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleVisibility = () => setPageVisible(!document.hidden);
    handleVisibility();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const autoPlayPaused =
    reduceMotion ||
    manualPause ||
    focusWithin ||
    !pageVisible ||
    !nearViewport ||
    (pauseOnHover && hovered) ||
    total < 2 ||
    autoPlayInterval <= 0;

  useEffect(() => {
    if (autoPlayPaused) {
      previousTimeRef.current = null;
      return;
    }

    const tick = (time: number) => {
      if (previousTimeRef.current === null) {
        previousTimeRef.current = time;
      }

      elapsedRef.current += time - previousTimeRef.current;
      previousTimeRef.current = time;

      if (elapsedRef.current >= autoPlayInterval) {
        elapsedRef.current = 0;
        previousTimeRef.current = null;
        lastProgressPaintRef.current = 0;
        setProgress(0);
        setPage((current) => current + 1);
        return;
      }

      if (time - lastProgressPaintRef.current > 80) {
        setProgress((elapsedRef.current / autoPlayInterval) * 100);
        lastProgressPaintRef.current = time;
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = null;
      previousTimeRef.current = null;
    };
  }, [autoPlayInterval, autoPlayPaused, page]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      handlePrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      handleNext();
    }
  };

  const handleTabSelect = (event: MouseEvent<HTMLButtonElement>) => {
    const index = Number(event.currentTarget.dataset.index);
    if (!Number.isInteger(index) || index === activeIndex) return;

    let difference = index - activeIndex;
    if (difference > total / 2) difference -= total;
    if (difference < -total / 2) difference += total;
    moveBy(difference);
  };

  const handleCardSelect = (event: MouseEvent<HTMLButtonElement>) => {
    const offset = Number(event.currentTarget.dataset.offset);
    if (offset !== 0) moveBy(offset);
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setFocusWithin(false);
    }
  };

  if (total === 0) return null;

  const transition = reduceMotion
    ? { duration: 0 }
    : SPRING_TRANSITION;
  const panelId = `connected-carousel-panel-${generatedId}`;

  return (
    <div
      {...props}
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="McCann customer experiences"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={handleBlur}
      className={cn(
        "relative mx-auto w-full max-w-[1180px] overflow-hidden py-3 outline-none focus-visible:ring-3 focus-visible:ring-[#d66a2c]/35",
        className,
      )}
    >
      <div
        id={panelId}
        role="group"
        aria-roledescription="slide"
        aria-label={`${activeIndex + 1} of ${total}`}
        aria-live="polite"
        aria-atomic="true"
        className="relative flex w-full items-center justify-center"
        style={{ height: layout.activeHeight }}
      >
        {VISIBLE_OFFSETS.map((offset) => {
          const virtualIndex = page + offset;
          const item = items[wrapIndex(virtualIndex, total)];
          const active = offset === 0;
          const x =
            offset === 0
              ? -layout.activeWidth / 2
              : offset < 0
                ? -layout.activeWidth / 2 - layout.gap - layout.sideWidth
                : layout.activeWidth / 2 + layout.gap;
          const width = active ? layout.activeWidth : layout.sideWidth;
          const height = active ? layout.activeHeight : layout.sideHeight;

          return (
            <motion.div
              key={virtualIndex}
              initial={false}
              animate={{
                x,
                y: -height / 2,
                width,
                height,
                opacity: active ? 1 : 0.78,
                scale: active ? 1 : 0.96,
              }}
              transition={transition}
              style={{ position: "absolute", left: "50%", top: "50%" }}
              className={cn(
                "overflow-visible rounded-[20px] border border-[#17343d]/10 bg-white shadow-[0_18px_50px_rgba(23,52,61,0.12)]",
                active ? "z-20" : "z-10",
              )}
            >
              {!active && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-1/2 h-10 w-6 -translate-y-1/2 bg-white",
                    offset < 0 ? "-right-5" : "-left-5",
                  )}
                />
              )}

              <button
                type="button"
                data-offset={offset}
                onClick={handleCardSelect}
                tabIndex={active ? -1 : 0}
                aria-label={active ? undefined : offset < 0 ? "Show previous customer story" : "Show next customer story"}
                className={cn(
                  "relative size-full overflow-hidden rounded-[inherit] text-left outline-none focus-visible:ring-3 focus-visible:ring-[#d66a2c]/45",
                  !active && "cursor-pointer",
                )}
              >
                {!active ? (
                  <Image
                    src={item.defaultImage}
                    alt=""
                    fill
                    sizes="130px"
                    className="object-cover saturate-[0.8]"
                  />
                ) : (
                  <div className="grid size-full grid-rows-[190px_1fr] gap-0 p-3 sm:p-4 md:grid-cols-[1.08fr_0.92fr] md:grid-rows-1 md:gap-5 md:p-5">
                    <div className="order-2 flex min-w-0 flex-col justify-between px-2 py-4 sm:px-3 md:order-1 md:px-4 md:py-5">
                      <div>
                        <p className="text-[11px] font-extrabold tracking-[0.15em] text-[#b9531f] uppercase">
                          {item.stat}
                        </p>
                        <Quote className="mt-4 size-7 text-[#d66a2c]/35" aria-hidden="true" />
                        <blockquote className="mt-2 text-balance text-xl leading-8 font-semibold tracking-[-0.025em] text-[#17343d] sm:text-2xl">
                          {item.quote}
                        </blockquote>
                      </div>
                      <footer className="mt-5 border-t border-[#17343d]/10 pt-4">
                        <p className="font-extrabold text-[#17343d]">{item.author}</p>
                        <p className="mt-1 text-sm text-[#66777c]">{item.role}</p>
                      </footer>
                    </div>

                    <div className="relative order-1 overflow-hidden rounded-[14px] bg-[#e8eeec] md:order-2">
                      <Image
                        src={item.selectedImage}
                        alt={item.alt || `Window project image accompanying ${item.author}'s testimonial`}
                        fill
                        sizes="(max-width: 639px) 310px, (max-width: 1023px) 260px, 350px"
                        className="object-cover"
                      />
                      <span className="absolute right-2 bottom-2 rounded-md bg-white/90 px-2 py-1 text-[9px] font-bold tracking-wide text-[#52666b] uppercase backdrop-blur">
                        Project concept
                      </span>
                    </div>
                  </div>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={handlePrevious}
          aria-label="Previous customer story"
          className="grid size-11 place-items-center rounded-full border border-[#17343d]/15 bg-white text-[#17343d] transition hover:border-[#d66a2c] hover:text-[#b9531f] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#d66a2c]/35"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>

        <div role="tablist" aria-label="Choose a customer story" className="flex items-center">
          {items.map((item, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                data-index={index}
                aria-selected={selected}
                aria-controls={panelId}
                aria-label={`Show story from ${item.author}`}
                onClick={handleTabSelect}
                className="grid size-11 place-items-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-[#d66a2c]/35"
              >
                <span
                  className={cn(
                    "relative h-2 overflow-hidden rounded-full bg-[#17343d]/15 transition-[width] duration-200",
                    selected ? "w-12" : "w-2",
                  )}
                >
                  {selected && (
                    <span
                      className="absolute inset-y-0 left-0 rounded-full bg-[#d66a2c]"
                      style={{
                        width: reduceMotion ? "100%" : `${progress}%`,
                      }}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setManualPause((current) => !current)}
          aria-label={manualPause ? "Resume customer story autoplay" : "Pause customer story autoplay"}
          aria-pressed={manualPause}
          className="grid size-11 place-items-center rounded-full border border-[#17343d]/15 bg-white text-[#17343d] transition hover:border-[#d66a2c] hover:text-[#b9531f] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#d66a2c]/35"
        >
          {manualPause ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next customer story"
          className="grid size-11 place-items-center rounded-full border border-[#17343d]/15 bg-white text-[#17343d] transition hover:border-[#d66a2c] hover:text-[#b9531f] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#d66a2c]/35"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default ConnectedCarousel;
