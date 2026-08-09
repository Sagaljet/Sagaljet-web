export interface Event {
  slug: string
  title: string
  description: string
  fullDescription: string
  date: string
  time: string
  location: string
  category: string
  image: string
  registrationRequired: boolean
  capacity?: number
  organizer: string
}

export const events: Event[] = [
  {
    slug: "printing-innovation-summit-2025",
    title: "Printing Innovation Summit 2025",
    description:
      "Join us for a day of innovation, networking, and learning about the latest trends in printing technology.",
    fullDescription: `
The Printing Innovation Summit 2025 is SagalJet's flagship event bringing together industry professionals, business owners, and printing enthusiasts for a day of learning and networking.

## Event Highlights

### Keynote Presentations
- **The Future of Digital Printing** - Exploring emerging technologies and their impact on the industry
- **Sustainable Printing Practices** - How to reduce environmental impact while maintaining quality
- **Business Growth Through Print** - Strategies for leveraging print in your marketing mix

### Workshop Sessions
- Hands-on demonstrations of our latest equipment
- Color management and calibration techniques
- Design best practices for print
- Paper selection and finishing options

### Networking Opportunities
Connect with fellow business owners, designers, and printing professionals. Share experiences, build relationships, and explore collaboration opportunities.

### Equipment Showcase
See our state-of-the-art printing equipment in action. Our technical team will be available to answer questions and provide demonstrations.

## Who Should Attend?

- Business owners looking to improve their print marketing
- Graphic designers wanting to understand print production
- Marketing professionals seeking new promotional strategies
- Anyone interested in the printing industry

## What's Included

- Full-day access to all sessions and workshops
- Lunch and refreshments
- Event materials and resources
- Certificate of attendance
- Networking reception

## Registration

Space is limited to ensure an intimate, engaging experience. Register early to secure your spot.

We look forward to seeing you at the Printing Innovation Summit 2025!
    `,
    date: "2025-03-15",
    time: "9:00 AM - 5:00 PM",
    location: "SagalJet Headquarters, Hargeisa",
    category: "Conference",
    image: "/printing-summit.jpg",
    registrationRequired: true,
    capacity: 100,
    organizer: "SagalJet Events Team",
  },
  {
    slug: "small-business-printing-workshop",
    title: "Small Business Printing Workshop",
    description:
      "Learn how to create professional marketing materials on a budget. Perfect for small business owners and entrepreneurs.",
    fullDescription: `
This hands-on workshop is designed specifically for small business owners and entrepreneurs who want to maximize their marketing impact through effective print materials.

## Workshop Overview

In this interactive session, you'll learn:

### Marketing Materials Essentials
- Designing effective business cards
- Creating compelling brochures and flyers
- Developing consistent brand materials
- Choosing the right formats for your needs

### Budget-Friendly Strategies
- Cost-effective printing options
- When to print in-house vs. professional printing
- Bulk ordering strategies
- Digital vs. offset printing considerations

### Design Fundamentals
- Basic design principles for print
- Color selection and psychology
- Typography best practices
- Layout and composition tips

### Practical Applications
- Real-world examples and case studies
- Common mistakes to avoid
- Templates and resources you can use
- Q&A with printing experts

## What You'll Take Away

- Practical knowledge you can apply immediately
- Design templates for common business materials
- Resource guide for future projects
- Discount voucher for your next SagalJet order
- Ongoing support from our team

## Workshop Format

This is a hands-on, interactive workshop with plenty of time for questions and individual guidance. Bring your laptop and any existing materials you'd like feedback on.

## Prerequisites

No design experience necessary! This workshop is perfect for beginners and those looking to improve their print marketing skills.

## Limited Seating

To ensure personalized attention, we limit this workshop to 25 participants. Register early to secure your spot.
    `,
    date: "2025-02-20",
    time: "2:00 PM - 5:00 PM",
    location: "SagalJet Burao Branch",
    category: "Workshop",
    image: "/business-workshop.jpg",
    registrationRequired: true,
    capacity: 25,
    organizer: "Fatima Mohamed",
  },
  {
    slug: "open-house-berbera",
    title: "Open House - Berbera Branch",
    description:
      "Visit our Berbera branch for an open house event. Tour our facilities, meet our team, and enjoy special promotions.",
    fullDescription: `
We're excited to invite you to an Open House at our Berbera branch! This is your opportunity to see our facilities, meet our team, and learn more about our services.

## Event Activities

### Facility Tours
Get a behind-the-scenes look at our printing operations. See our equipment in action and learn about our production process from start to finish.

### Meet the Team
Our experienced staff will be available to answer your questions, discuss your printing needs, and provide expert advice.

### Live Demonstrations
Watch live printing demonstrations showcasing various techniques and technologies:
- Digital printing
- Large format printing
- Finishing and binding
- Color matching and proofing

### Special Promotions
Exclusive discounts available only during the open house:
- 20% off business cards
- 15% off brochures and flyers
- 10% off all other services
- Free design consultation with any order

### Refreshments
Enjoy complimentary refreshments while you explore and network with other attendees.

## Why Attend?

Whether you're a current client, potential customer, or just curious about printing, this event is for you. It's a relaxed, informal opportunity to:

- Learn about our capabilities
- Get inspired for your next project
- Take advantage of special pricing
- Build a relationship with your local printing partner

## No Registration Required

This is a drop-in event - come and go as you please during the event hours. However, if you'd like to schedule a specific time for a facility tour or consultation, please contact us in advance.

## Bring Your Projects

Have a project in mind? Bring your ideas, sketches, or existing materials. Our team will be happy to provide feedback and recommendations.

We look forward to welcoming you to our Berbera branch!
    `,
    date: "2025-02-10",
    time: "10:00 AM - 4:00 PM",
    location: "SagalJet Berbera Branch",
    category: "Open House",
    image: "/open-house.jpg",
    registrationRequired: false,
    organizer: "Berbera Branch Team",
  },
]

export function getEvent(slug: string): Event | undefined {
  return events.find((event) => event.slug === slug)
}

export function getAllEvents(): Event[] {
  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function getUpcomingEvents(): Event[] {
  const now = new Date()
  return events
    .filter((event) => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}
