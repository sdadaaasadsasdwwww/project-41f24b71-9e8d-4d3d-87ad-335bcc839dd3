import { Link } from 'react-router-dom';
import { Flower2, Phone, Mail, MapPin } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';

export default function Footer() {
  const { settings } = useStore();
  return (
    <footer className="bg-foreground text-background/80 mt-20">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Flower2 className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl font-semibold text-background">{settings.shopName}</span>
          </div>
          <p className="text-sm text-background/60">
            Найкращі квіти для найкращих моментів вашого життя.
          </p>
        </div>

        <div>
          <h4 className="font-serif text-lg font-medium text-background mb-4">Навігація</h4>
          <div className="space-y-2">
            <Link to="/" className="block text-sm hover:text-primary transition-colors">Головна</Link>
            <Link to="/catalog" className="block text-sm hover:text-primary transition-colors">Каталог</Link>
            <Link to="/favorites" className="block text-sm hover:text-primary transition-colors">Обране</Link>
            <Link to="/cart" className="block text-sm hover:text-primary transition-colors">Кошик</Link>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-lg font-medium text-background mb-4">Контакти</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {settings.phone}</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {settings.email}</div>
            
          </div>
        </div>
      </div>
      <div className="border-t border-background/10 py-4 text-center text-xs text-background/40">
        © 2026 {settings.shopName}. Всі права захищені.
      </div>
    </footer>
  );
}
