export type VehicleStatus = "Tersedia" | "Booking" | "Sold Out";

export interface Vehicle {
  id: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  transmission: string;
  fuelType: string;
  mileage: number;
  color: string;
  category: string;
  status: VehicleStatus;
  description: string;
  features: string[];
  images: string[];
  createdAt?: string;
}

export interface SiteSettings {
  whatsappNumber: string;
  whatsappDisplay: string;
  tiktokUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  locationFull: string;
}

export interface TiktokVideo {
  id: string;
  url: string;
  videoId: string;
  caption: string;
  position: number;
}

export interface Advantage {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface PurchaseStep {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  vehicle: string;
}
