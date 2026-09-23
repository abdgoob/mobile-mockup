import { ConnectedCarousel } from "@/components/ui/connected-carousel";
import {
  MCCANN_TESTIMONIALS_SOURCE,
  mccannTestimonials,
} from "@/data/mccann-testimonials";

export function CustomerStoriesSection() {
  return (
    <section
      className="overflow-hidden bg-[#f7f4ee] px-5 py-16 sm:py-20 lg:py-24"
      aria-labelledby="customer-stories-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold tracking-[0.18em] text-[#b9531f] uppercase">
            What homeowners say
          </p>
          <h2
            id="customer-stories-heading"
            className="mt-3 text-balance text-3xl leading-tight font-extrabold tracking-[-0.035em] text-[#17343d] sm:text-5xl"
          >
            Built around homes, not just windows.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#66777c] sm:text-lg">
            McCann customers consistently point to thoughtful guidance, careful installation, and a team that respects the home throughout the project.
          </p>
        </div>

        <ConnectedCarousel
          items={mccannTestimonials}
          autoPlayInterval={8000}
          pauseOnHover
          className="mt-8"
        />

        <p className="mx-auto mt-3 max-w-2xl text-center text-xs leading-5 text-[#66777c]">
          Reviews are quoted from{" "}
          <a
            href={MCCANN_TESTIMONIALS_SOURCE}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#17343d] underline decoration-[#d66a2c] underline-offset-4"
          >
            McCann Window &amp; Exteriors
          </a>
          . Images show window-project concepts and are not reviewer portraits.
        </p>
      </div>
    </section>
  );
}
