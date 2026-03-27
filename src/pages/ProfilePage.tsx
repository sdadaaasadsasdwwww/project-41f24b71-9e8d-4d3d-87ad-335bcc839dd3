import { User, Package, LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockOrders = [
  { id: '1001', date: '2024-03-15', status: 'Доставлено', total: 1250, items: 1 },
  { id: '1002', date: '2024-03-10', status: 'В дорозі', total: 2100, items: 2 },
  { id: '1003', date: '2024-02-28', status: 'Доставлено', total: 3500, items: 1 },
];

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="heading-display mb-8">Особистий кабінет</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile card */}
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
            <Link to="/admin" className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3 text-sm">
              <Settings className="h-4 w-4" /> Адмін-панель
            </Link>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3 text-sm text-destructive">
              <LogOut className="h-4 w-4" /> Вийти
            </button>
          </div>
        </div>

        {/* Orders */}
        <div className="lg:col-span-2">
          <h2 className="heading-section mb-6">Історія замовлень</h2>
          <div className="space-y-4">
            {mockOrders.map(order => (
              <div key={order.id} className="bg-card border border-border/50 rounded-xl p-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-sm">Замовлення #{order.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'Доставлено' ? 'bg-secondary/20 text-secondary' : 'bg-accent text-accent-foreground'}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{order.date} · {order.items} товарів</p>
                </div>
                <span className="font-bold">{order.total} ₴</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
