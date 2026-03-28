import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Flower2, Mail, Lock, User as UserIcon } from 'lucide-react';

export default function AuthPage() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Завантаження...</p></div>;
  if (user) return <Navigate to="/profile" replace />;

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Flower2 className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="heading-display text-2xl">
            {mode === 'login' ? 'Вхід' : mode === 'register' ? 'Реєстрація' : 'Скидання пароля'}
          </h1>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6">
          {mode === 'login' && <LoginForm onSwitch={setMode} />}
          {mode === 'register' && <RegisterForm onSwitch={setMode} />}
          {mode === 'forgot' && <ForgotForm onSwitch={setMode} />}
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onSwitch }: { onSwitch: (m: 'login' | 'register' | 'forgot') => void }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    if (error) toast.error('Невірний email або пароль');
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium block mb-1">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm" placeholder="your@email.com" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Пароль</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm" placeholder="••••••••" />
        </div>
      </div>
      <button type="submit" disabled={submitting}
        className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
        {submitting ? 'Вхід...' : 'Увійти'}
      </button>
      <div className="flex justify-between text-sm">
        <button type="button" onClick={() => onSwitch('forgot')} className="text-primary hover:underline">Забули пароль?</button>
        <button type="button" onClick={() => onSwitch('register')} className="text-primary hover:underline">Створити акаунт</button>
      </div>
    </form>
  );
}

function RegisterForm({ onSwitch }: { onSwitch: (m: 'login' | 'register' | 'forgot') => void }) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Пароль має бути мінімум 6 символів'); return; }
    setSubmitting(true);
    const { error } = await signUp(email, password, name);
    if (error) toast.error(error.message);
    else toast.success('Акаунт створено! Перевірте email для підтвердження.');
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium block mb-1">Ім'я</label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm" placeholder="Ваше ім'я" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm" placeholder="your@email.com" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Пароль</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm" placeholder="Мінімум 6 символів" />
        </div>
      </div>
      <button type="submit" disabled={submitting}
        className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
        {submitting ? 'Реєстрація...' : 'Зареєструватися'}
      </button>
      <p className="text-center text-sm text-muted-foreground">
        Вже є акаунт? <button type="button" onClick={() => onSwitch('login')} className="text-primary hover:underline">Увійти</button>
      </p>
    </form>
  );
}

function ForgotForm({ onSwitch }: { onSwitch: (m: 'login' | 'register' | 'forgot') => void }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await resetPassword(email);
    if (error) toast.error(error.message);
    else toast.success('Лист для скидання пароля надіслано на ваш email');
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">Введіть email і ми надішлемо посилання для скидання пароля.</p>
      <div>
        <label className="text-sm font-medium block mb-1">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm" placeholder="your@email.com" />
        </div>
      </div>
      <button type="submit" disabled={submitting}
        className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
        {submitting ? 'Надсилання...' : 'Надіслати посилання'}
      </button>
      <p className="text-center text-sm">
        <button type="button" onClick={() => onSwitch('login')} className="text-primary hover:underline">Повернутися до входу</button>
      </p>
    </form>
  );
}
