import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck2,
  Check,
  ClipboardList,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { TextHighlight } from "@/components/ui/text-highlight";
import {
  HomeownerDemandSection,
  ResponsivePeopleFooter,
} from "@/components/consultation/homeowner-demand-section";
import { phoneDisplay, phoneHref } from "@/data/project-content";

interface LandingViewProps {
  onStart: () => void;
}

function BrandLockup({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="flex items-center gap-2.5" aria-label="McCann Window and Exteriors">
      <span
        className={`relative grid size-9 place-items-center rounded-[9px] border-2 ${inverse ? "border-white/50" : "border-[#17343d]"}`}
        aria-hidden="true"
      >
        <span className={`h-5 w-0.5 ${inverse ? "bg-white" : "bg-[#d66a2c]"}`} />
        <span className={`absolute h-0.5 w-5 ${inverse ? "bg-white" : "bg-[#d66a2c]"}`} />
      </span>
      <span className="leading-none">
        <span className="block text-[15px] font-extrabold tracking-[-0.02em]">McCANN</span>
        <span className={`mt-1 block text-[9px] font-bold tracking-[0.18em] ${inverse ? "text-white/65" : "text-[#66777c]"}`}>
          WINDOW &amp; EXTERIORS
        </span>
      </span>
    </div>
  );
}

