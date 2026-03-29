import { useState, useEffect } from 'react';
import { Settings, MessageSquare, Package, BarChart3, ShoppingBag, ArrowLeft, Plus, Trash2, Pencil, Check, X, Send, Users, Image, Shield, UserPlus, UserMinus } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/data/products';
import { toast } from 'sonner';

const tabs = [
  { id: 'orders', label: 'Замовлення', icon: Package },
  { id: 'products', label: 'Товари', icon: ShoppingBag },
  { id: 'categories', label: 'Категорії', icon: BarChart3 },
  { id: 'chats', label: 'Чати', icon: MessageSquare },
  { id: 'admins', label: 'Адміністратори', icon: Shield },
  { id: 'settings', label: 'Налаштування', icon: Settings },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const store = useStore();
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Завантаження...</p></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h1 className="heading-display text-2xl mb-2">Доступ заборонено</h1>
      <p className="text-muted-foreground">У вас немає прав адміністратора.</p>
      <Link to="/" className="inline-block mt-4 text-primary hover:underline">На головну</Link>
    </div>
  );

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
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'categories' && <CategoriesTab />}
          {activeTab === 'chats' && <ChatsTab />}
          {activeTab === 'admins' && <AdminsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}

function OrdersTab() {
  const { orders, updateOrderStatus } = useStore();
  const statuses = ['Новий', 'В обробці', 'В дорозі', 'Доставлено', 'Скасовано'];

  return (
    <div>
      <h2 className="heading-section mb-4">Замовлення</h2>
      {orders.length === 0 ? (
        <p className="text-muted-foreground">Поки немає замовлень</p>
      ) : (
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o.id} className="p-4 border border-border/50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm">#{o.id.slice(0, 8)} — {o.customerName}</p>
                  <p className="text-xs text-muted-foreground">{o.date} · {o.phone}</p>
                  <p className="text-xs text-muted-foreground">{o.address}</p>
                  {o.comment && <p className="text-xs text-muted-foreground italic mt-1">"{o.comment}"</p>}
                </div>
                <div className="text-right">
                  <select
                    value={o.status}
                    onChange={e => { updateOrderStatus(o.id, e.target.value); toast('Статус оновлено'); }}
                    className="text-xs px-2 py-1 rounded border border-border bg-background"
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <p className="font-bold text-sm mt-1">{o.total} ₴</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {o.items.map((item, i) => (
                  <span key={i}>{item.product.name} ×{item.quantity}{i < o.items.length - 1 ? ', ' : ''}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductsTab() {
  const { products, addProduct, deleteProduct, categories } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || '');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImageUrl(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !imageUrl) {
      toast.error('Заповніть обов\'язкові поля');
      return;
    }
    const product: Product = {
      id: crypto.randomUUID(),
      name,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      image: imageUrl,
      category,
      description,
      rating: 0,
      reviewCount: 0,
    };
    addProduct(product);
    toast.success('Товар додано!');
    setName(''); setPrice(''); setOldPrice(''); setDescription(''); setImageUrl(''); setImagePreview('');
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="heading-section">Товари ({products.length})</h2>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Додати товар
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-border/50 rounded-lg space-y-3 bg-background">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1">Назва *</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card" placeholder="Назва товару" />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Категорія</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Ціна (₴) *</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card" placeholder="0" />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Стара ціна (₴)</label>
              <input type="number" value={oldPrice} onChange={e => setOldPrice(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card" placeholder="Необов'язково" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Опис</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card" rows={2} placeholder="Опис товару" />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Фото *</label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm cursor-pointer hover:bg-accent transition-colors">
                <Image className="h-4 w-4" /> Завантажити фото
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              <span className="text-xs text-muted-foreground">або</span>
              <input
                value={imagePreview ? '' : imageUrl}
                onChange={e => { setImageUrl(e.target.value); setImagePreview(''); }}
                className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-card"
                placeholder="URL зображення"
                disabled={!!imagePreview}
              />
            </div>
            {imagePreview && (
              <div className="mt-2 relative inline-block">
                <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-lg object-cover" />
                <button type="button" onClick={() => { setImageUrl(''); setImagePreview(''); }} className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Зберегти</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border border-border rounded-lg text-sm hover:bg-accent transition-colors">Скасувати</button>
          </div>
        </form>
      )}

      {products.length === 0 ? (
        <p className="text-muted-foreground">Поки немає товарів. Додайте перший!</p>
      ) : (
        <div className="space-y-2">
          {products.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
              <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.price} ₴</p>
              </div>
              <button onClick={() => { deleteProduct(p.id); toast('Товар видалено'); }} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CategoriesTab() {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('🌸');

  const startEdit = (id: string, name: string, icon: string) => {
    setEditingId(id);
    setEditName(name);
    setEditIcon(icon);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      updateCategory(editingId, { name: editName.trim(), icon: editIcon });
      toast.success('Категорію оновлено');
    }
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!newName.trim()) { toast.error('Введіть назву'); return; }
    addCategory({ id: newName.trim().toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(), name: newName.trim(), icon: newIcon });
    toast.success('Категорію додано');
    setNewName(''); setNewIcon('🌸'); setShowAdd(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="heading-section">Категорії ({categories.length})</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Додати категорію
        </button>
      </div>

      {showAdd && (
        <div className="mb-4 p-4 border border-border/50 rounded-lg bg-background flex flex-wrap items-end gap-3">
          <div>
            <label className="text-xs font-medium block mb-1">Іконка (емодзі)</label>
            <input value={newIcon} onChange={e => setNewIcon(e.target.value)} className="w-16 border border-border rounded-lg px-3 py-2 text-sm bg-card text-center" />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs font-medium block mb-1">Назва</label>
            <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card" placeholder="Назва категорії" />
          </div>
          <button onClick={handleAdd} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Додати</button>
          <button onClick={() => setShowAdd(false)} className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-accent transition-colors">Скасувати</button>
        </div>
      )}

      <div className="space-y-2">
        {categories.map(c => (
          <div key={c.id} className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
            {editingId === c.id ? (
              <>
                <input value={editIcon} onChange={e => setEditIcon(e.target.value)} className="w-12 border border-border rounded-lg px-2 py-1.5 text-sm bg-background text-center" />
                <input value={editName} onChange={e => setEditName(e.target.value)} className="flex-1 border border-border rounded-lg px-3 py-1.5 text-sm bg-background" autoFocus onKeyDown={e => e.key === 'Enter' && saveEdit()} />
                <button onClick={saveEdit} className="p-1.5 text-secondary hover:bg-accent rounded"><Check className="h-4 w-4" /></button>
                <button onClick={() => setEditingId(null)} className="p-1.5 text-muted-foreground hover:bg-accent rounded"><X className="h-4 w-4" /></button>
              </>
            ) : (
              <>
                <span className="text-xl">{c.icon}</span>
                <span className="flex-1 text-sm font-medium">{c.name}</span>
                <button onClick={() => startEdit(c.id, c.name, c.icon)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-accent rounded transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => { deleteCategory(c.id); toast('Категорію видалено'); }} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-accent rounded transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatsTab() {
  const { chats, addChat, addMessageToChat } = useStore();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [newMsg, setNewMsg] = useState('');

  const activeChat = chats.find(c => c.id === activeChatId);

  const handleSend = () => {
    if (!newMsg.trim() || !activeChatId) return;
    addMessageToChat(activeChatId, {
      id: crypto.randomUUID(),
      sender: 'admin',
      text: newMsg.trim(),
      time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
    });
    setNewMsg('');
  };

  return (
    <div>
      <h2 className="heading-section mb-4">Чати з клієнтами</h2>
      {chats.length === 0 ? (
        <p className="text-muted-foreground">Поки немає чатів. Чати з'являться коли клієнти напишуть вам.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[300px]">
          <div className="space-y-2 border-r border-border pr-4">
            {chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${activeChatId === chat.id ? 'bg-accent' : 'hover:bg-accent/50'}`}
              >
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{chat.clientName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {chat.messages[chat.messages.length - 1]?.text || 'Немає повідомлень'}
                  </p>
                </div>
                {chat.unread && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
              </button>
            ))}
          </div>

          <div className="md:col-span-2 flex flex-col">
            {activeChat ? (
              <>
                <div className="flex-1 overflow-y-auto space-y-2 mb-3 max-h-[250px]">
                  {activeChat.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${msg.sender === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.sender === 'admin' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={newMsg}
                    onChange={e => setNewMsg(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ваше повідомлення..."
                    className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-background"
                  />
                  <button onClick={handleSend} className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-10">Оберіть чат зліва</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface AdminInfo {
  user_id: string;
  display_name: string;
  email: string;
}

function AdminsTab() {
  const [admins, setAdmins] = useState<AdminInfo[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { session } = useAuth();

  const fetchAdmins = async () => {
    setLoadingAdmins(true);
    const { data } = await supabase.functions.invoke('admin-manage-roles', {
      body: { action: 'list_admins' },
    });
    setAdmins(data?.admins || []);
    setLoadingAdmins(false);
  };

  useEffect(() => { fetchAdmins(); }, []);

  const grantAdmin = async () => {
    if (!email.trim()) { toast.error('Введіть email'); return; }
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke('admin-manage-roles', {
      body: { action: 'grant_admin', email: email.trim() },
    });
    if (error || data?.error) {
      toast.error(data?.error || 'Помилка');
    } else {
      toast.success('Адмін-права надано!');
      setEmail('');
      fetchAdmins();
    }
    setSubmitting(false);
  };

  const revokeAdmin = async (userId: string) => {
    const { data, error } = await supabase.functions.invoke('admin-manage-roles', {
      body: { action: 'revoke_admin', user_id: userId },
    });
    if (error || data?.error) {
      toast.error(data?.error || 'Помилка');
    } else {
      toast.success('Адмін-права знято');
      fetchAdmins();
    }
  };

  return (
    <div>
      <h2 className="heading-section mb-4">Адміністратори</h2>

      <div className="mb-6 p-4 border border-border/50 rounded-lg bg-background">
        <h3 className="text-sm font-medium mb-2 flex items-center gap-2"><UserPlus className="h-4 w-4" /> Додати адміністратора</h3>
        <div className="flex gap-2">
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && grantAdmin()}
            placeholder="Email користувача"
            className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-card"
          />
          <button onClick={grantAdmin} disabled={submitting}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
            {submitting ? '...' : 'Додати'}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Користувач повинен бути зареєстрований на сайті</p>
      </div>

      {loadingAdmins ? (
        <p className="text-muted-foreground">Завантаження...</p>
      ) : admins.length === 0 ? (
        <p className="text-muted-foreground">Немає адміністраторів</p>
      ) : (
        <div className="space-y-2">
          {admins.map(a => (
            <div key={a.user_id} className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{a.display_name}</p>
                <p className="text-xs text-muted-foreground">{a.email}</p>
              </div>
              <button
                onClick={() => revokeAdmin(a.user_id)}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                title="Зняти адмін-права"
              >
                <UserMinus className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsTab() {
  const { settings, updateSettings } = useStore();
  const [form, setForm] = useState(settings);

  const handleSave = () => {
    updateSettings(form);
    toast.success('Налаштування збережено!');
  };

  return (
    <div>
      <h2 className="heading-section mb-4">Налаштування сайту</h2>
      <div className="space-y-4 max-w-md">
        <div>
          <label className="text-sm font-medium block mb-1">Назва магазину</label>
          <input value={form.shopName} onChange={e => setForm({ ...form, shopName: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2 text-sm bg-background" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Телефон</label>
          <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2 text-sm bg-background" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Email</label>
          <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2 text-sm bg-background" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Адреса</label>
          <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2 text-sm bg-background" />
        </div>
        <button onClick={handleSave} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          Зберегти зміни
        </button>
      </div>
    </div>
  );
}
