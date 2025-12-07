import React, { createContext, useState, useCallback, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verifica se há um usuário logado ao carregar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('user');
        console.error('Erro ao recuperar usuário salvo:', err);
      }
    }
    setIsLoading(false);
  }, []);

  // Manipulador de login
  const handleLogin = useCallback((userData) => {
    try {
      setIsLoading(true);
      setError(null);

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      setError('Falha ao fazer login. Tente novamente.');
      console.error('Erro de login:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Manipulador de logout
  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    setError(null);
    console.log('✓ Usuário desconectado');
  }, []);

  const value = {
    user,
    isLoading,
    error,
    handleLogin,
    handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

