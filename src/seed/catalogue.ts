/**
 * Confirmed prices (Madhan, 10 Nov 2026). Single source for `npm run seed` and `npm run prices`.
 * Per-seat / per-sq-ft rates are turned into fixed options because the planner books fixed prices:
 *   sofa ₹250/seat (fabric or leather) · office chair ₹150/chair · carpet ₹6/sq ft (₹399 minimum)
 *   empty villa ₹5/sq ft mop, ₹8/sq ft machine · machine scrubbing on full home +₹500 / +₹700 / +₹1,000
 * A service with any ₹0 option stays unpublished.
 */
export type CatalogueOption = {
  key: string
  label: string
  price: number
  units: 'half' | 'whole'
  description?: string
}

export const catalogue: Record<string, CatalogueOption[]> = {
  'home-deep-cleaning-chennai': [
    { key: '1bhk', label: '1 BHK', price: 2799, units: 'whole' },
    { key: '1bhk-machine', label: '1 BHK + machine scrubbing', price: 3299, units: 'whole', description: 'Floors scrubbed with a floor machine instead of by hand.' },
    { key: '2bhk', label: '2 BHK', price: 4299, units: 'whole' },
    { key: '2bhk-machine', label: '2 BHK + machine scrubbing', price: 4999, units: 'whole', description: 'Floors scrubbed with a floor machine instead of by hand.' },
    { key: '3bhk', label: '3 BHK', price: 4799, units: 'whole' },
    { key: '3bhk-machine', label: '3 BHK + machine scrubbing', price: 5799, units: 'whole', description: 'Floors scrubbed with a floor machine instead of by hand.' },
    { key: 'villa-1500-mop', label: 'Empty villa, up to 1,500 sq ft · mop', price: 7500, units: 'whole', description: '₹5 per sq ft. Empty house only. Bigger villa? WhatsApp us for a quote.' },
    { key: 'villa-1500-machine', label: 'Empty villa, up to 1,500 sq ft · machine', price: 12000, units: 'whole', description: '₹8 per sq ft, floors scrubbed with a machine. Empty house only.' },
    { key: 'villa-2500-mop', label: 'Empty villa, 1,500–2,500 sq ft · mop', price: 12500, units: 'whole', description: '₹5 per sq ft. Empty house only. Bigger villa? WhatsApp us for a quote.' },
    { key: 'villa-2500-machine', label: 'Empty villa, 1,500–2,500 sq ft · machine', price: 20000, units: 'whole', description: '₹8 per sq ft, floors scrubbed with a machine. Empty house only.' },
  ],
  'kitchen-cleaning-chennai': [
    { key: 'light', label: 'Empty / light', price: 1499, units: 'half', description: 'Empty kitchen, or cooked in daily and cleaned weekly.' },
    { key: 'regular', label: 'Occupied / regular', price: 1999, units: 'half', description: 'In daily use: sticky tiles, dull stove, chimney turning brown.' },
    { key: 'heavy', label: 'Heavy grease', price: 2499, units: 'half', description: 'Not deep cleaned in a year or more. Black on chimney.' },
  ],
  'bathroom-cleaning-chennai': [
    { key: 'regular', label: 'Regular', price: 599, units: 'half', description: 'Price per bathroom.' },
    { key: 'hard-water', label: 'Hard-water stains', price: 799, units: 'half', description: 'Price per bathroom. White scale on taps, tiles and glass.' },
    { key: 'neglected', label: 'Not cleaned in months', price: 999, units: 'half', description: 'Price per bathroom.' },
  ],
  'bedroom-cleaning-chennai': [
    { key: 'empty', label: 'Empty room', price: 1499, units: 'half' },
    { key: 'occupied', label: 'Occupied room', price: 1999, units: 'half', description: 'Furniture moved and cleaned around. Inside of wardrobes not included.' },
  ],
  'sofa-cleaning-chennai': [
    { key: '3-seat', label: '3 seater', price: 750, units: 'half', description: '₹250 per seat, fabric or leather.' },
    { key: '5-seat', label: '5 seater (3+2)', price: 1250, units: 'half', description: '₹250 per seat, fabric or leather.' },
    { key: 'l-shape', label: 'L-shape (6 seats)', price: 1500, units: 'half', description: '₹250 per seat, fabric or leather.' },
    { key: '7-seat', label: '7 seater (3+2+2)', price: 1750, units: 'half', description: '₹250 per seat, fabric or leather.' },
  ],
  'carpet-mattress-cleaning-chennai': [
    { key: 'single', label: 'Single mattress', price: 699, units: 'half' },
    { key: 'queen', label: 'Queen mattress', price: 799, units: 'half' },
    { key: 'king', label: 'King mattress', price: 899, units: 'half' },
    { key: 'carpet-50', label: 'Carpet up to 50 sq ft', price: 399, units: 'half', description: '₹6 per sq ft, ₹399 minimum.' },
    { key: 'carpet-100', label: 'Carpet 50–100 sq ft', price: 600, units: 'half', description: '₹6 per sq ft.' },
    { key: 'carpet-200', label: 'Carpet 100–200 sq ft', price: 1200, units: 'half', description: '₹6 per sq ft. Bigger? WhatsApp us.' },
  ],
  'post-renovation-cleaning-chennai': [
    { key: 'light-dust', label: 'Light dust after painting (up to 2 BHK)', price: 1499, units: 'half', description: 'Dust on floors, windows and fittings after painting. Bigger home? WhatsApp us.' },
    { key: 'paint-cement', label: 'Paint and cement marks (up to 3 BHK)', price: 2999, units: 'whole', description: 'Paint drops, cement and grout haze scraped and washed. Bigger home? WhatsApp us.' },
  ],
  'office-chair-cleaning-chennai': [
    { key: 'up-to-5', label: 'Up to 5 chairs', price: 750, units: 'half', description: '₹150 per chair. Fabric or mesh, shampooed and vacuumed.' },
    { key: '6-10', label: '6–10 chairs', price: 1500, units: 'half', description: '₹150 per chair. More than 10? WhatsApp us for a quote.' },
  ],
  // Move-in / move-out: prices not confirmed yet — stays as seeded (unpublished).
}

/** New service added with the 10 Nov prices. */
export const officeChairService = {
  name: 'Office Chair Cleaning',
  slug: 'office-chair-cleaning-chennai',
  menuLabel: 'Office chairs',
  h1: 'Office Chair Cleaning in Chennai',
  subline: 'Stained, dusty office chairs shampooed and vacuumed at your office. ₹150 per chair.',
  metaDescription: 'Office chair cleaning in Chennai at ₹150 per chair. Fabric and mesh chairs shampooed and vacuumed on site by verified partners. Book online.',
  order: 9,
}

export const seoTitleFor = (h1: string, options: CatalogueOption[]) => {
  const priced = options.length > 0 && options.every((o) => o.price > 0)
  const from = priced ? ` from ₹${Math.min(...options.map((o) => o.price)).toLocaleString('en-IN')}` : ''
  return `${h1}${from} | DeepCleanz`.slice(0, 60)
}
