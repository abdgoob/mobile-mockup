"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import { TextHighlight } from "@/components/ui/text-highlight";
import { improvementOptions } from "@/data/project-content";

const SPRITE_SRC = "/illustrations/homeowner-crowd.png";
const SPRITE_COLUMNS = 15;
const SPRITE_ROWS = 7;

type CrowdTier = "mobile" | "tablet" | "desktop";

type CrowdConfig = {
  tier: CrowdTier;
  count: number;
  minHeight: number;
  maxHeight: number;
  minSpeed: number;
  maxSpeed: number;
  dprCap: number;
};

type Peep = {
  image: HTMLImageElement;
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  direction: -1 | 1;
  speed: number;
};

interface CrowdCanvasProps {
  active: boolean;
}

function createSeededRandom(seed: number) {
  let value = seed >>> 0;

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function randomBetween(random: () => number, min: number, max: number) {
  return min + random() * (max - min);
}

function getCrowdConfig(width: number): CrowdConfig {
  if (width < 640) {
    return {
      tier: "mobile",
      count: width < 380 ? 10 : 12,
      minHeight: 150,
      maxHeight: 205,
      minSpeed: 14,
      maxSpeed: 22,
      dprCap: 1.5,
    };
  }

  if (width < 1024) {
    return {
      tier: "tablet",
      count: width < 820 ? 16 : 20,
      minHeight: 180,
      maxHeight: 250,
      minSpeed: 16,
      maxSpeed: 24,
      dprCap: 2,
    };
  }

  return {
    tier: "desktop",
    count: width < 1280 ? 22 : 28,
    minHeight: 220,
    maxHeight: 310,
    minSpeed: 18,
    maxSpeed: 26,
    dprCap: 2,
  };
}

function CrowdCanvas({ active }: CrowdCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const syncPlaybackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    activeRef.current = active;
    syncPlaybackRef.current?.();
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const sprite = new Image();
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionPreference.matches;
    let destroyed = false;
    let spriteReady = false;
    let pageVisible = !document.hidden;
    let tickerActive = false;
    let resizeFrame = 0;
    let lastWidth = 0;
    let lastHeight = 0;
    let lastTier: CrowdTier | null = null;
    let stageWidth = 1;
    let stageHeight = 1;
    let peeps: Peep[] = [];

    const draw = () => {
      context.clearRect(0, 0, stageWidth, stageHeight);

      peeps.forEach((peep) => {
        context.save();

        if (peep.direction === -1) {
          context.translate(peep.x + peep.width, peep.y);
          context.scale(-1, 1);
          context.drawImage(
            peep.image,
            peep.sx,
            peep.sy,
            peep.sw,
            peep.sh,
            0,
            0,
            peep.width,
            peep.height,
          );
        } else {
          context.drawImage(
            peep.image,
            peep.sx,
            peep.sy,
            peep.sw,
            peep.sh,
            peep.x,
            peep.y,
            peep.width,
            peep.height,
          );
        }

        context.restore();
      });
    };

    const configurePeep = (
      peep: Peep,
      config: CrowdConfig,
      stageWidth: number,
      stageHeight: number,
      random: () => number,
      initial: boolean,
    ) => {
      peep.depth = randomBetween(random, 0.12, 1);
      peep.height =
        config.minHeight + (config.maxHeight - config.minHeight) * peep.depth;
      peep.width = peep.height * (peep.sw / peep.sh);
      peep.direction = random() > 0.5 ? 1 : -1;
      peep.speed = randomBetween(random, config.minSpeed, config.maxSpeed) * (0.86 + peep.depth * 0.24);

      const depthLift = (1 - peep.depth) * Math.min(52, stageHeight * 0.16);
      const baselineJitter = randomBetween(random, 0, 8);
      peep.y = Math.max(
        6,
        stageHeight - peep.height - depthLift - baselineJitter,
      );

      if (initial) {
        peep.x = randomBetween(random, -peep.width * 0.45, stageWidth - peep.width * 0.55);
      } else {
        peep.x = peep.direction === 1 ? -peep.width - 16 : stageWidth + 16;
      }
    };

    const buildCrowd = () => {
      if (!spriteReady) return;

      const bounds = canvas.getBoundingClientRect();
      stageWidth = Math.max(1, bounds.width);
      stageHeight = Math.max(1, bounds.height);
      const config = getCrowdConfig(stageWidth);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, config.dprCap);

      canvas.width = Math.max(1, Math.floor(stageWidth * pixelRatio));
      canvas.height = Math.max(1, Math.floor(stageHeight * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const cellWidth = sprite.naturalWidth / SPRITE_COLUMNS;
      const cellHeight = sprite.naturalHeight / SPRITE_ROWS;
      const random = reducedMotion ? createSeededRandom(39) : Math.random;
      const frameIndexes = Array.from(
        { length: SPRITE_COLUMNS * SPRITE_ROWS },
        (_, index) => index,
      );

      for (let index = frameIndexes.length - 1; index > 0; index -= 1) {
        const nextIndex = Math.floor(random() * (index + 1));
        [frameIndexes[index], frameIndexes[nextIndex]] = [
          frameIndexes[nextIndex],
          frameIndexes[index],
        ];
      }

      peeps = frameIndexes.slice(0, config.count).map((frameIndex, index) => {
        const column = frameIndex % SPRITE_COLUMNS;
        const row = Math.floor(frameIndex / SPRITE_COLUMNS);
        const peep: Peep = {
          image: sprite,
          sx: column * cellWidth,
          sy: row * cellHeight,
          sw: cellWidth,
          sh: cellHeight,
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          depth: 1,
          direction: 1,
          speed: 0,
        };

        configurePeep(peep, config, stageWidth, stageHeight, random, true);
        const slotWidth = (stageWidth + config.maxHeight) / config.count;
        peep.x =
          index * slotWidth -
          peep.width * 0.55 -
          config.maxHeight * 0.18 +
          randomBetween(random, -slotWidth * 0.25, slotWidth * 0.25);
        return peep;
      });

      peeps.sort((first, second) => first.depth - second.depth);
      canvas.dataset.crowdTier = config.tier;
      canvas.dataset.crowdCount = String(config.count);
      lastWidth = stageWidth;
      lastHeight = stageHeight;
      lastTier = config.tier;
      draw();
    };

    const render = (_time: number, deltaTime: number) => {
      const config = getCrowdConfig(stageWidth);
      const frameSeconds = Math.min(deltaTime, 50) / 1000;
      let depthOrderChanged = false;

      peeps.forEach((peep) => {
        peep.x += peep.direction * peep.speed * frameSeconds;
        const hasExitedRight = peep.direction === 1 && peep.x > stageWidth + 20;
        const hasExitedLeft = peep.direction === -1 && peep.x + peep.width < -20;

        if (hasExitedRight || hasExitedLeft) {
          configurePeep(peep, config, stageWidth, stageHeight, Math.random, false);
          depthOrderChanged = true;
        }
      });

      if (depthOrderChanged) {
        peeps.sort((first, second) => first.depth - second.depth);
      }

      draw();
    };

    const stopTicker = () => {
      if (!tickerActive) return;
      gsap.ticker.remove(render);
      tickerActive = false;
    };

    const syncPlayback = () => {
      const shouldAnimate =
        spriteReady && activeRef.current && pageVisible && !reducedMotion;

      if (shouldAnimate && !tickerActive) {
        gsap.ticker.add(render);
        tickerActive = true;
      } else if (!shouldAnimate) {
        stopTicker();
        if (spriteReady) draw();
      }
    };

    syncPlaybackRef.current = syncPlayback;

    const scheduleResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        const bounds = canvas.getBoundingClientRect();
        const nextTier = getCrowdConfig(bounds.width).tier;
        const sizeChanged =
          Math.abs(bounds.width - lastWidth) > 1 ||
          Math.abs(bounds.height - lastHeight) > 1;

        if (spriteReady && (sizeChanged || nextTier !== lastTier)) {
          buildCrowd();
          syncPlayback();
        }
      });
    };

    const handleVisibilityChange = () => {
      pageVisible = !document.hidden;
      syncPlayback();
    };

    const handleMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      buildCrowd();
      syncPlayback();
    };

    const resizeObserver = new ResizeObserver(scheduleResize);
    resizeObserver.observe(canvas);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    motionPreference.addEventListener("change", handleMotionChange);

    sprite.onload = () => {
      if (destroyed) return;
      spriteReady = true;
      buildCrowd();
      syncPlayback();
    };
    sprite.src = SPRITE_SRC;

    return () => {
      destroyed = true;
      stopTicker();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      motionPreference.removeEventListener("change", handleMotionChange);
      cancelAnimationFrame(resizeFrame);
      sprite.onload = null;
      syncPlaybackRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

export function HomeownerDemandSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasEntered(true);
      },
      { rootMargin: "200px 0px", threshold: 0.08 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#edf0ea] py-16 sm:py-20 lg:py-24"
      aria-labelledby="homeowner-demand-heading"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#17343d]/10 to-transparent" />

      <div
        className={`relative z-10 mx-auto max-w-[760px] px-5 text-center transition-[opacity,transform] duration-[220ms] ease-out ${hasEntered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
      >
        <p className="text-xs font-extrabold tracking-[0.18em] text-[#b9531f] uppercase">
          Homes are different. So are window projects.
        </p>
        <h2
          id="homeowner-demand-heading"
          className="mt-3 text-balance text-3xl leading-[1.08] font-extrabold tracking-[-0.04em] text-[#17343d] sm:text-5xl"
        >
          The right windows improve <TextHighlight color="#fde047">everyday comfort</TextHighlight>.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#52666b] sm:text-lg">
          Drafts and noise affect comfort. Condensation and difficult operation add frustration. More natural light can transform a room. McCann helps connect what you notice every day to window options that make sense for your home.
        </p>

        <p className="mt-7 text-[11px] font-extrabold tracking-[0.15em] text-[#66777c] uppercase">
          What homeowners want to improve
        </p>
        <ul className="mx-auto mt-3 flex max-w-2xl flex-wrap justify-center gap-2" aria-label="Common window project goals">
          {improvementOptions.map((option) => (
            <li
              key={option.id}
              className="rounded-full border border-[#17343d]/12 bg-white/80 px-3.5 py-2 text-sm font-semibold text-[#29464e] shadow-[0_5px_16px_rgba(23,52,61,0.05)]"
            >
              {option.label}
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-7 max-w-xl border-t border-[#17343d]/10 pt-6 text-sm leading-6 font-semibold text-[#29464e]">
          Good recommendations begin with listening. Your prioritiesnot a predetermined productshape the conversation.
        </p>
      </div>

    </section>
  );
}

export function ResponsivePeopleFooter() {
  const sceneRef = useRef<HTMLElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting);
      },
      { rootMargin: "200px 0px", threshold: 0.05 },
    );

    observer.observe(scene);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sceneRef}
      className="relative h-[clamp(220px,29svh,245px)] overflow-hidden bg-white sm:h-[clamp(340px,42svh,430px)] lg:h-[clamp(400px,48svh,520px)]"
      aria-label="Animated illustration of Chicagoland homeowners"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-[#f7f4ee] to-transparent sm:h-20" />
      <CrowdCanvas active={isNearViewport} />
    </section>
  );
}
