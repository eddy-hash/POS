'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SuccessMessageProps {
  message: string;
  subMessage?: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function SuccessMessage({
  message,
  subMessage,
  onClose,
  autoClose = true,
  autoCloseDelay = 3000,
}: SuccessMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) setTimeout(onClose, 300);
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform animate-scaleIn">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center animate-pulse-once">
              <Image
                src="/checkmark.png"
                alt="Success"
                width={48}
                height={48}
                className="animate-bounce-in"
                priority
              />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ripple"></div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {message}
          </h3>
          {subMessage && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {subMessage}
            </p>
          )}

          {!autoClose && onClose && (
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
