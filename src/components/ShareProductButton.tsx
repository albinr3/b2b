'use client';

import { useState } from 'react';

type ShareProductButtonProps = {
  title: string;
};

export default function ShareProductButton({ title }: ShareProductButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (!url) return;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Producto', text: title, url });
        return;
      } catch (error) {
        if ((error as Error)?.name === 'AbortError') {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="w-full bg-white border border-slate-300 text-slate-700 font-semibold py-3 px-6 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
    >
      <span className="material-symbols-outlined text-[20px]">share</span>
      {status === 'copied' ? 'Link copiado' : status === 'error' ? 'No se pudo copiar' : 'Compartir producto'}
    </button>
  );
}
