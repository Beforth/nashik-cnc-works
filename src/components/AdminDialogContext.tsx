'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { cn } from '@/src/lib/utils';

export type AdminConfirmOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
};

type AlertState = {
  kind: 'alert';
  title?: string;
  message: string;
  resolve: () => void;
};

type ConfirmState = {
  kind: 'confirm';
  title?: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  variant: 'danger' | 'default';
  resolve: (ok: boolean) => void;
};

type DialogState = AlertState | ConfirmState | null;

type AdminDialogContextValue = {
  confirm: (opts: AdminConfirmOptions) => Promise<boolean>;
  alert: (message: string, title?: string) => Promise<void>;
};

const AdminDialogContext = createContext<AdminDialogContextValue | null>(null);

export function AdminDialogProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DialogState>(null);

  const confirm = useCallback((opts: AdminConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({
        kind: 'confirm',
        title: opts.title,
        message: opts.message,
        confirmLabel: opts.confirmLabel ?? 'Confirm',
        cancelLabel: opts.cancelLabel ?? 'Cancel',
        variant: opts.variant ?? 'danger',
        resolve,
      });
    });
  }, []);

  const alert = useCallback((message: string, title?: string) => {
    return new Promise<void>((resolve) => {
      setState({
        kind: 'alert',
        title,
        message,
        resolve,
      });
    });
  }, []);

  const dismiss = useCallback(() => {
    setState(null);
  }, []);

  const handleConfirm = useCallback(() => {
    if (!state) return;
    if (state.kind === 'confirm') state.resolve(true);
    else state.resolve();
    dismiss();
  }, [state, dismiss]);

  const handleCancel = useCallback(() => {
    if (state?.kind === 'confirm') {
      state.resolve(false);
      dismiss();
    }
  }, [state, dismiss]);

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (state.kind === 'confirm') state.resolve(false);
      else state.resolve();
      dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state, dismiss]);

  const value: AdminDialogContextValue = { confirm, alert };

  return (
    <AdminDialogContext.Provider value={value}>
      {children}
      {state ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => {
            if (state.kind === 'confirm') handleCancel();
            else handleConfirm();
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={state.title ? 'admin-dialog-title' : undefined}
            aria-describedby="admin-dialog-desc"
            className="max-h-[min(90vh,32rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-border-grey bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {state.title ? (
              <h2
                id="admin-dialog-title"
                className="text-lg font-extrabold text-navy"
              >
                {state.title}
              </h2>
            ) : null}
            <p
              id="admin-dialog-desc"
              className={cn(
                'whitespace-pre-line text-sm leading-relaxed text-muted-grey',
                state.title ? 'mt-3' : '',
              )}
            >
              {state.message}
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              {state.kind === 'confirm' ? (
                <>
                  <button
                    type="button"
                    className="rounded-xl border border-border-grey bg-bg-cloud px-4 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-border-grey/40"
                    onClick={handleCancel}
                  >
                    {state.cancelLabel}
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-95',
                      state.variant === 'danger'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-machine-orange',
                    )}
                    onClick={handleConfirm}
                  >
                    {state.confirmLabel}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="rounded-xl bg-machine-orange px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-95"
                  onClick={handleConfirm}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </AdminDialogContext.Provider>
  );
}

export function useAdminDialog(): AdminDialogContextValue {
  const ctx = useContext(AdminDialogContext);
  if (!ctx) {
    throw new Error('useAdminDialog must be used within AdminDialogProvider');
  }
  return ctx;
}
