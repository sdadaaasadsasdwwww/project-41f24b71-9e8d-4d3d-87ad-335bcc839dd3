import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/contexts/StoreContext';
import { useFavorites } from '@/contexts/FavoritesContext';

export default function FavoritesPage() {
  const { products } = useStore();
  const { favorites } = useFavorites();
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="heading-section mb-2">Обране порожнє</h1>
        <p className="text-muted-foreground mb-6">Додайте товари до обраного, натиснувши на серце</p>
        <Link to="/catalog" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Переглянути каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="heading-display mb-2">Обране</h1>
      <p className="text-body mb-8">{favoriteProducts.length} товарів</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {favoriteProducts.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
