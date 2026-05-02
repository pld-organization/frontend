import { useState, useEffect, useCallback } from 'react';
import storageApi from './data/storageApi';

/**
 * Custom hook to manage the logged-in user's files fetching.
 * Automatically handles the ID and Role context.
 */
export const useMyFiles = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await storageApi.getMyFiles();
      setFiles(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch files');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return { files, isLoading, error, refresh: fetchFiles };
};

/**
 * Custom hook to manage file uploads.
 * Automatically handles the sender's ID and Role.
 */
export const useUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * @param {File} file - The file to upload
   * @param {string} targetId - Optional: The ID of the other party (e.g. if I am a patient, this is the doctorId)
   * @param {string} type - The document type
   */
  const upload = async (file, targetId, type) => {
    setIsUploading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await storageApi.uploadSingleFile(file, targetId, type);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.message || 'Upload failed');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const clearStatus = () => {
    setError(null);
    setSuccess(false);
  };

  return { upload, isUploading, error, success, clearStatus };
};

