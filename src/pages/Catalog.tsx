import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/data/products';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const [sortBy, setSortBy] = useState('popular');
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const suggestions = query.length >= 1
    ? products.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : [];

  const filtered = products
    .filter(p => activeCategory === 'all' || p.category === activeCategory)
    .filter(p => !query || p.name.toLowerCase().includes(query.toLowerCase()));

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

      {/* Search */}
      <div ref={wrapperRef} className="relative mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Пошук квітів..."
            className="w-full pl-10 pr-9 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
          {query && (
            <button onClick={() => { setQuery(''); inputRef.current?.focus(); }} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-20 mt-1 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden">
            {suggestions.map(p => (
              <button
                key={p.id}
                onClick={() => { setQuery(p.name); setShowSuggestions(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-accent transition-colors"
              >
                <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-cover" />
                <div>
                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.price} ₴</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

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
        <p className="text-center text-muted-foreground py-20">
          {query ? `Нічого не знайдено за запитом «${query}»` : 'У цій категорії поки немає товарів'}
        </p>
      )}
    </div>
  );
}
