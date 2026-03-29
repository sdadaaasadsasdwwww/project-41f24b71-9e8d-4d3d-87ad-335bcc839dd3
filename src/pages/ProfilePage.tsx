import { User, LogOut, Settings, Package, Shield } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { orders } = useStore();
  const { user, profile, loading, signOut, isAdmin } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Завантаження...</p></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const handleSignOut = async () => {
    await signOut();
    toast.success('Ви вийшли з акаунту');
  };

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
              <h3 className="heading-card">{profile?.display_name || 'Користувач'}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            {isAdmin && (
              <Link to="/admin" className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3 text-sm block">
                <Shield className="h-4 w-4 text-primary" /> Адмін-панель
              </Link>
            )}
            <button onClick={handleSignOut} className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3 text-sm text-destructive">
              <LogOut className="h-4 w-4" /> Вийти
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="heading-section mb-6">Історія замовлень</h2>
          {orders.length === 0 ? (
            <p className="text-muted-foreground">Поки немає замовлень</p>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-card border border-border/50 rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-sm">Замовлення #{order.id.slice(0, 8)}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{order.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{order.date} · {order.items.length} товарів</p>
                  </div>
                  <span className="font-bold">{order.total} ₴</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
