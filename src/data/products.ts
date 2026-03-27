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

export const products: Product[] = [
  {
    id: '1',
    name: 'Ніжність троянд',
    price: 1250,
    oldPrice: 1500,
    image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=500&h=500&fit=crop',
    category: 'bouquets',
    description: 'Елегантний букет з рожевих та білих троянд, доповнений евкаліптом. Ідеальний подарунок для коханої людини.',
    rating: 4.8,
    reviewCount: 24,
  },
  {
    id: '2',
    name: 'Червоні троянди (25 шт)',
    price: 2100,
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=500&h=500&fit=crop',
    category: 'roses',
    description: 'Класичний букет з 25 червоних троянд — символ пристрасті та любові.',
    isNew: true,
    rating: 4.9,
    reviewCount: 42,
  },
  {
    id: '3',
    name: 'Весільна композиція',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1522057306606-8d84a0505a60?w=500&h=500&fit=crop',
    category: 'wedding',
    description: 'Розкішна весільна композиція з піоній, троянд та гортензій в ніжних тонах.',
    rating: 5.0,
    reviewCount: 18,
  },
  {
    id: '4',
    name: 'Орхідея Фаленопсіс',
    price: 890,
    image: 'https://images.unsplash.com/photo-1567748157439-651aca2ff064?w=500&h=500&fit=crop',
    category: 'indoor',
    description: 'Елегантна біла орхідея у стильному керамічному горщику.',
    rating: 4.6,
    reviewCount: 31,
  },
  {
    id: '5',
    name: 'Сонячний настрій',
    price: 980,
    oldPrice: 1200,
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=500&h=500&fit=crop',
    category: 'bouquets',
    description: 'Яскравий букет із соняшників та жовтих троянд — заряд позитиву!',
    rating: 4.7,
    reviewCount: 15,
  },
  {
    id: '6',
    name: 'Подарунковий набір "Свято"',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500&h=500&fit=crop',
    category: 'gifts',
    description: 'Букет квітів, коробка цукерок та листівка — все для ідеального подарунку.',
    isNew: true,
    rating: 4.5,
    reviewCount: 8,
  },
  {
    id: '7',
    name: 'Лавандові мрії',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=500&h=500&fit=crop',
    category: 'bouquets',
    description: 'Витончений букет у лавандових тонах з еустомами та фрезіями.',
    rating: 4.8,
    reviewCount: 19,
  },
  {
    id: '8',
    name: 'Білі піонії (15 шт)',
    price: 2800,
    oldPrice: 3200,
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=500&h=500&fit=crop',
    category: 'roses',
    description: 'Розкішний букет із свіжих білих піоній — втілення елегантності.',
    rating: 4.9,
    reviewCount: 36,
  },
];

export const reviews = [
  { id: '1', productId: '1', author: 'Олена К.', rating: 5, text: 'Чудовий букет! Квіти свіжі, доставка вчасно. Дуже задоволена!', date: '2024-03-15' },
  { id: '2', productId: '1', author: 'Марія П.', rating: 5, text: 'Замовляла на день народження мами — вона була в захваті! Дякую!', date: '2024-03-10' },
  { id: '3', productId: '2', author: 'Андрій С.', rating: 5, text: 'Троянди прекрасні, стояли більше тижня. Рекомендую!', date: '2024-03-12' },
  { id: '4', productId: '2', author: 'Іван Д.', rating: 4, text: 'Гарний букет, але хотілося б більшу стрічку.', date: '2024-03-08' },
  { id: '5', productId: '3', author: 'Наталія В.', rating: 5, text: 'Ідеальна композиція для нашого весілля! Всі гості були в захваті.', date: '2024-02-28' },
  { id: '6', productId: '4', author: 'Тетяна Л.', rating: 4, text: 'Орхідея красива, горщик стильний. Трохи менше ніж на фото.', date: '2024-03-05' },
  { id: '7', productId: '5', author: 'Юлія М.', rating: 5, text: 'Соняшники — це завжди гарний настрій! Букет чудовий.', date: '2024-03-14' },
];
