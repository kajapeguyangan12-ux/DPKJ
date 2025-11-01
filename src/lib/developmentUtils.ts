// Clear all authentication data thoroughly
const clearAllAuthData = () => {
  // Clear localStorage
  const authKeys = [
    'sigede_auth_user',
    'firebase:authUser', 
    'firebase:host',
    'firebase:heartbeat',
    'firebase:previous_websocket_failure'
  ];
  
  authKeys.forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear any Firebase auth state in IndexedDB
  if (typeof window !== 'undefined' && window.indexedDB) {
    try {
      indexedDB.deleteDatabase('firebaseLocalStorageDb');
    } catch (e) {
      console.log('Could not clear IndexedDB:', e);
    }
  }
};

// Development utility to handle HMR-safe logout
export const developmentLogout = () => {
  console.log('🧹 Development Logout: Clearing all auth data');
  
  // Clear all authentication data thoroughly
  clearAllAuthData();
  
  // Clear any pending timeouts/intervals that might interfere
  const highestTimeoutId = setTimeout(";", 9999);
  for (let i = highestTimeoutId; i >= 0; i--) {
    clearTimeout(i);
  }
  
  // Force immediate navigation with most reliable method
  if (process.env.NODE_ENV === 'development') {
    // In development, use location.href for most reliable redirect
    setTimeout(() => {
      window.location.href = '/admin/login';
    }, 10);
  } else {
    // In production, use replace for better performance
    window.location.replace('/admin/login');
  }
};

export { clearAllAuthData };