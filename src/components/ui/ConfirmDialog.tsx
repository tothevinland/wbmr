import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
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
        className="absolute inset-0 bg-black bg-opacity-50"
        style={{ top: 0, left: 0, right: 0, bottom: 0 }}
        onClick={onCancel}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
        <div
          className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold mb-3">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex gap-3 justify-end">
            <Button
              onClick={onCancel}
              variant="secondary"
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              isLoading={isLoading}
              variant="primary"
              className="bg-red-500 hover:bg-red-600"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
