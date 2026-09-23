import type { CarouselItem } from "@/components/ui/connected-carousel";

export const MCCANN_TESTIMONIALS_SOURCE =
  "https://mccannwindow.com/about-mccann-window-northbrook-il/testimonials/";

export const mccannTestimonials: CarouselItem[] = [
  {
    id: "miki-window-installation",
    stat: "Window replacement",
    quote: "I am very happy with the new windows McCann installed for us.",
    author: "Miki",
    role: "McCann customer",
    defaultImage: "/images/window-hero-concept.webp",
    selectedImage: "/images/window-hero-concept.webp",
    alt: "Concept image of a home with replacement windows; not a reviewer portrait",
  },
  {
    id: "ande-customer-service",
    stat: "Customer care",
    quote: "Their customer service was excellent.",
    author: "Ande F.",
    role: "McCann customer",
    defaultImage: "/images/window-interior-concept.webp",
    selectedImage: "/images/window-interior-concept.webp",
    alt: "Concept image of a bright room with large windows; not a reviewer portrait",
  },
  {
    id: "patricia-installation",
    stat: "Installation experience",
    quote: "Easy install, quality workmanship.",
    author: "Patricia S.",
    role: "McCann customer",
    defaultImage: "/images/window-detail-concept.webp",
    selectedImage: "/images/window-detail-concept.webp",
    alt: "Concept image of a finished residential window; not a reviewer portrait",
  },
];
