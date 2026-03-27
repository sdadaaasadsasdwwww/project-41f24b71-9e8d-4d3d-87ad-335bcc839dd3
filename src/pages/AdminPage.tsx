import { useState } from 'react';
import { Settings, MessageSquare, Package, BarChart3, Users, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const tabs = [
  { id: 'orders', label: 'Замовлення', icon: Package },
  { id: 'products', label: 'Товари', icon: ShoppingBag },
  { id: 'chats', label: 'Чати', icon: MessageSquare },
  { id: 'stats', label: 'Статистика', icon: BarChart3 },
  { id: 'settings', label: 'Налаштування', icon: Settings },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="container mx-auto px-4 py-10">
      <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4" /> Назад до профілю
      </Link>
      <h1 className="heading-display mb-8">Адмін-панель</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
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

        {/* Content */}
        <div className="lg:col-span-3 bg-card border border-border/50 rounded-xl p-6">
          {activeTab === 'orders' && (
            <div>
              <h2 className="heading-section mb-4">Замовлення</h2>
              <div className="space-y-3">
                {[
                  { id: '1001', customer: 'Олена Коваленко', date: '15.03.2024', status: 'Доставлено', total: 1250 },
                  { id: '1002', customer: 'Андрій Шевченко', date: '14.03.2024', status: 'В обробці', total: 2100 },
                  { id: '1003', customer: 'Марія Бондаренко', date: '13.03.2024', status: 'В дорозі', total: 3500 },
                ].map(o => (
                  <div key={o.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-sm">#{o.id} — {o.customer}</p>
                      <p className="text-xs text-muted-foreground">{o.date}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground">{o.status}</span>
                      <p className="font-bold text-sm mt-1">{o.total} ₴</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <h2 className="heading-section mb-4">Управління товарами</h2>
              <p className="text-body">Тут ви зможете додавати, редагувати та видаляти товари з каталогу.</p>
              <button className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                + Додати товар
              </button>
            </div>
          )}

          {activeTab === 'chats' && (
            <div>
              <h2 className="heading-section mb-4">Чати з клієнтами</h2>
              <div className="space-y-3">
                {[
                  { name: 'Олена К.', message: 'Доброго дня, чи є в наявності білі троянди?', time: '2 хв тому', unread: true },
                  { name: 'Андрій С.', message: 'Дякую за швидку доставку!', time: '1 год тому', unread: false },
                  { name: 'Марія П.', message: 'Можна замовити букет на завтра?', time: '3 год тому', unread: true },
                ].map((chat, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${chat.unread ? 'border-primary/30 bg-accent/50' : 'border-border/50 hover:bg-accent/30'}`}>
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <Users className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{chat.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{chat.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.time}</span>
                    {chat.unread && <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div>
              <h2 className="heading-section mb-6">Статистика</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Замовлення сьогодні', value: '12', change: '+3' },
                  { label: 'Дохід сьогодні', value: '15 400 ₴', change: '+18%' },
                  { label: 'Нових клієнтів', value: '5', change: '+2' },
                ].map((s, i) => (
                  <div key={i} className="p-4 border border-border/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-bold mt-1">{s.value}</p>
                    <p className="text-xs text-secondary font-medium">{s.change}</p>
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
