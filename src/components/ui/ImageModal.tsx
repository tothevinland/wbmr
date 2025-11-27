import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  altText: string;
  currentIndex: number;
  totalImages: number;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function ImageModal({
  isOpen,
  imageUrl,
  altText,
  currentIndex,
  totalImages,
  onClose,
  onNext,
  onPrev,
}: ImageModalProps) {
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

  const modalContent = (
    <div className="fixed inset-0 z-[9999]" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
      <div
        className="absolute inset-0 bg-black"
        style={{ top: 0, left: 0, right: 0, bottom: 0 }}
        onClick={onClose}
      />
      <button
        className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-bold z-10"
        onClick={onClose}
      >
        ×
      </button>

      <div className="absolute top-4 left-4 text-white text-sm font-medium z-10">
        {currentIndex + 1} / {totalImages}
      </div>

      {totalImages > 1 && onPrev && (
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-5xl font-bold z-10 p-4"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
        >
          ‹
        </button>
      )}

      <div className="absolute inset-0 flex items-center justify-center" style={{ top: 0, left: 0, right: 0, bottom: 0 }} onClick={onClose}>
        <img
          src={imageUrl}
          alt={altText}
          className="max-w-full max-h-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {totalImages > 1 && onNext && (
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-5xl font-bold z-10 p-4"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
        >
          ›
        </button>
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
}
