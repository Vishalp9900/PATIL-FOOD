import React, { useEffect } from 'react';
import { ToastNotification } from '../types';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  notification: ToastNotification | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm w-full shadow-2xl rounded-2xl overflow-hidden border border-slate-100">
      <div className={`p-4 flex items-start gap-3 backdrop-blur-md ${
        notification.type === 'success' 
          ? 'bg-emerald-900/95 text-white border-l-4 border-emerald-500' 
          : notification.type === 'error'
          ? 'bg-rose-900/95 text-white border-l-4 border-rose-500'
          : 'bg-slate-900/95 text-white border-l-4 border-amber-500'
      }`}>
        <div className="shrink-0 mt-0.5">
          {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
          {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
          {notification.type === 'info' && <Info className="w-5 h-5 text-amber-400" />}
        </div>
        
        <div className="flex-1 text-sm font-semibold leading-snug pr-2">
          {notification.message}
        </div>

        <button 
          onClick={onClose} 
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
