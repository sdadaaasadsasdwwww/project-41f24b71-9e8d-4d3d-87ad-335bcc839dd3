import { useState } from 'react';
import { User, LogOut, Package, Shield, Pencil, Save, X } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { orders } = useStore();
  const { user, profile, loading, signOut, isAdmin, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ display_name: '', phone: '' });

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Завантаження...</p></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const startEdit = () => {
    setForm({
      display_name: profile?.display_name || '',
      phone: profile?.phone || '',
    });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        display_name: form.display_name || null,
        phone: form.phone || null,
      });
      toast.success('Профіль оновлено');
      setEditing(false);
    } catch {
      toast.error('Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

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
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="space-y-2">
                  <Input
                    placeholder="Ім'я"
                    value={form.display_name}
                    onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                  />
                  <Input
                    placeholder="Телефон"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  />
                </div>
              ) : (
                <>
                  <h3 className="heading-card">{profile?.display_name || 'Користувач'}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {profile?.phone && <p className="text-sm text-muted-foreground">{profile.phone}</p>}
                </>
              )}
            </div>
          </div>

          {editing ? (
            <div className="flex gap-2 mb-4">
              <Button size="sm" onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-1" /> Зберегти
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                <X className="h-4 w-4 mr-1" /> Скасувати
              </Button>
            </div>
          ) : (
            <button onClick={startEdit} className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3 text-sm mb-2">
              <Pencil className="h-4 w-4 text-primary" /> Редагувати профіль
            </button>
          )}

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
