/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning';
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export default function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg border backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-800 dark:bg-emerald-950/95 dark:border-emerald-800 dark:text-emerald-200'
                : toast.type === 'warning'
                ? 'bg-amber-50/95 border-amber-200 text-amber-800 dark:bg-amber-950/95 dark:border-amber-800 dark:text-amber-200'
                : 'bg-slate-50/95 border-slate-200 text-slate-800 dark:bg-slate-900/95 dark:border-slate-800 dark:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-[#FF6B00] shrink-0" />}
              <p className="text-sm font-medium font-sans">{toast.text}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
