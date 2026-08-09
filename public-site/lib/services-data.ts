export interface Service {
  id: string
  slug: string
  title: string
  description: string
  category: string
  features: string[]
  startingPrice: string
  turnaround: string
  icon: string
  image: string
}

export const services: Service[] = [
  {
    id: "1",
    slug: "business-cards",
    title: "Business Cards",
    description:
      "Make a lasting first impression with professionally designed and printed business cards on premium cardstock.",
    category: "Corporate",
    features: [
      "Premium 350gsm cardstock",
      "Full-color double-sided printing",
      "Multiple finish options",
      "Custom design available",
      "Fast 3-5 day turnaround",
    ],
    startingPrice: "$49",
    turnaround: "3-5 days",
    icon: "CreditCard",
    image: "/modern-business-cards-design.jpg",
  },
  {
    id: "2",
    slug: "brochures-flyers",
    title: "Brochures & Flyers",
    description:
      "Eye-catching marketing materials that effectively communicate your message and engage your target audience.",
    category: "Marketing",
    features: [
      "Tri-fold and bi-fold options",
      "High-quality glossy or matte paper",
      "Full-color printing",
      "Custom sizes available",
      "Bulk discounts",
    ],
    startingPrice: "$39",
    turnaround: "2-4 days",
    icon: "FileText",
    image: "/trifold-brochure-design.jpg",
  },
  {
    id: "3",
    slug: "banners-posters",
    title: "Banners & Posters",
    description:
      "Large format printing for maximum visibility. Perfect for events, promotions, and outdoor advertising.",
    category: "Large Format",
    features: [
      "Weather-resistant materials",
      "Indoor and outdoor options",
      "Custom sizes up to 10ft",
      "Reinforced edges with grommets",
      "UV-resistant inks",
    ],
    startingPrice: "$129",
    turnaround: "3-7 days",
    icon: "Image",
    image: "/vinyl-banner-advertising.jpg",
  },
  {
    id: "4",
    slug: "stickers-labels",
    title: "Stickers & Labels",
    description:
      "Custom die-cut stickers and labels for branding, packaging, and promotional purposes in any shape or size.",
    category: "Branding",
    features: [
      "Custom die-cut shapes",
      "Waterproof vinyl material",
      "Glossy or matte finish",
      "Low minimum quantities",
      "Perfect for products",
    ],
    startingPrice: "$29",
    turnaround: "2-3 days",
    icon: "Tag",
    image: "/custom-die-cut-stickers.jpg",
  },
  {
    id: "5",
    slug: "packaging",
    title: "Custom Packaging",
    description:
      "Stand out on the shelf with custom packaging solutions that protect your products and enhance your brand.",
    category: "Packaging",
    features: [
      "Custom box design",
      "Various materials available",
      "Full-color printing",
      "Die-cutting and embossing",
      "Eco-friendly options",
    ],
    startingPrice: "$199",
    turnaround: "7-10 days",
    icon: "Package",
    image: "/custom-product-packaging-design.jpg",
  },
  {
    id: "6",
    slug: "corporate-stationery",
    title: "Corporate Stationery",
    description:
      "Professional letterheads, envelopes, and notepads that reinforce your brand identity in every correspondence.",
    category: "Corporate",
    features: [
      "Premium paper stock",
      "Matching letterhead and envelopes",
      "Custom design included",
      "Spot or full-color printing",
      "Professional finish",
    ],
    startingPrice: "$69",
    turnaround: "4-6 days",
    icon: "Mail",
    image: "/corporate-letterhead-design.jpg",
  },
]

export const serviceCategories = ["All Services", "Corporate", "Marketing", "Large Format", "Branding", "Packaging"]

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug)
}
