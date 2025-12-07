import React, { createContext, useState, useCallback, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokenClient, setTokenClient] = useState(null);

  useEffect(() => {
    // 1. Carregar usuário salvo
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // 2. Função robusta para iniciar o Token Client (Calendário)
    const initTokenClient = () => {
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        try {
          const client = window.google.accounts.oauth2.initTokenClient({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/calendar',
            callback: (tokenResponse) => {
              if (tokenResponse && tokenResponse.access_token) {
                setAccessToken(tokenResponse.access_token);
              }
            },
          });
          setTokenClient(client);
          return true; // Sucesso
        } catch (err) {
          console.error("Erro ao iniciar token client:", err);
          return false;
        }
      }
      return false; // Google ainda não carregou
    };

    // 3. Tenta iniciar imediatamente, se falhar, tenta a cada 500ms
    if (!initTokenClient()) {
      const timer = setInterval(() => {
        if (initTokenClient()) {
          clearInterval(timer);
        }
      }, 500);
      return () => clearInterval(timer);
    }

    setIsLoading(false);
  }, []);

  const getCalendarToken = useCallback(() => {
    return new Promise((resolve) => {
      if (accessToken) {
        resolve(accessToken);
        return;
      }

      if (tokenClient) {
        tokenClient.callback = (resp) => {
          if (resp.error) {
            console.error("Erro OAuth:", resp);
            resolve(null);
          }
          setAccessToken(resp.access_token);
          resolve(resp.access_token);
        };
        // Pede permissão ao usuário
        tokenClient.requestAccessToken({ prompt: '' }); 
      } else {
        console.warn("Token Client do Google não inicializado ainda.");
        resolve(null);
      }
    });
  }, [accessToken, tokenClient]);

  const handleLogin = useCallback(async (response) => {
    try {
      const { credential } = response;
      const decoded = JSON.parse(atob(credential.split('.')[1]));
      
      const userData = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        loginTime: new Date().toISOString()
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      console.error(err);
      setError('Falha ao fazer login.');
    }
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('user');
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, getCalendarToken, isLoading, error, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};