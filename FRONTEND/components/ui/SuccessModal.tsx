'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  onButtonClick?: () => void;
  secondaryButtonText?: string;
  onSecondaryButtonClick?: () => void;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  buttonText = 'Continue',
  onButtonClick,
  secondaryButtonText,
  onSecondaryButtonClick,
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-scaleIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <XMarkIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
        </button>

        {/* Icon with Circle */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            {/* Circle background */}
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center animate-pulse-once">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src="/checkmark.png"
                  alt="Success"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 40px, 48px"
                  priority
                />
              </div>
            </div>
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ripple"></div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{message}</p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={onButtonClick || onClose}
            className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {buttonText}
          </button>
          {secondaryButtonText && (
            <button
              onClick={onSecondaryButtonClick || onClose}
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition font-medium"
            >
              {secondaryButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
