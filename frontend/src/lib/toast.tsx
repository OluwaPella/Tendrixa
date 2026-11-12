import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';

type Toast = { id: number; message: string; type: 'success' | 'error' | 'info' };

const ToastContext = createContext<{
  toast: (message: string, type?: Toast['type']) => void;
}>({ toast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 rounded-xl px-4 py-3 shadow-lg border text-sm ${
              t.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : t.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-white border-[var(--color-border)] text-[var(--color-charcoal)]'
            }`}
          >
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
              className="opacity-60 hover:opacity-100"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
