import { Link } from 'react-router-dom';
import { Minus, Plus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CartPage() {
  const { items, updateQuantity, clearCart, totalPrice } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="heading-section mb-2">Кошик порожній</h1>
        <p className="text-muted-foreground mb-6">Додайте квіти, щоб оформити замовлення</p>
        <Link to="/catalog" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Переглянути каталог
        </Link>
      </div>
    );
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Замовлення оформлено! Ми зв\'яжемося з вами найближчим часом.');
    clearCart();
    setShowCheckout(false);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <Link to="/catalog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4" /> Продовжити покупки
      </Link>

      <h1 className="heading-display mb-8">Кошик</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 bg-card border border-border/50 rounded-xl p-4">
              <Link to={`/product/${product.id}`} className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${product.id}`}><h3 className="heading-card text-base">{product.name}</h3></Link>
                <p className="text-sm text-muted-foreground mt-1">{product.price} ₴</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-border rounded-md">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="p-1.5 hover:bg-accent"><Minus className="h-3 w-3" /></button>
                    <span className="px-3 text-sm">{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)} className="p-1.5 hover:bg-accent"><Plus className="h-3 w-3" /></button>
                  </div>
                </div>
              </div>
              <p className="font-bold text-foreground whitespace-nowrap">{product.price * quantity} ₴</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6 h-fit sticky top-24">
          <h3 className="heading-card mb-4">Підсумок</h3>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between"><span className="text-muted-foreground">Товари</span><span>{totalPrice} ₴</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Доставка</span><span>{totalPrice >= 1000 ? 'Безкоштовно' : '150 ₴'}</span></div>
          </div>
          <div className="border-t border-border pt-3 mb-6">
            <div className="flex justify-between font-bold text-lg">
              <span>Разом</span>
              <span>{totalPrice + (totalPrice >= 1000 ? 0 : 150)} ₴</span>
            </div>
          </div>

          {!showCheckout ? (
            <button onClick={() => setShowCheckout(true)} className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Оформити замовлення
            </button>
          ) : (
            <form onSubmit={handleCheckout} className="space-y-3">
              <input required placeholder="Ваше ім'я" className="w-full border border-border rounded-lg px-4 py-2 text-sm bg-background" />
              <input required placeholder="Телефон" type="tel" className="w-full border border-border rounded-lg px-4 py-2 text-sm bg-background" />
              <input required placeholder="Адреса доставки" className="w-full border border-border rounded-lg px-4 py-2 text-sm bg-background" />
              <textarea placeholder="Коментар до замовлення" className="w-full border border-border rounded-lg px-4 py-2 text-sm bg-background" rows={2} />
              <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Підтвердити замовлення
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
