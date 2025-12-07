import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/LoginPage.css';

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    picture: 'https://ui-avatars.com/api/?name=User'
  });
  const [errors, setErrors] = useState({});
  const { user, isLoading, handleLogin } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/kanban');
    }
  }, [user, isLoading, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const userData = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=667eea&color=fff`,
      loginTime: new Date().toISOString()
    };

    handleLogin(userData);
  };

  if (isLoading) {
    return (
      <div className="login-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>TEMPO-CLARO</h1>
          <p>Bem-vindo ao nosso aplicativo</p>
        </div>

        <div className="login-content">
          <p className="login-description">
            Preencha seus dados para acessar o aplicativo.
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="name">Nome completo *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Seu nome completo"
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="seu.email@exemplo.com"
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <button type="submit" className="login-button">
              Entrar
            </button>
          </form>
        </div>

        <div className="login-footer">
          <p className="terms-text">
            Ao fazer login, você concorda com nossos{' '}
            <a href="/terms">Termos de Serviço</a> e{' '}
            <a href="/privacy">Política de Privacidade</a>.
          </p>
        </div>
      </div>
    </div>
  );
};
