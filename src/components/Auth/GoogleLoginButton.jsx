import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/GoogleLoginButton.css';

export const GoogleLoginButton = () => {
  const { handleLogin } = useAuth();
  const googleButtonRef = useRef(null);

  useEffect(() => {
    if (window.google && googleButtonRef.current) {
      // Inicializar Google Sign-In
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleLogin,
        auto_select: false
      });

      // Renderizar o botão do Google
      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        {
          type: 'standard',
          size: 'large',
          text: 'signin_with',
          theme: 'outline'
        }
      );
    }
  }, [handleLogin]);

  return (
    <div className="google-login-button-wrapper">
      <div ref={googleButtonRef} id="googleButton"></div>
    </div>
  );
};
