export interface Design {
  id: string
  slug: string
  title: string
  category: string
  description: string
  image: string
  price: string
  features: string[]
  tags: string[]
}

export interface WhatsAppContact {
  location: string
  phone: string
  employeeName: string
}

export const whatsappContacts: WhatsAppContact[] = [
  {
    location: "Hargeysa",
    phone: "+252634567890",
    employeeName: "Ahmed Mohamed",
  },
  {
    location: "Berbera",
    phone: "+252634567891",
    employeeName: "Fatima Hassan",
  },
  {
    location: "Bur'o",
    phone: "+252634567892",
    employeeName: "Omar Ali",
  },
]

export const designs: Design[] = [
  {
    id: "1",
    slug: "business-card-modern",
    title: "Modern Business Card",
    category: "Business Cards",
    description: "Professional modern business card design with clean layout and bold typography",
    image: "/modern-business-card-design.jpg",
    price: "$50",
    features: ["Double-sided print", "Premium cardstock", "Multiple color options", "Fast turnaround"],
    tags: ["business", "professional", "modern"],
  },
  {
    id: "2",
    slug: "flyer-event-promotion",
    title: "Event Promotion Flyer",
    category: "Flyers",
    description: "Eye-catching event flyer design perfect for concerts, parties, and corporate events",
    image: "/event-promotion-flyer-design.jpg",
    price: "$75",
    features: ["A4 size", "High-resolution print", "Customizable text", "Vibrant colors"],
    tags: ["event", "promotion", "colorful"],
  },
  {
    id: "3",
    slug: "brochure-trifold",
    title: "Tri-fold Brochure",
    category: "Brochures",
    description: "Professional tri-fold brochure design ideal for product catalogs and company profiles",
    image: "/trifold-brochure-design.jpg",
    price: "$120",
    features: ["Tri-fold layout", "Glossy finish", "Full-color printing", "Professional design"],
    tags: ["brochure", "corporate", "catalog"],
  },
  {
    id: "4",
    slug: "poster-large-format",
    title: "Large Format Poster",
    category: "Posters",
    description: "High-impact large format poster design for advertising and promotional campaigns",
    image: "/large-format-poster-design.jpg",
    price: "$150",
    features: ["Multiple sizes", "Weather-resistant", "Vibrant colors", "Matte or glossy"],
    tags: ["poster", "advertising", "large"],
  },
  {
    id: "5",
    slug: "banner-roll-up",
    title: "Roll-up Banner",
    category: "Banners",
    description: "Portable roll-up banner design perfect for trade shows and exhibitions",
    image: "/rollup-banner-design.jpg",
    price: "$200",
    features: ["Portable stand", "Easy setup", "Durable material", "Professional finish"],
    tags: ["banner", "exhibition", "portable"],
  },
  {
    id: "6",
    slug: "menu-restaurant",
    title: "Restaurant Menu",
    category: "Menus",
    description: "Elegant restaurant menu design with customizable sections and pricing",
    image: "/elegant-restaurant-menu.png",
    price: "$90",
    features: ["Laminated finish", "Multiple pages", "Food photography", "Custom layout"],
    tags: ["menu", "restaurant", "food"],
  },
  {
    id: "7",
    slug: "letterhead-corporate",
    title: "Corporate Letterhead",
    category: "Stationery",
    description: "Professional corporate letterhead design for official correspondence",
    image: "/corporate-letterhead-design.jpg",
    price: "$60",
    features: ["Premium paper", "Watermark option", "Color printing", "Bulk discounts"],
    tags: ["letterhead", "corporate", "official"],
  },
  {
    id: "8",
    slug: "packaging-box",
    title: "Product Packaging Box",
    category: "Packaging",
    description: "Custom product packaging box design with your branding",
    image: "/product-packaging-box-design.jpg",
    price: "$180",
    features: ["Custom dimensions", "Full-color print", "Sturdy material", "Die-cut options"],
    tags: ["packaging", "box", "product"],
  },
  {
    id: "9",
    slug: "invitation-wedding",
    title: "Wedding Invitation",
    category: "Invitations",
    description: "Elegant wedding invitation design with beautiful typography and details",
    image: "/wedding-invitation-design.jpg",
    price: "$100",
    features: ["Premium cardstock", "Envelope included", "RSVP cards", "Custom colors"],
    tags: ["wedding", "invitation", "elegant"],
  },
]

export function getAllDesigns(): Design[] {
  return designs
}

export function getDesignBySlug(slug: string): Design | undefined {
  return designs.find((design) => design.slug === slug)
}

export function getDesignsByCategory(category: string): Design[] {
  return designs.filter((design) => design.category === category)
}

export function getAllCategories(): string[] {
  return Array.from(new Set(designs.map((design) => design.category)))
}
