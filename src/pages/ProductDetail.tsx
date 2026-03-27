import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, ArrowLeft, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { reviews } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useStore } from '@/contexts/StoreContext';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useStore();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Товар не знайдено</p>
        <Link to="/catalog" className="text-primary hover:underline mt-4 inline-block">Повернутися до каталогу</Link>
      </div>
    );
  }

  const productReviews = reviews.filter(r => r.productId === product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const fav = isFavorite(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    toast(`Додано ${qty} шт. до кошика`);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <Link to="/catalog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4" /> Назад до каталогу
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1 mb-3">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-muted-foreground">({product.reviewCount} відгуків)</span>
          </div>

          <h1 className="heading-display text-3xl md:text-4xl mb-4">{product.name}</h1>
          <p className="text-body mb-6">{product.description}</p>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-foreground">{product.price} ₴</span>
            {product.oldPrice && <span className="text-lg text-muted-foreground line-through">{product.oldPrice} ₴</span>}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-border rounded-lg">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-accent transition-colors"><Minus className="h-4 w-4" /></button>
              <span className="px-4 font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-accent transition-colors"><Plus className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleAddToCart} className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              <ShoppingBag className="h-5 w-5" /> Додати до кошика
            </button>
            <button onClick={() => { toggleFavorite(product.id); toast(fav ? 'Видалено з обраного' : 'Додано до обраного'); }} className="p-3 border border-border rounded-lg hover:bg-accent transition-colors">
              <Heart className={`h-5 w-5 ${fav ? 'fill-primary text-primary' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {productReviews.length > 0 && (
        <section className="mb-16">
          <h2 className="heading-section mb-6">Відгуки ({productReviews.length})</h2>
          <div className="space-y-4">
            {productReviews.map(r => (
              <div key={r.id} className="bg-card border border-border/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{r.author}</span>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-border'}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section>
          <h2 className="heading-section mb-6">Схожі товари</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
