'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

export type AdminConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  /** Default danger (red) for destructive actions. */
  variant?: 'danger' | 'neutral';
};

type AdminDialogContextValue = {
  alert: (message: string, title?: string) => Promise<void>;
  confirm: (options: string | AdminConfirmOptions) => Promise<boolean>;
};

const AdminDialogContext = createContext<AdminDialogContextValue | null>(null);

export function useAdminDialogs(): AdminDialogContextValue {
  const ctx = useContext(AdminDialogContext);
  if (!ctx) {
    throw new Error('useAdminDialogs must be used within AdminDialogProvider');
  }
  return ctx;
}

type AlertState = { title?: string; message: string } | null;
type ConfirmState = AdminConfirmOptions | null;

export function AdminDialogProvider({ children }: { children: React.ReactNode }) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertState, setAlertState] = useState<AlertState>(null);
  const alertResolveRef = useRef<(() => void) | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const confirmResolveRef = useRef<((v: boolean) => void) | null>(null);

  const alertFn = useCallback((message: string, title?: string) => {
    return new Promise<void>((resolve) => {
      alertResolveRef.current = resolve;
      setAlertState({ message, title });
      setAlertOpen(true);
    });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertOpen(false);
    alertResolveRef.current?.();
    alertResolveRef.current = null;
    setAlertState(null);
  }, []);

  const confirmFn = useCallback((options: string | AdminConfirmOptions) => {
    const o: AdminConfirmOptions = typeof options === 'string' ? { message: options } : options;
    return new Promise<boolean>((resolve) => {
      confirmResolveRef.current = resolve;
      setConfirmState({
        title: o.title,
        message: o.message,
        confirmText: o.confirmText ?? 'Confirm',
        cancelText: o.cancelText ?? 'Cancel',
        variant: o.variant ?? 'danger',
      });
      setConfirmOpen(true);
    });
  }, []);

  const finishConfirm = useCallback((ok: boolean) => {
    setConfirmOpen(false);
    setConfirmState(null);
    confirmResolveRef.current?.(ok);
    confirmResolveRef.current = null;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (confirmOpen) finishConfirm(false);
      else if (alertOpen) closeAlert();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [alertOpen, confirmOpen, closeAlert, finishConfirm]);

  const value = useMemo(
    () => ({
      alert: alertFn,
      confirm: confirmFn,
    }),
    [alertFn, confirmFn],
  );

  const overlay = (
    <AnimatePresence>
      {alertOpen && alertState ? (
        <motion.div
          key="admin-alert"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="admin-alert-title"
          aria-describedby="admin-alert-desc"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-navy/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeAlert();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 4 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md rounded-2xl border border-border-grey bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-machine-orange/15 text-machine-orange">
                <AlertCircle className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="admin-alert-title" className="text-lg font-black text-navy">
                  {alertState.title ?? 'Notice'}
                </h2>
                <p id="admin-alert-desc" className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-grey">
                  {alertState.message}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={closeAlert}
                className="rounded-xl bg-navy px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                OK
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
      {confirmOpen && confirmState ? (
        <motion.div
          key="admin-confirm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-confirm-title"
          aria-describedby="admin-confirm-desc"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-navy/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) finishConfirm(false);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 4 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md rounded-2xl border border-border-grey bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="admin-confirm-title" className="text-lg font-black text-navy">
              {confirmState.title ?? 'Please confirm'}
            </h2>
            <p id="admin-confirm-desc" className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-grey">
              {confirmState.message}
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => finishConfirm(false)}
                className="rounded-xl border border-border-grey bg-white px-5 py-2.5 text-sm font-bold text-navy hover:bg-bg-cloud"
              >
                {confirmState.cancelText}
              </button>
              <button
                type="button"
                onClick={() => finishConfirm(true)}
                className={cn(
                  'rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90',
                  confirmState.variant === 'danger' ? 'bg-red-600' : 'bg-navy',
                )}
              >
                {confirmState.confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <AdminDialogContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined' ? createPortal(overlay, document.body) : null}
    </AdminDialogContext.Provider>
  );
}
