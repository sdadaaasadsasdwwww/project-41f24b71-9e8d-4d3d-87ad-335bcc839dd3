import { useState } from 'react';
import { Settings, BarChart3, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const tabs = [
  { id: 'products', label: 'Товари', icon: ShoppingBag },
  { id: 'stats', label: 'Статистика', icon: BarChart3 },
  { id: 'settings', label: 'Налаштування', icon: Settings },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="container mx-auto px-4 py-10">
      <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4" /> Назад до профілю
      </Link>
      <h1 className="heading-display mb-8">Адмін-панель</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="bg-card border border-border/50 rounded-xl p-4 h-fit">
          <nav className="space-y-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="lg:col-span-3 bg-card border border-border/50 rounded-xl p-6">
          {activeTab === 'products' && (
            <div>
              <h2 className="heading-section mb-4">Управління товарами</h2>
              <p className="text-body">Тут ви зможете додавати та редагувати товари з каталогу.</p>
              <button className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                + Додати товар
              </button>
            </div>
          )}

          {activeTab === 'stats' && (
            <div>
              <h2 className="heading-section mb-6">Статистика</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Замовлення сьогодні', value: '0' },
                  { label: 'Дохід сьогодні', value: '0 ₴' },
                  { label: 'Нових клієнтів', value: '0' },
                ].map((s, i) => (
                  <div key={i} className="p-4 border border-border/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-bold mt-1">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="heading-section mb-4">Налаштування сайту</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="text-sm font-medium block mb-1">Назва магазину</label>
                  <input defaultValue="Квітковий Рай" className="w-full border border-border rounded-lg px-4 py-2 text-sm bg-background" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Телефон</label>
                  <input defaultValue="+380 (50) 123-45-67" className="w-full border border-border rounded-lg px-4 py-2 text-sm bg-background" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Email</label>
                  <input defaultValue="info@kvitkovyrai.ua" className="w-full border border-border rounded-lg px-4 py-2 text-sm bg-background" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Адреса</label>
                  <input defaultValue="м. Київ, вул. Хрещатик, 1" className="w-full border border-border rounded-lg px-4 py-2 text-sm bg-background" />
                </div>
                <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Зберегти зміни
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
