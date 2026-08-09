export const COMMON_SIZES = [
  // A Series (ISO 216 Standard)
  { id: "a0", name: "A0", dimensions: "841 × 1189 mm (33.1 × 46.8 in)", category: "ISO A Series", price: 50.00 },
  { id: "a1", name: "A1", dimensions: "594 × 841 mm (23.4 × 33.1 in)", category: "ISO A Series", price: 35.00 },
  { id: "a2", name: "A2", dimensions: "420 × 594 mm (16.5 × 23.4 in)", category: "ISO A Series", price: 20.00 },
  { id: "a3", name: "A3", dimensions: "297 × 420 mm (11.7 × 16.5 in)", category: "ISO A Series", price: 10.00 },
  { id: "a4", name: "A4", dimensions: "210 × 297 mm (8.3 × 11.7 in)", category: "ISO A Series", price: 5.00 },
  { id: "a5", name: "A5", dimensions: "148 × 210 mm (5.8 × 8.3 in)", category: "ISO A Series", price: 3.00 },
  { id: "a6", name: "A6", dimensions: "105 × 148 mm (4.1 × 5.8 in)", category: "ISO A Series", price: 2.00 },
  { id: "a7", name: "A7", dimensions: "74 × 105 mm (2.9 × 4.1 in)", category: "ISO A Series", price: 1.50 },

  // B Series (ISO 216 Standard)
  { id: "b0", name: "B0", dimensions: "1000 × 1414 mm (39.4 × 55.7 in)", category: "ISO B Series", price: 60.00 },
  { id: "b1", name: "B1", dimensions: "707 × 1000 mm (27.8 × 39.4 in)", category: "ISO B Series", price: 40.00 },
  { id: "b2", name: "B2", dimensions: "500 × 707 mm (19.7 × 27.8 in)", category: "ISO B Series", price: 25.00 },
  { id: "b3", name: "B3", dimensions: "353 × 500 mm (13.9 × 19.7 in)", category: "ISO B Series", price: 15.00 },
  { id: "b4", name: "B4", dimensions: "250 × 353 mm (9.8 × 13.9 in)", category: "ISO B Series", price: 8.00 },
  { id: "b5", name: "B5", dimensions: "176 × 250 mm (6.9 × 9.8 in)", category: "ISO B Series", price: 4.00 },

  // North American Sizes
  { id: "letter", name: "Letter", dimensions: "8.5 × 11 in (216 × 279 mm)", category: "US Standard", price: 5.00 },
  { id: "legal", name: "Legal", dimensions: "8.5 × 14 in (216 × 356 mm)", category: "US Standard", price: 7.00 },
  { id: "ledger", name: "Ledger/Tabloid", dimensions: "11 × 17 in (279 × 432 mm)", category: "US Standard", price: 12.00 },
  { id: "executive", name: "Executive", dimensions: "7.25 × 10.5 in (184 × 267 mm)", category: "US Standard", price: 4.50 },
  { id: "statement", name: "Statement", dimensions: "5.5 × 8.5 in (140 × 216 mm)", category: "US Standard", price: 3.50 },

  // Photo Print Sizes
  { id: "4x6", name: "4 × 6", dimensions: "4 × 6 in (10 × 15 cm)", category: "Photo Prints", price: 2.00 },
  { id: "5x7", name: "5 × 7", dimensions: "5 × 7 in (13 × 18 cm)", category: "Photo Prints", price: 3.00 },
  { id: "6x8", name: "6 × 8", dimensions: "6 × 8 in (15 × 20 cm)", category: "Photo Prints", price: 4.00 },
  { id: "8x10", name: "8 × 10", dimensions: "8 × 10 in (20 × 25 cm)", category: "Photo Prints", price: 8.00 },
  { id: "8x12", name: "8 × 12", dimensions: "8 × 12 in (20 × 30 cm)", category: "Photo Prints", price: 10.00 },
  { id: "10x12", name: "10 × 12", dimensions: "10 × 12 in (25 × 30 cm)", category: "Photo Prints", price: 12.00 },
  { id: "10x13", name: "10 × 13", dimensions: "10 × 13 in (25 × 33 cm)", category: "Photo Prints", price: 13.00 },
  { id: "11x14", name: "11 × 14", dimensions: "11 × 14 in (28 × 36 cm)", category: "Photo Prints", price: 15.00 },
  { id: "12x16", name: "12 × 16", dimensions: "12 × 16 in (30 × 40 cm)", category: "Photo Prints", price: 18.00 },
  { id: "12x18", name: "12 × 18", dimensions: "12 × 18 in (30 × 46 cm)", category: "Photo Prints", price: 20.00 },
  { id: "16x20", name: "16 × 20", dimensions: "16 × 20 in (40 × 51 cm)", category: "Photo Prints", price: 25.00 },
  { id: "16x24", name: "16 × 24", dimensions: "16 × 24 in (40 × 61 cm)", category: "Photo Prints", price: 28.00 },
  { id: "18x24", name: "18 × 24", dimensions: "18 × 24 in (46 × 61 cm)", category: "Photo Prints", price: 30.00 },
  { id: "20x24", name: "20 × 24", dimensions: "20 × 24 in (51 × 61 cm)", category: "Photo Prints", price: 35.00 },
  { id: "20x30", name: "20 × 30", dimensions: "20 × 30 in (51 × 76 cm)", category: "Photo Prints", price: 40.00 },
  { id: "24x30", name: "24 × 30", dimensions: "24 × 30 in (61 × 76 cm)", category: "Photo Prints", price: 45.00 },
  { id: "24x36", name: "24 × 36", dimensions: "24 × 36 in (61 × 91 cm)", category: "Photo Prints", price: 50.00 },
  { id: "30x40", name: "30 × 40", dimensions: "30 × 40 in (76 × 102 cm)", category: "Photo Prints", price: 65.00 },

  // Square Sizes
  { id: "4x4", name: "4 × 4", dimensions: "4 × 4 in (10 × 10 cm)", category: "Square", price: 3.00 },
  { id: "5x5", name: "5 × 5", dimensions: "5 × 5 in (13 × 13 cm)", category: "Square", price: 4.00 },
  { id: "6x6", name: "6 × 6", dimensions: "6 × 6 in (15 × 15 cm)", category: "Square", price: 5.00 },
  { id: "8x8", name: "8 × 8", dimensions: "8 × 8 in (20 × 20 cm)", category: "Square", price: 10.00 },
  { id: "10x10", name: "10 × 10", dimensions: "10 × 10 in (25 × 25 cm)", category: "Square", price: 15.00 },
  { id: "12x12", name: "12 × 12", dimensions: "12 × 12 in (30 × 30 cm)", category: "Square", price: 18.00 },
  { id: "16x16", name: "16 × 16", dimensions: "16 × 16 in (40 × 40 cm)", category: "Square", price: 25.00 },
  { id: "20x20", name: "20 × 20", dimensions: "20 × 20 in (51 × 51 cm)", category: "Square", price: 35.00 },
  { id: "24x24", name: "24 × 24", dimensions: "24 × 24 in (61 × 61 cm)", category: "Square", price: 45.00 },
  { id: "30x30", name: "30 × 30", dimensions: "30 × 30 in (76 × 76 cm)", category: "Square", price: 55.00 },

  // Poster Sizes
  { id: "poster-small", name: "Small Poster", dimensions: "11 × 17 in (28 × 43 cm)", category: "Posters", price: 12.00 },
  { id: "poster-medium", name: "Medium Poster", dimensions: "18 × 24 in (46 × 61 cm)", category: "Posters", price: 30.00 },
  { id: "poster-large", name: "Large Poster", dimensions: "24 × 36 in (61 × 91 cm)", category: "Posters", price: 50.00 },
  { id: "poster-movie", name: "Movie Poster", dimensions: "27 × 40 in (69 × 102 cm)", category: "Posters", price: 55.00 },
  { id: "poster-xl", name: "XL Poster", dimensions: "36 × 48 in (91 × 122 cm)", category: "Posters", price: 75.00 },

  // Business & Marketing
  { id: "business-card", name: "Business Card", dimensions: "3.5 × 2 in (89 × 51 mm)", category: "Business", price: 1.00 },
  { id: "postcard", name: "Postcard", dimensions: "6 × 4 in (15 × 10 cm)", category: "Business", price: 2.00 },
  { id: "flyer-half", name: "Half Page Flyer", dimensions: "5.5 × 8.5 in (140 × 216 mm)", category: "Marketing", price: 3.00 },
  { id: "flyer-full", name: "Full Page Flyer", dimensions: "8.5 × 11 in (216 × 279 mm)", category: "Marketing", price: 5.00 },
  { id: "brochure", name: "Tri-fold Brochure", dimensions: "8.5 × 11 in (216 × 279 mm)", category: "Marketing", price: 8.00 },
  { id: "rack-card", name: "Rack Card", dimensions: "4 × 9 in (10 × 23 cm)", category: "Marketing", price: 4.00 },

  // Banner Sizes
  { id: "banner-2x4", name: "2 × 4 Banner", dimensions: "2 × 4 ft (61 × 122 cm)", category: "Banners", price: 40.00 },
  { id: "banner-2x6", name: "2 × 6 Banner", dimensions: "2 × 6 ft (61 × 183 cm)", category: "Banners", price: 50.00 },
  { id: "banner-3x6", name: "3 × 6 Banner", dimensions: "3 × 6 ft (91 × 183 cm)", category: "Banners", price: 65.00 },
  { id: "banner-4x6", name: "4 × 6 Banner", dimensions: "4 × 6 ft (122 × 183 cm)", category: "Banners", price: 80.00 },
  { id: "banner-4x8", name: "4 × 8 Banner", dimensions: "4 × 8 ft (122 × 244 cm)", category: "Banners", price: 100.00 },
  { id: "banner-5x10", name: "5 × 10 Banner", dimensions: "5 × 10 ft (152 × 305 cm)", category: "Banners", price: 130.00 },

  // Panoramic Sizes
  { id: "pano-8x24", name: "8 × 24 Panoramic", dimensions: "8 × 24 in (20 × 61 cm)", category: "Panoramic", price: 25.00 },
  { id: "pano-10x30", name: "10 × 30 Panoramic", dimensions: "10 × 30 in (25 × 76 cm)", category: "Panoramic", price: 35.00 },
  { id: "pano-12x36", name: "12 × 36 Panoramic", dimensions: "12 × 36 in (30 × 91 cm)", category: "Panoramic", price: 45.00 },

  // Custom
  { id: "custom", name: "Custom Size", dimensions: "Contact us for pricing", category: "Custom", price: 0 },
];