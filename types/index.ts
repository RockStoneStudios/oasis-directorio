// --- Sanity Utilities ---

interface SanityAssetReference {
  _ref: string;
  _type: "reference";
}

interface SanityAssetLoaded {
  _id: string;
  url: string;
  metadata?: {
    lqip?: string;
    dimensions?: { width: number; height: number };
  };
}

export interface Slug {
  _type: 'slug';
  current: string;
}

export interface GeoPoint {
  _type: 'geopoint';
  lat: number;
  lng: number;
}

export interface SanityImage {
  _type: 'image';
  asset: SanityAssetReference;
  alt?: string;
  hotspot?: any;
  crop?: any;
}

// Usamos Omit para evitar el error ts(2430) al extender
export interface LoadedSanityImage extends Omit<SanityImage, 'asset'> {
  asset: SanityAssetLoaded;
}

// --- Reusable Components ---

export interface Address {
  _type: 'address';
  street: string;
  neighborhood?: string;
  state: string;
  directionDetails?: string;
}

export interface BusinessHours {
  _type: 'businessHours';
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  open: string;
  close: string;
  isClosed: boolean;
}

// --- Main Entities ---

export interface Municipality {
  _id: string;
  _type: 'municipality';
  name: string;
  slug: Slug;
  flag?: LoadedSanityImage;
}

export interface Category {
  _id: string;
  _type: 'category';
  name: string;
  slug: Slug;
  image?: LoadedSanityImage;
  icon?: string;
}

export interface Subcategory {
  _id: string;
  _type: 'subcategory';
  name: string;
  slug: Slug;
  parentCategory: Category;
}

export interface Business {
  _id: string;
  _type: 'business';
  name: string;
  slug: Slug;
  logo?: LoadedSanityImage;
  gallery?: LoadedSanityImage[];
  description: string;
  status: "open" | "closed" | "temporarily_closed";
  hours: BusinessHours[];
  whatsapp: string;
  phone: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  website?: string;
  municipality: Municipality;
  address: Address;
  location: GeoPoint;
  category: Category;
  subcategories: Subcategory[];
  rating: number;
  isFeatured?: boolean;
  createdAt: string;
}

export interface Event {
  _id: string;
  _type: 'event';
  title: string;
  slug: Slug;
  image?: LoadedSanityImage;
  description: string;
  venueName: string;
  date: string;       // startDate
  endDate?: string;   // ¡Muy importante para eventos multidia!
  price?: string;     // Para el campo 'offers'
  municipality: Municipality;
  address: Address;
}

export interface NewsCategory {
  _id: string;
  _type: 'newsCategory';
  name: string;
  image?: LoadedSanityImage;
}

export interface News {
  _id: string;
  _type: 'news';
  title: string;
  slug: Slug;
  content: any;
  image?: LoadedSanityImage;
  category: NewsCategory;
  publishedAt: string;
}

export interface ATM {
  _id: string;
  _type: 'atm';
  title: string;
  location: GeoPoint;
  address: Address;
  recommendation: string;
  bankName?: string;
  municipality: Municipality;
  is24Hours: boolean;
}
