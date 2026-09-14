export type CategoryId = 'ALL' | 'WEDDING' | 'PREWEDDING' | 'PORTRAIT' | 'EVENT' | 'PERSONAL';

export interface PhotoWork {
  id: string;
  title: string;
  category: CategoryId;
  categoryLabel: string;
  image: string;
  aspectRatio: 'portrait' | 'landscape' | 'square' | 'panoramic';
  orientation: 'vertical' | 'horizontal';
  year?: string;
  location?: string;
  alt: string;
}

export interface PhotographerProfile {
  name: string;
  vendorName: string;
  role: string;
  tagline: string;
  portraitImage: string;
  bioIntro: string;
  bioQuote: string;
  email: string;
  whatsapp: string;
  whatsappDisplay: string;
  instagram: string;
  instagramHandle: string;
  location: string;
}
