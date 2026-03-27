import { User, LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="heading-display mb-8">Особистий кабінет</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-card border border-border/50 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
              <User className="h-8 w-8 text-accent-foreground" />
            </div>
            <div>
              <h3 className="heading-card">Гість</h3>
              <p className="text-sm text-muted-foreground">Увійдіть для повного доступу</p>
            </div>
          </div>

          <div className="space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3 text-sm">
              <Settings className="h-4 w-4" /> Налаштування
            </button>
            <Link to="/admin" className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3 text-sm block">
              <Settings className="h-4 w-4" /> Адмін-панель
            </Link>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3 text-sm text-destructive">
              <LogOut className="h-4 w-4" /> Вийти
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="heading-section mb-6">Історія замовлень</h2>
          <p className="text-muted-foreground">Поки немає замовлень</p>
        </div>
      </div>
    </div>
  );
}
