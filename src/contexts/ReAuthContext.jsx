import { createContext, useState, useEffect, useContext } from 'react';
import ReAuthModal from '../components/ReAuthModal';

const ReAuthContext = createContext(null);

export const ReAuthProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 👂 Listen for API trigger (from 403 REAUTH_REQUIRED)
    const handleReauthRequest = () => {
      setIsOpen(true);
    };

    window.addEventListener('reauth-required', handleReauthRequest);

    return () => {
      window.removeEventListener('reauth-required', handleReauthRequest);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // 🚨 Dispatch cancel event so pending API requests don't hang forever
    window.dispatchEvent(new CustomEvent('reauth-cancelled'));
  };

  const handleSuccess = () => {
    setIsOpen(false);
    // ✅ Dispatch success event so API can retry the original request
    window.dispatchEvent(new CustomEvent('reauth-success'));
  };

  return (
    <ReAuthContext.Provider value={{ openReAuth: () => setIsOpen(true) }}>
      {children}
      <ReAuthModal 
        isOpen={isOpen} 
        onClose={handleClose} 
        onSuccess={handleSuccess} 
      />
    </ReAuthContext.Provider>
  );
};

export const useReAuth = () => {
  const context = useContext(ReAuthContext);
  if (!context) {
    throw new Error('useReAuth must be used within a ReAuthProvider');
  }
  return context;
};
