import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Clock } from 'lucide-react';
import heroImage from '@/assets/hero-flowers.jpg';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/data/products';

const features = [
  { icon: Truck, title: 'Безкоштовна доставка', desc: 'При замовленні від 1000 ₴' },
  { icon: Shield, title: 'Гарантія свіжості', desc: 'Квіти простоять 7+ днів' },
  { icon: Clock, title: 'Швидка доставка', desc: 'Протягом 2 годин по Києву' },
];

export default function Index() {
  const featured = products.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[500px] overflow-hidden">
        <img src={heroImage} alt="Розкішні букети квітів" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl">
            <h1 className="heading-display text-background mb-4 animate-fade-in">
              Квіти, що розповідають історії
            </h1>
            <p className="text-background/80 text-lg mb-8 animate-fade-in" style={{ animationDelay: '0.15s' }}>
              Створюємо неповторні букети з любов'ю та увагою до кожної деталі. Доставка по всій Україні.
            </p>
            <div className="flex gap-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Переглянути каталог <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="bg-card rounded-xl p-6 border border-border/50 flex items-center gap-4 shadow-sm">
              <div className="p-3 rounded-full bg-accent">
                <f.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="heading-section text-center mb-10">Категорії</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map(c => (
            <Link
              key={c.id}
              to={`/catalog?category=${c.id}`}
              className="flex items-center gap-2 px-6 py-3 bg-card border border-border/50 rounded-full hover:border-primary/30 hover:bg-accent transition-all"
            >
              <span className="text-xl">{c.icon}</span>
              <span className="font-medium text-sm text-foreground">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="container mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="heading-section">Популярні товари</h2>
          <Link to="/catalog" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            Всі товари <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
