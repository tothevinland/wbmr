'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMainRoad, useUploadImage } from '@/hooks/useRoads';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Breadcrumb from '@/components/Breadcrumb';

export default function UploadImagePage() {
  const params = useParams();
  const roadSlug = decodeURIComponent(params.id as string);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const { data: roadData, isLoading: roadLoading } = useMainRoad(roadSlug);
  const uploadImage = useUploadImage(roadSlug);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleFileChange = (file: File) => {
    if (file && file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file (JPEG, PNG, or WebP)');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadImage.mutate(selectedFile, {
        onSuccess: () => {
          router.push(`/roads/${roadSlug}`);
          router.refresh();
        },
      });
    }
  };

  if (authLoading || roadLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Loading text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!roadData) {
    return (
      <div className="container mx-auto px-4 py-16">
        <ErrorMessage message="Failed to load road details" />
      </div>
    );
  }

  const road = roadData.data.road;

  return (
    <div className="container mx-auto px-4 pt-24 pb-16 md:pt-28">
      <div className="max-w-2xl mx-auto">
        <Breadcrumb items={[
          { label: 'Roads', href: '/' },
          { label: road.road_name, href: `/roads/${roadSlug}` },
          { label: 'Upload Image' }
        ]} />
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Upload Image</h1>
          <p className="text-gray-600">
            Add an image for <strong>{road.road_name}</strong>
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive
              ? 'border-accent bg-accent/10'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {preview ? (
            <div>
              <img
                src={preview}
                alt="Preview"
                className="max-w-full h-auto max-h-96 mx-auto rounded-lg mb-4"
              />
              <p className="text-sm text-gray-600 mb-4">
                {selectedFile?.name} ({(selectedFile!.size / 1024 / 1024).toFixed(2)} MB)
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedFile(null);
                  setPreview(null);
                }}
              >
                Choose Different Image
              </Button>
            </div>
          ) : (
            <div>
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium mb-2">
                Drag and drop an image here
              </p>
              <p className="text-sm text-gray-600 mb-4">or</p>
              <label className="btn-primary cursor-pointer">
                Browse Files
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-4">
                Supported formats: JPEG, PNG, WebP (max 10MB)
              </p>
            </div>
          )}
        </div>

        {selectedFile && (
          <div className="flex gap-4 mt-8">
            <Button
              onClick={handleUpload}
              isLoading={uploadImage.isPending}
              variant="accent"
            >
              Upload Image
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
