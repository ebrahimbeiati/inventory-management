"use client";

import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import ImagePlaceholder from './ImagePlaceholder';

interface ImageUploaderProps {
  currentImage?: string;
  onImageChange: (base64Image: string | null) => void;
}

const ImageUploader = ({ currentImage, onImageChange }: ImageUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if the file is an image and not too large (max 2MB)
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image file size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target?.result as string;
      setPreviewUrl(base64Image);
      onImageChange(base64Image);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = () => {
    setIsHovering(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
      alert('Please drop an image file');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      alert('Image file size should be less than 2MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target?.result as string;
      setPreviewUrl(base64Image);
      onImageChange(base64Image);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          isHovering 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' 
            : 'border-gray-300 dark:border-gray-600'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative w-full">
            <div className="relative w-48 h-48 mx-auto mb-2 rounded-md overflow-hidden bg-white dark:bg-gray-800">
              <Image 
                src={previewUrl}
                alt="Product image preview"
                layout="fill"
                objectFit="contain"
                className="rounded-md"
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <ImagePlaceholder size="md" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 mt-2">
              Drag & drop an image here, or click to select
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
              PNG, JPG, GIF up to 2MB
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </button>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ImageUploader; 