export function LandingView({ onStart }: LandingViewProps) {
  return (
    <div className="animate-view-in min-h-screen bg-[#f7f4ee]">
      <header className="sticky top-0 z-40 border-b border-[#17343d]/8 bg-[#f7f4ee]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <BrandLockup />
          <a
            href={phoneHref}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-bold text-[#17343d] outline-none transition hover:text-[#d66a2c] focus-visible:ring-3 focus-visible:ring-[#d66a2c]/35"
            aria-label={`Call McCann at ${phoneDisplay}`}
          >
            <Phone className="size-4 text-[#d66a2c]" aria-hidden="true" />
            <span>Call</span>
          </a>
        </div>
      </header>

      <main>
        <section className="px-5 pb-16 pt-7 sm:pt-10">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
            <div className="max-w-xl">
              <p className="mb-4 text-xs font-extrabold tracking-[0.18em] text-[#b9531f] uppercase">
                A clearer first step
              </p>
              <h1 className="text-balance text-[2.45rem] leading-[1.02] font-extrabold tracking-[-0.045em] text-[#17343d] sm:text-5xl lg:text-6xl">
                Replacement windows designed around <TextHighlight color="#fde047">how you live</TextHighlight>.
              </h1>
              <p className="mt-5 max-w-lg text-[17px] leading-7 text-[#52666b]">
                A better window project starts with the comfort, light, and function you want at home. Share what matters, and McCann can prepare guidance around your prioritiesnot a sales script.
              </p>
              <Button
                onClick={onStart}
                size="lg"
                className="mt-7 h-[54px] w-full rounded-[11px] bg-[#d66a2c] px-5 text-base font-bold shadow-[0_10px_28px_rgba(179,79,30,0.22)] hover:bg-[#bd5722] sm:w-auto sm:min-w-64"
              >
                Build my project summary
                <ArrowRight className="ml-1 size-4" aria-hidden="true" />
              </Button>
              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[#52666b]">
                <ShieldCheck className="size-4 text-[#d66a2c]" aria-hidden="true" />
                Built around McCann’s existing consultation process
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[18px] bg-[#d9ded9] shadow-[0_24px_55px_rgba(23,52,61,0.16)]">
              <Image
                src="/images/window-hero-concept.webp"
                alt="Concept image of a welcoming Chicagoland home with large windows"
                width={900}
                height={1125}
                priority
                sizes="(max-width: 1023px) calc(100vw - 40px), 52vw"
                className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#10282f]/95 via-[#10282f]/55 to-transparent px-5 pb-5 pt-16 text-white">
                <p className="text-xs font-bold tracking-[0.14em] text-white/70 uppercase">Concept imagery</p>
                <p className="mt-1 text-lg font-semibold">Start with how you want home to feel.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
              <div className="relative overflow-hidden rounded-[16px] bg-[#e8eeec]">
                <Image
                  src="/images/window-interior-concept.webp"
                  alt="Concept image of a warm living room filled with natural light"
                  width={1200}
                  height={800}
                  sizes="(max-width: 1023px) calc(100vw - 40px), 50vw"
                  className="aspect-[4/3] w-full object-cover"
                />
                <span className="absolute right-3 bottom-3 rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold tracking-wide text-[#52666b] uppercase backdrop-blur">
                  Concept image
                </span>
              </div>
              <div>
                <p className="text-xs font-extrabold tracking-[0.18em] text-[#b9531f] uppercase">Your priorities first</p>
                <h2 className="mt-3 text-balance text-3xl leading-tight font-extrabold tracking-[-0.035em] text-[#17343d] sm:text-4xl">
                  A simple plan before the appointment.
                </h2>
                <p className="mt-4 text-base leading-7 text-[#66777c]">
                  Share the rooms, concerns, and timing that matter to you. McCann can use that context to make the in-home conversation more useful from the start.
                </p>
                <ul className="mt-6 space-y-3 text-sm font-semibold text-[#29464e]">
                  {["No technical window knowledge needed", "Optional style and material interests", "Personal details saved for the final step"].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#f3dfd2] text-[#b9531f]">
                        <Check className="size-3" aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-extrabold tracking-[0.18em] text-[#b9531f] uppercase">How it works</p>
            <h2 className="mt-3 max-w-xl text-balance text-3xl leading-tight font-extrabold tracking-[-0.035em] text-[#17343d] sm:text-4xl">
              Three quick steps. One better conversation.
            </h2>
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {[
                { icon: ClipboardList, number: "01", title: "Describe your project", copy: "Choose the problems and rooms you want to improve." },
                { icon: BadgeCheck, number: "02", title: "Share preferences", copy: "Add optional style interests or a helpful photo." },
                { icon: CalendarCheck2, number: "03", title: "Request a consultation", copy: "Leave your details so McCann can follow up." },
              ].map(({ icon: Icon, number, title, copy }) => (
                <article key={number} className="rounded-[14px] border border-[#d9ded9] bg-white p-5 shadow-[0_8px_24px_rgba(23,52,61,0.05)]">
                  <div className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-[10px] bg-[#e8eeec] text-[#17343d]">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-black tracking-[0.16em] text-[#d66a2c]">{number}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-[#17343d]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#66777c]">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#17343d] px-5 py-16 text-white sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16">
            <div className="overflow-hidden rounded-[16px] bg-white/10">
              <Image
                src="/images/window-detail-concept.webp"
                alt="Concept close-up of a carefully finished residential window"
                width={900}
                height={1125}
                sizes="(max-width: 1023px) calc(100vw - 40px), 38vw"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div>
              <BrandLockup inverse />
              <p className="text-balance mt-8 text-2xl leading-9 font-semibold tracking-[-0.02em]">
                “Just nice people all around. They know their stuff, have several quality options to choose from, and didn’t pressure sell.”
              </p>
              <p className="mt-4 text-sm font-bold text-[#f2a06e]">Patricia S. · McCann customer</p>
              <div className="mt-9 grid grid-cols-2 gap-3 border-t border-white/15 pt-7">
                <div>
                  <p className="text-2xl font-extrabold">30+ years</p>
                  <p className="mt-1 text-xs leading-5 text-white/60">Serving Chicagoland homeowners</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold">5-year</p>
                  <p className="mt-1 text-xs leading-5 text-white/60">Labor &amp; installation warranty</p>
                </div>
              </div>
              <p className="mt-3 text-[11px] leading-5 text-white/45">Manufacturer warranty coverage varies by selected product.</p>
            </div>
          </div>
        </section>

        <HomeownerDemandSection />

        <section className="px-5 py-16 text-center sm:py-20">
          <div className="mx-auto max-w-xl">
            <p className="text-xs font-extrabold tracking-[0.18em] text-[#b9531f] uppercase">Clarity before the consultation</p>
            <h2 className="mt-3 text-balance text-3xl leading-tight font-extrabold tracking-[-0.035em] text-[#17343d] sm:text-4xl">
              Clear priorities lead to more confident decisions.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#66777c]">
              Start with a clear picture of your rooms, concerns, and timing, then let McCann help you compare the options that genuinely fitwithout pressure or guesswork.
            </p>
            <p className="mt-5 text-sm font-semibold text-[#52666b]">
              Prefer to talk it through?{" "}
              <a className="text-[#17343d] underline decoration-[#d66a2c] decoration-2 underline-offset-4 transition hover:text-[#b9531f]" href={phoneHref}>
                Call {phoneDisplay}
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#17343d]/10 bg-[#f7f4ee]">
        <div className="px-5 pt-8 pb-0 sm:py-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-[#66777c] sm:flex-row sm:items-center sm:justify-between">
            <BrandLockup />
            <div>
              Northbrook, Illinois · <a className="font-semibold text-[#17343d] hover:text-[#d66a2c]" href={phoneHref}>{phoneDisplay}</a>
            </div>
          </div>
        </div>
        <ResponsivePeopleFooter />
      </footer>
    </div>
  );
}

export { BrandLockup };
