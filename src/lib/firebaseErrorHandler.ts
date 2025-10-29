/**
 * Firebase Error Handler Utility
 * Handles Firestore connection errors dan provides user-friendly messages
 */

import { enableNetwork, disableNetwork } from 'firebase/firestore';
import { db } from './firebase';

let isOfflineMode = false;

/**
 * Handle Firestore backend errors
 */
export const handleFirestoreError = (error: any): string => {
  console.error('Firestore Error:', error);

  const errorMessage = error?.message || '';

  // Timeout error - backend didn't respond
  if (errorMessage.includes('Could not reach Cloud Firestore backend') || 
      errorMessage.includes('Backend didn\'t respond within')) {
    isOfflineMode = true;
    return 'Koneksi ke server Firebase sedang bermasalah. Sistem akan bekerja dalam mode offline. Silakan periksa koneksi internet Anda.';
  }

  // Network error
  if (errorMessage.includes('Network error') || 
      errorMessage.includes('UNAVAILABLE')) {
    isOfflineMode = true;
    return 'Jaringan internet sedang bermasalah. Silakan periksa koneksi internet Anda.';
  }

  // Permission error
  if (errorMessage.includes('Permission denied')) {
    return 'Anda tidak memiliki izin untuk mengakses data ini.';
  }

  // Authentication error
  if (errorMessage.includes('Authentication') || 
      errorMessage.includes('Unauthorized')) {
    return 'Sesi Anda telah berakhir. Silakan login kembali.';
  }

  // Document not found
  if (errorMessage.includes('Document not found') || 
      errorMessage.includes('DOES_NOT_EXIST')) {
    return 'Data tidak ditemukan.';
  }

  // Default error message
  return 'Terjadi kesalahan saat mengakses database. Silakan coba lagi.';
};

/**
 * Retry connection to Firestore
 */
export const retryFirestoreConnection = async (): Promise<boolean> => {
  try {
    if (isOfflineMode) {
      console.log('Attempting to reconnect to Firestore...');
      await enableNetwork(db);
      isOfflineMode = false;
      console.log('Successfully reconnected to Firestore');
      return true;
    }
  } catch (error) {
    console.error('Failed to reconnect to Firestore:', error);
    return false;
  }
  return true;
};

/**
 * Check if currently in offline mode
 */
export const getOfflineModeStatus = (): boolean => {
  return isOfflineMode;
};

/**
 * Set offline mode manually
 */
export const setOfflineMode = (offline: boolean) => {
  isOfflineMode = offline;
};
