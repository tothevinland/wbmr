import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ImageGalleryModalProps {
  isOpen: boolean;
  images: any[];
  roadName: string;
  onClose: () => void;
  onImageClick: (index: number) => void;
  getImageUrl: (image: any) => string;
  getImageMetadata: (image: any) => { uploaded_by: string; uploaded_at: string } | null;
  canDeleteImage: (image: any, username?: string) => boolean;
  currentUsername?: string;
  onDeleteImage: (imageUrl: string) => void;
}

export default function ImageGalleryModal({
  isOpen,
  images,
  roadName,
  onClose,
  onImageClick,
  getImageUrl,
  getImageMetadata,
  canDeleteImage,
  currentUsername,
  onDeleteImage,
}: ImageGalleryModalProps) {
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
        className="absolute inset-0 bg-black overflow-y-auto"
        style={{ top: 0, left: 0, right: 0, bottom: 0 }}
        onClick={onClose}
      >
        <div className="min-h-screen p-4 md:p-8">
          <button
            className="fixed top-4 right-4 text-white hover:text-gray-300 text-4xl font-bold z-10"
            onClick={onClose}
          >
            ×
          </button>

          <h2 className="text-white text-2xl font-bold mb-6 text-center pt-4" onClick={(e) => e.stopPropagation()}>
            All Images ({images.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
            {images.map((image: any, idx: number) => {
              const imageUrl = getImageUrl(image);
              const metadata = getImageMetadata(image);
              const canDelete = canDeleteImage(image, currentUsername);

              return (
                <div key={idx} className="relative">
                  <img
                    src={imageUrl}
                    alt={`${roadName} - ${idx + 1}`}
                    className="w-full rounded cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                      onImageClick(idx);
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {idx + 1}
                  </div>
                  {canDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteImage(imageUrl);
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded z-10"
                    >
                      Delete
                    </button>
                  )}
                  {metadata && (
                    <p className="text-white text-xs mt-2">
                      By {metadata.uploaded_by} · {new Date(metadata.uploaded_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
