// src/context/AuthContext.jsx
import React, { createContext, useState, useCallback, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null); // <--- Novo estado para o token da API
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Inicializa o cliente de TOKEN (Diferente do cliente de LOGIN)
  const [tokenClient, setTokenClient] = useState(null);

  useEffect(() => {
    // Carregar usuário do localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Inicializar o cliente OAuth 2.0 para o Google Agenda
    if (window.google) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/calendar', // Permissão específica
        callback: (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            setAccessToken(tokenResponse.access_token);
            // Opcional: Salvar expiração para saber quando pedir de novo
          }
        },
      });
      setTokenClient(client);
    }
    
    setIsLoading(false);
  }, []);

  // Função para garantir que temos permissão antes de fazer algo
  const getCalendarToken = useCallback(() => {
    return new Promise((resolve) => {
      // Se já temos um token válido na memória, retorna ele
      if (accessToken) {
        resolve(accessToken);
        return;
      }

      // Se não temos, solicita ao usuário (aqui abre o popup DE PERMISSÃO, não login)
      if (tokenClient) {
        // Sobrescreve o callback temporariamente para resolver esta promessa específica
        tokenClient.callback = (resp) => {
          if (resp.error) {
            console.error(resp);
            resolve(null);
          }
          setAccessToken(resp.access_token);
          resolve(resp.access_token);
        };
        
        // Pede a permissão ou usa a permissão já concedida se o usuário marcou "lembrar"
        tokenClient.requestAccessToken({ prompt: '' }); 
      } else {
        resolve(null);
      }
    });
  }, [accessToken, tokenClient]);

  const handleLogin = useCallback(async (response) => {
    // ... (sua lógica de login existente mantém igual) ...
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
      setError('Falha ao fazer login.');
    }
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setAccessToken(null); // Limpa o token ao sair
    localStorage.removeItem('user');
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  }, []);

  const value = {
    user,
    accessToken, // Exporta o token
    getCalendarToken, // Exporta a função que garante o token
    isLoading,
    error,
    handleLogin,
    handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};