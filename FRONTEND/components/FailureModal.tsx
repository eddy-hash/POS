'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface FailureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function FailureModal({
  isOpen,
  onClose,
  title,
  message,
  buttonText = 'Try Again',
  onButtonClick,
}: FailureModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <XMarkIcon className="h-5 w-5 text-slate-400" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative w-20 h-20">
            <Image
              src="/error.png"
              alt="Error"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-red-600 mb-2">{title}</h3>
          <p className="text-slate-500 text-sm">{message}</p>
        </div>

        {/* Button */}
        <button
          onClick={onButtonClick || onClose}
          className="mt-6 w-full px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
