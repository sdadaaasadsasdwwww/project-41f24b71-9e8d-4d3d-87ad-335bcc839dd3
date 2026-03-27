import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/data/products';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const [sortBy, setSortBy] = useState('popular');

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviewCount - a.reviewCount;
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="heading-display mb-2">Каталог</h1>
      <p className="text-body mb-8">Оберіть ідеальний букет для будь-якої нагоди</p>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={() => setSearchParams({})}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}
        >
          Всі
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setSearchParams({ category: c.id })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === c.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}
          >
            {c.icon} {c.name}
          </button>
        ))}

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="ml-auto px-4 py-2 rounded-lg border border-border bg-card text-sm text-foreground"
        >
          <option value="popular">За популярністю</option>
          <option value="price-asc">Ціна: від низької</option>
          <option value="price-desc">Ціна: від високої</option>
          <option value="rating">За рейтингом</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sorted.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      {sorted.length === 0 && (
        <p className="text-center text-muted-foreground py-20">У цій категорії поки немає товарів</p>
      )}
    </div>
  );
}
