# SagalJet Website

A modern, production-ready website for SagalJet printing services built with Next.js, Tailwind CSS, and React Three Fiber.

## Features

- 🎨 Modern UI with light/dark/system theme modes
- 🎭 Smooth animations with Framer Motion
- 🎪 3D hero section with React Three Fiber
- 📱 Fully responsive and mobile-first
- ♿ Accessible with ARIA labels and keyboard navigation
- 🚀 Optimized performance with lazy loading
- 🔍 SEO-ready with meta tags and JSON-LD schema
- 📝 Blog and Events systems
- 📞 Contact form with branch locations

## Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

\`\`\`bash
npm run build
npm start
\`\`\`

## Customization

### Brand Colors

Edit `app/globals.css` to change brand colors:

\`\`\`css
--color-primary-rgb: 47 50 146; /* Primary blue */
--color-accent-rgb: 226 6 19;   /* Accent red */
\`\`\`

### Contact Information

Update contact details in:
- `app/contact/page.tsx` - Main contact page
- `components/footer.tsx` - Footer contact info
- `lib/contact-data.ts` - Centralized contact data

### Content

- Blog posts: `app/blog/posts/` directory
- Events: `app/events/data/` directory
- Images: `public/images/` directory

## Tech Stack

- **Framework:** Next.js 15
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **3D Graphics:** React Three Fiber + Drei
- **Icons:** Lucide React
- **Theme:** next-themes

## Project Structure

\`\`\`
├── app/
│   ├── about/
│   ├── blog/
│   ├── contact/
│   ├── events/
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── header.tsx
│   ├── footer.tsx
│   └── ...
├── lib/
└── public/
\`\`\`

## License

© 2025 SagalJet. All rights reserved.
