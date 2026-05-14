import { useState, useEffect } from 'react';
import { Sparkle, X } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/store/auth';

const KEY = 'landx:onboarding-seen';

export function OnboardingBanner() {
  const auth = useAuth();
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    if (auth.role === 'guest' && !localStorage.getItem(KEY)) {
      setHidden(false);
    }
  }, [auth.role]);

  if (hidden) return null;

  function dismiss() {
    localStorage.setItem(KEY, '1');
    setHidden(true);
  }

  return (
    <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-accent-700 text-white text-sm">
      <div className="max-w-[1600px] mx-auto px-3 lg:px-6 py-2 flex items-center gap-3">
        <Sparkle size={16} weight="fill" />
        <span className="flex-1 truncate">
          AI-first arsa pazaryeri. Niyetinizi yazın, sonuçları görün. <Link to="/auth" className="underline font-medium">Rol seçerek başlayın</Link>.
        </span>
        <button onClick={dismiss} aria-label="Kapat" className="p-1 rounded-full hover:bg-white/10"><X size={14} /></button>
      </div>
    </div>
  );
}
