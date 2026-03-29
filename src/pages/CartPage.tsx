import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, ChevronDown } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useStore } from '@/contexts/StoreContext';
import { useState } from 'react';
import { toast } from 'sonner';

const OBLASTS = [
  'Вінницька', 'Волинська', 'Дніпропетровська', 'Донецька', 'Житомирська',
  'Закарпатська', 'Запорізька', 'Івано-Франківська', 'Київська', 'Кіровоградська',
  'Луганська', 'Львівська', 'Миколаївська', 'Одеська', 'Полтавська',
  'Рівненська', 'Сумська', 'Тернопільська', 'Харківська', 'Херсонська',
  'Хмельницька', 'Черкаська', 'Чернівецька', 'Чернігівська',
];

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const { addOrder } = useStore();
  const [showCheckout, setShowCheckout] = useState(false);

  // Одержувач
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Доставка
  const [delivery, setDelivery] = useState<'nova' | 'ukr'>('nova');
  const [oblast, setOblast] = useState('');
  const [city, setCity] = useState('');
  const [branch, setBranch] = useState('');

  // Оплата
  const [payment] = useState('cod');

  // Коментар та промокод
  const [comment, setComment] = useState('');
  const [promo, setPromo] = useState('');

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

  const deliveryCost = totalPrice >= 1000 ? 0 : 150;
  const fullName = `${lastName} ${firstName} ${patronymic}`.trim();
  const deliveryLabel = delivery === 'nova' ? 'Нова Пошта' : 'Укрпошта';
  const addressString = `${deliveryLabel}, ${oblast} обл., ${city}, відд. ${branch}`;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastName || !firstName || !phone || !oblast || !city || !branch) {
      toast.error("Заповніть обов'язкові поля");
      return;
    }
    addOrder({
      id: crypto.randomUUID(),
      customerName: fullName,
      phone,
      address: addressString,
      comment: `${comment}${promo ? ` | Промокод: ${promo}` : ''} | Email: ${email} | Оплата: Післяплата`,
      items: items.map(i => ({ product: i.product, quantity: i.quantity })),
      total: totalPrice + deliveryCost,
      status: 'Новий',
      date: new Date().toLocaleDateString('uk-UA'),
    });
    toast.success("Замовлення оформлено! Ми зв'яжемося з вами найближчим часом.");
    clearCart();
    setShowCheckout(false);
  };

  const inputCls = "w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors";
  const labelCls = "text-sm font-medium block mb-1.5";
  const selectCls = "w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors";

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
                  <button onClick={() => removeFromCart(product.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
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
            <div className="flex justify-between"><span className="text-muted-foreground">Доставка</span><span>{deliveryCost === 0 ? 'Безкоштовно' : `${deliveryCost} ₴`}</span></div>
          </div>
          <div className="border-t border-border pt-3 mb-6">
            <div className="flex justify-between font-bold text-lg">
              <span>Разом</span><span>{totalPrice + deliveryCost} ₴</span>
            </div>
          </div>

          {!showCheckout ? (
            <button onClick={() => setShowCheckout(true)} className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Оформити замовлення
            </button>
          ) : (
            <form onSubmit={handleCheckout} className="space-y-5">
              {/* Одержувач */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-foreground">👤 Одержувач</h4>
                <div className="space-y-3">
                  <div>
                    <label className={labelCls}>Прізвище *</label>
                    <input required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Прізвище" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Ім'я *</label>
                    <input required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Ім'я" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>По батькові</label>
                    <input value={patronymic} onChange={e => setPatronymic(e.target.value)} placeholder="По батькові" className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Контакти */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-foreground">📞 Контакти</h4>
                <div className="space-y-3">
                  <div>
                    <label className={labelCls}>Телефон *</label>
                    <input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+380 (__) ___-__-__" type="tel" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>E-mail</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Доставка */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-foreground">🚚 Доставка</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setDelivery('nova')}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium border transition-colors ${delivery === 'nova' ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-accent'}`}>
                      Нова Пошта
                    </button>
                    <button type="button" onClick={() => setDelivery('ukr')}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium border transition-colors ${delivery === 'ukr' ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-accent'}`}>
                      Укрпошта
                    </button>
                  </div>

                  <div className="relative">
                    <label className={labelCls}>Регіон / Область *</label>
                    <select required value={oblast} onChange={e => setOblast(e.target.value)} className={selectCls}>
                      <option value="">Оберіть область</option>
                      {OBLASTS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-[calc(50%+4px)] h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>

                  <div>
                    <label className={labelCls}>Місто *</label>
                    <input required value={city} onChange={e => setCity(e.target.value)} placeholder="Введіть назву міста" className={inputCls} />
                  </div>

                  <div>
                    <label className={labelCls}>Відділення *</label>
                    <input required value={branch} onChange={e => setBranch(e.target.value)} placeholder={`Номер відділення ${deliveryLabel}`} className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Оплата */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-foreground">💳 Спосіб оплати</h4>
                <div className="p-3 border border-primary bg-primary/5 rounded-lg flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm font-medium">Післяплата (оплата при отриманні)</span>
                </div>
              </div>

              {/* Промокод */}
              <div>
                <label className={labelCls}>Промокод</label>
                <input value={promo} onChange={e => setPromo(e.target.value)} placeholder="Введіть промокод" className={inputCls} />
              </div>

              {/* Коментар */}
              <div>
                <label className={labelCls}>Коментар до замовлення</label>
                <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Побажання до замовлення..." className={`${inputCls} resize-none`} rows={3} />
              </div>

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
