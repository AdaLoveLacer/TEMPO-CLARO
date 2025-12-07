import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/GoogleLoginButton.css';

export const GoogleLoginButton = () => {
  const { handleLogin } = useAuth();
  const googleButtonRef = useRef(null);

  useEffect(() => {
    const renderButton = () => {
      if (window.google && googleButtonRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleLogin,
            auto_select: false
          });

          window.google.accounts.id.renderButton(
            googleButtonRef.current,
            { type: 'standard', size: 'large', text: 'signin_with', theme: 'outline', width: '250' }
          );
          return true;
        } catch (e) {
          console.error(e);
          return false;
        }
      }
      return false;
    };

    if (!renderButton()) {
      const timer = setInterval(() => {
        if (renderButton()) clearInterval(timer);
      }, 500);
      return () => clearInterval(timer);
    }
  }, [handleLogin]);

  return (
    <div className="google-login-button-wrapper">
      <div ref={googleButtonRef} id="googleButton" style={{minHeight: '40px', minWidth: '200px'}}></div>
    </div>
  );
};