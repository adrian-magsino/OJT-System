'use client'

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function ProfilePictureEditor({ currentProfilePicture, studentName, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);

      await onSave(formData);
      
      // Clean up
      setIsEditing(false);
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setError('Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setError(null);
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    fileInputRef.current?.click();
  };

  const handleRemove = async () => {
    try {
      setIsUploading(true);
      await onSave(null); // Pass null to remove picture
      setIsEditing(false);
    } catch (error) {
      console.error('Error removing profile picture:', error);
      setError('Failed to remove profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}

      {/* Profile Picture Display */}
      <div className="relative group">
        <div 
          data-component="avatar" 
          className="bg-amber-300 w-30 h-30 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200"
        >
          {previewUrl || currentProfilePicture ? (
            <Image
              src={previewUrl || currentProfilePicture}
              alt={`${studentName}'s profile picture`}
              fill
              className="object-cover rounded-full"
              sizes="120px"
            />
          ) : (
            <span className="text-gray-800 font-semibold text-3xl">
              {studentName?.toUpperCase().trim()[0]}
            </span>
          )}
        </div>

        {/* Hover overlay for edit button */}
        {!isEditing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer">
            <button
              onClick={handleEditClick}
              className="text-white text-sm font-medium"
            >
              Edit Photo
            </button>
          </div>
        )}
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex flex-col items-center gap-2">
          {!selectedFile && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              Choose Photo
            </button>
          )}

          {selectedFile && (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isUploading}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isUploading ? 'Uploading...' : 'Save Photo'}
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 disabled:opacity-50 transition-colors"
              >
                Change
              </button>
            </div>
          )}

          <div className="flex gap-2">
            {currentProfilePicture && (
              <button
                onClick={handleRemove}
                disabled={isUploading}
                className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                Remove Photo
              </button>
            )}
            <button
              onClick={handleCancel}
              disabled={isUploading}
              className="px-3 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}