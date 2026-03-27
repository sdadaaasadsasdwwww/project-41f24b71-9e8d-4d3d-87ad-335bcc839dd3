export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  description: string;
  isNew?: boolean;
  rating: number;
  reviewCount: number;
}

export const categories = [
  { id: 'bouquets', name: 'Букети', icon: '💐' },
  { id: 'roses', name: 'Троянди', icon: '🌹' },
  { id: 'wedding', name: 'Весільні', icon: '💒' },
  { id: 'indoor', name: 'Кімнатні', icon: '🪴' },
  { id: 'gifts', name: 'Подарунки', icon: '🎁' },
];

export const products: Product[] = [];

export const reviews: { id: string; productId: string; author: string; rating: number; text: string; date: string }[] = [];
