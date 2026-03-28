import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Lock, Flower2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setIsRecovery(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Пароль має бути мінімум 6 символів'); return; }
    if (password !== confirm) { toast.error('Паролі не збігаються'); return; }
    setSubmitting(true);
    const { error } = await updatePassword(password);
    if (error) toast.error(error.message);
    else {
      toast.success('Пароль успішно змінено!');
      navigate('/profile');
    }
    setSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Flower2 className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="heading-display text-2xl">Новий пароль</h1>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Новий пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm" placeholder="Мінімум 6 символів" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Підтвердіть пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm" placeholder="Повторіть пароль" />
              </div>
            </div>
            <button type="submit" disabled={submitting}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
              {submitting ? 'Зміна...' : 'Змінити пароль'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
