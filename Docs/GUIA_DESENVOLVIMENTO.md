# Guia de Desenvolvimento - Projeto TEMPO-CLARO

## 📋 Índice
1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Setup Inicial](#setup-inicial)
4. [Parte 1: Sistema de Autenticação com Google](#parte-1-sistema-de-autenticação-com-google)
5. [Boas Práticas](#boas-práticas)

---

## 🎯 Visão Geral do Projeto

Este é um projeto de faculdade desenvolvido com as tecnologias mais modernas de frontend, focando em:
- ✅ Autenticação segura com Google OAuth 2.0
- ✅ Interface responsiva e intuitiva
- ✅ Componentes React reutilizáveis
- ✅ Gerenciamento de estado eficiente
- ✅ Código limpo e bem documentado

---

## 🛠️ Stack Tecnológico

| Tecnologia | Versão | Função |
|-----------|--------|---------|
| HTML5 | 5.3 | Estrutura do conteúdo |
| CSS3 | 3.1 | Estilos e layout |
| JavaScript | ES6+ | Interatividade e lógica |
| React | 0.76 | Construção de interfaces |

**Ferramentas de Desenvolvimento:**
- Vite (bundler e dev server)
- ESLint (análise estática)
- npm (gerenciador de pacotes)

---

## 🚀 Setup Inicial

### Pré-requisitos
- Node.js versão 18+ instalado
- npm ou yarn
- Conta Google Console (para OAuth)

### 1. Instalação de Dependências

✅ **CONCLUÍDO**

```bash
# Navegue até a pasta do projeto
cd /home/labubu/Documentos/GitHub/TEMPO-CLARO

# Instale as dependências
npm install

# Instale bibliotecas para autenticação Google
npm install @react-oauth/google google-auth-library
npm install --save-dev @types/google.accounts
```

### 2. Estrutura de Pastas Recomendada

✅ **CONCLUÍDO**

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── Auth/
│   │   ├── LoginPage.jsx
│   │   ├── GoogleLoginButton.jsx
│   │   └── AuthContext.jsx
│   └── Common/
│       ├── Header.jsx
│       ├── Footer.jsx
│       └── Loading.jsx
├── pages/              # Páginas da aplicação
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   └── DashboardPage.jsx
├── styles/            # Arquivos CSS globais e módulos
│   ├── global.css
│   ├── variables.css
│   └── responsive.css
├── utils/             # Funções utilitárias
│   ├── api.js
│   ├── storage.js
│   └── validators.js
├── hooks/             # Custom hooks do React
│   ├── useAuth.js
│   └── useFetch.js
├── App.jsx           # Componente raiz
├── index.css         # Estilos globais
└── main.jsx          # Ponto de entrada
```

### 3. Criar Aplicação no Google Console

✅ **CONCLUÍDO**

**Passo 1:** Acesse [Google Cloud Console](https://console.cloud.google.com)

**Passo 2:** Crie um novo projeto
```
Nome: TEMPO-CLARO
```

**Passo 3:** Habilite a API de autenticação
- Vá para "APIs e Serviços"
- Clique em "Habilitar APIs e Serviços"
- Procure por "Google+ API"
- Clique em "Habilitar"

**Passo 4:** Crie credenciais OAuth 2.0
- Acesse "Credenciais"
- Clique em "Criar credenciais" > "ID de cliente OAuth"
- Selecione "Aplicação da web"
- Configure as origens autorizadas:
  ```
  http://localhost:5173
  http://localhost:3000
  https://seudominio.com
  ```
- Configure os URIs de redirecionamento:
  ```
  http://localhost:5173/callback
  http://localhost:3000/callback
  https://seudominio.com/callback
  ```
- Salve o **Client ID** - você vai usar em breve

---

## 📝 Parte 1: Sistema de Autenticação com Google

### Objetivo
Criar uma página de login que se conecta à API do Google, permitindo que usuários façam login com suas contas Google.

### Passo 1: Configurar Variáveis de Ambiente

✅ **CONCLUÍDO**

**Arquivo:** `/.env`

```
VITE_GOOGLE_CLIENT_ID=seu_client_id_aqui.apps.googleusercontent.com
VITE_API_BASE_URL=http://localhost:3001
```

**Importante:** Adicione `.env` ao `.gitignore`:

```bash
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

### Passo 2: Configurar Contexto de Autenticação

✅ **CONCLUÍDO**

**Arquivo:** `/src/context/AuthContext.jsx`

```jsx
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

  // Manipulador de login com Google
  const handleLogin = useCallback(async (response) => {
    try {
      setIsLoading(true);
      setError(null);

      const { credential } = response;

      // Enviar token para seu backend (opcional)
      // const backendResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/google`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token: credential })
      // });

      // Para este exemplo, decodificamos o token no cliente
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
  }, []);

  const value = {
    user,
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
```

### Passo 3: Criar Hook Personalizado para Autenticação

✅ **CONCLUÍDO**

**Arquivo:** `/src/hooks/useAuth.js`

```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};
```

### Passo 4: Criar Componente de Botão de Login Google

✅ **CONCLUÍDO**

**Arquivo:** `/src/components/Auth/GoogleLoginButton.jsx`

```jsx
import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './GoogleLoginButton.css';

export const GoogleLoginButton = () => {
  const { handleLogin } = useAuth();

  useEffect(() => {
    // Inicializar Google Sign-In
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleLogin,
      auto_select: false
    });
  }, [handleLogin]);

  const handleClick = () => {
    window.google.accounts.id.renderButton(
      document.getElementById('googleButton'),
      {
        type: 'standard',
        size: 'large',
        text: 'signin_with',
        theme: 'outline'
      }
    );
  };

  return (
    <div className="google-login-button">
      <button
        id="googleButton"
        className="google-btn"
        onClick={handleClick}
        aria-label="Login com Google"
      >
        <img 
          src="https://www.gstatic.com/firebaseapp/v8.3.1/images/firebase-logo.png" 
          alt="Google logo" 
        />
        <span>Fazer login com Google</span>
      </button>
    </div>
  );
};
```

### Passo 5: Estilos para o Botão de Login

✅ **CONCLUÍDO**

**Arquivo:** `/src/components/Auth/GoogleLoginButton.css`

```css
.google-login-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 20px 0;
}

.google-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.google-btn:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.google-btn:active {
  transform: scale(0.98);
}

.google-btn img {
  width: 20px;
  height: 20px;
}

/* Responsivo */
@media (max-width: 768px) {
  .google-btn {
    width: 100%;
    justify-content: center;
    padding: 14px 20px;
    font-size: 14px;
  }
}
```

### Passo 6: Criar Página de Login

✅ **CONCLUÍDO**

**Arquivo:** `/src/pages/LoginPage.jsx`

```jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GoogleLoginButton } from '../components/Auth/GoogleLoginButton';
import './LoginPage.css';

export const LoginPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

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
            Faça login usando sua conta Google para acessar o aplicativo.
          </p>

          <GoogleLoginButton />
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
```

### Passo 7: Estilos da Página de Login

✅ **CONCLUÍDO**

**Arquivo:** `/src/pages/LoginPage.css`

```css
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 420px;
  padding: 40px 30px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 28px;
  font-weight: 700;
}

.login-header p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

.login-content {
  margin: 30px 0;
}

.login-description {
  color: #6b7280;
  font-size: 14px;
  text-align: center;
  margin-bottom: 24px;
  line-height: 1.5;
}

.login-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0;
  color: #d1d5db;
}

.login-divider span {
  color: #9ca3af;
  font-size: 13px;
  flex: 0 0 auto;
}

.login-divider::before,
.login-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: #d1d5db;
}

.login-footer {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.terms-text {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  margin: 0;
  line-height: 1.6;
}

.terms-text a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.terms-text a:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* Loading Spinner */
.loading-spinner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f4f6;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-spinner p {
  margin-top: 16px;
  color: #6b7280;
  font-size: 14px;
}

/* Responsivo */
@media (max-width: 640px) {
  .login-container {
    padding: 16px;
  }

  .login-card {
    padding: 30px 20px;
  }

  .login-header h1 {
    font-size: 24px;
  }

  .login-description {
    font-size: 13px;
  }
}
```

### Passo 8: Adicionar Google Sign-In Script

✅ **CONCLUÍDO**

**Arquivo:** `/index.html`

Adicione este script antes da tag `</head>`:

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### Passo 9: Atualizar o Componente App

✅ **CONCLUÍDO**

**Arquivo:** `/src/App.jsx`

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
```

### Passo 10: Criar Componente de Rota Protegida

✅ **CONCLUÍDO**

**Arquivo:** `/src/components/Auth/ProtectedRoute.jsx`

```jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
```

### Passo 11: Criar Dashboard

✅ **CONCLUÍDO**

**Arquivo:** `/src/pages/DashboardPage.jsx`

```jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

export const DashboardPage = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>TEMPO-CLARO</h1>
          <div className="user-info">
            <img src={user?.picture} alt={user?.name} className="user-avatar" />
            <div>
              <p className="user-name">{user?.name}</p>
              <p className="user-email">{user?.email}</p>
            </div>
            <button onClick={handleLogoutClick} className="logout-btn">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Bem-vindo, {user?.name?.split(' ')[0]}!</h2>
          <p>Você está conectado com sucesso ao TEMPO-CLARO.</p>
        </div>

        <div className="dashboard-grid">
          <div className="card">
            <h3>📊 Estatísticas</h3>
            <p>Seu conteúdo aqui</p>
          </div>
          <div className="card">
            <h3>🎯 Metas</h3>
            <p>Seu conteúdo aqui</p>
          </div>
          <div className="card">
            <h3>📈 Progresso</h3>
            <p>Seu conteúdo aqui</p>
          </div>
        </div>
      </main>
    </div>
  );
};
```

### Passo 12: Estilos do Dashboard

✅ **CONCLUÍDO**

**Arquivo:** `/src/pages/DashboardPage.css`

```css
.dashboard-container {
  min-height: 100vh;
  background-color: #f9fafb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid white;
}

.user-name {
  margin: 0;
  font-weight: 600;
  font-size: 14px;
}

.user-email {
  margin: 0;
  font-size: 12px;
  opacity: 0.9;
}

.logout-btn {
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.dashboard-main {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.welcome-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.welcome-section h2 {
  margin: 0 0 10px 0;
  color: #1f2937;
  font-size: 28px;
}

.welcome-section p {
  margin: 0;
  color: #6b7280;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.card h3 {
  margin: 0 0 12px 0;
  color: #1f2937;
  font-size: 18px;
}

.card p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .user-info {
    width: 100%;
    justify-content: space-between;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 📚 Boas Práticas

### 1. **Segurança**
- ✅ Nunca exponha o Client ID em variáveis públicas sem proteção
- ✅ Use HTTPS em produção
- ✅ Valide todos os tokens no backend
- ✅ Implemente rate limiting para APIs

### 2. **Performance**
- ✅ Use lazy loading para componentes
- ✅ Implemente memoização com `React.memo()`
- ✅ Otimize imagens
- ✅ Use code splitting

### 3. **Acessibilidade**
- ✅ Use semântica HTML correta
- ✅ Adicione labels em formulários
- ✅ Implemente navegação por teclado
- ✅ Use cores com contraste adequado

### 4. **Código Limpo**
- ✅ Use nomes descritivos para variáveis
- ✅ Divida componentes grandes em menores
- ✅ Reutilize lógica com hooks customizados
- ✅ Adicione comentários quando necessário

### 5. **Testes**
- ✅ Escreva testes unitários com Jest
- ✅ Teste componentes com React Testing Library
- ✅ Implemente testes de integração
- ✅ Mantenha cobertura de testes > 80%

---

## 🚀 Próximas Partes (Em Breve)

- [ ] Parte 2: Integração com Backend
- [ ] Parte 3: Banco de Dados
- [ ] Parte 4: Funcionalidades Principais
- [ ] Parte 5: Deploy e Produção

---

---

## 🔌 Como Nos Comunicamos com a API do Google

### 1️⃣ **Carregamento do Script do Google**

**Arquivo:** `/index.html`

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

Este script carrega a biblioteca **Google Identity Services (GIS)** que fornece:
- `window.google.accounts.id.initialize()` - Inicializa o cliente OAuth
- `window.google.accounts.id.renderButton()` - Renderiza o botão de login
- Callback automático quando o usuário faz login

---

### 2️⃣ **Inicialização do Cliente Google**

**Arquivo:** `/src/components/Auth/GoogleLoginButton.jsx`

```jsx
useEffect(() => {
  if (window.google && googleButtonRef.current) {
    // Inicializar Google Sign-In
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,  // ← Seu Client ID do Google Console
      callback: handleLogin,                             // ← Função chamada após login
      auto_select: false                                 // ← Não faz login automático
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
```

**O que acontece aqui:**
1. Inicializamos o cliente Google com seu **Client ID**
2. Passamos a função `handleLogin` como callback
3. Renderizamos o botão oficial do Google no DOM
4. Quando o usuário clica, Google abre um popup de login

---

### 3️⃣ **Recebimento do Token JWT**

**Arquivo:** `/src/context/AuthContext.jsx`

```jsx
const handleLogin = useCallback(async (response) => {
  const { credential } = response;  // ← Token JWT assinado pelo Google
  
  // O JWT tem este formato:
  // header.payload.signature
  // Example: eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.signature
}, []);
```

---

### 4️⃣ **Decodificação do Token JWT (Cliente)**

**Arquivo:** `/src/context/AuthContext.jsx`

```jsx
// Decodificar o token JWT no cliente
const decoded = JSON.parse(atob(credential.split('.')[1]));

// O payload decodificado contém:
{
  "sub": "1234567890",              // ← ID único do Google
  "email": "user@gmail.com",        // ← Email do usuário
  "name": "João Silva",             // ← Nome completo
  "picture": "https://...",         // ← URL da foto de perfil
  "email_verified": true,
  "aud": "seu-client-id.apps.googleusercontent.com",
  "iss": "https://accounts.google.com",
  "iat": 1234567890,                // ← Issued at (quando foi criado)
  "exp": 1234571490                 // ← Expiration (quando expira)
}
```

---

### 5️⃣ **Fluxo Completo da Comunicação**

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUXO DE AUTENTICAÇÃO                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Usuário acessa http://localhost:5173                     │
│     ↓                                                         │
│  2. Script do Google carrega (gsi/client)                    │
│     ↓                                                         │
│  3. GoogleLoginButton inicializa client Google               │
│     ↓                                                         │
│  4. Botão "Sign in with Google" é renderizado                │
│     ↓                                                         │
│  5. Usuário clica no botão                                   │
│     ↓                                                         │
│  6. Google abre popup de login                               │
│     ↓                                                         │
│  7. Usuário faz login com email/senha Google                 │
│     ↓                                                         │
│  8. Google retorna JWT credential para nossa callback        │
│     ↓                                                         │
│  9. handleLogin() decodifica o JWT                           │
│     ↓                                                         │
│  10. Extraimos: id, email, name, picture                     │
│     ↓                                                         │
│  11. Salvamos dados do usuário em localStorage               │
│     ↓                                                         │
│  12. Redirecionamos para /dashboard                          │
│     ↓                                                         │
│  13. Dashboard mostra dados: nome, email, foto              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

### 6️⃣ **Variáveis de Ambiente**

**Arquivo:** `/.env`

```bash
# Este é seu Client ID obtido no Google Cloud Console
VITE_GOOGLE_CLIENT_ID=338124788996-vl02r6a4mifee6ht20jvn520vabifvs7.apps.googleusercontent.com

# (Opcional) Backend URL para validação do token
VITE_API_BASE_URL=http://localhost:3001
```

---

### 7️⃣ **Pontos de Segurança**

#### ✅ **O que fazemos certo:**
1. **Validação no Cliente:** Decodificamos o JWT para extrair dados
2. **Persistência Segura:** Salvamos em `localStorage` (apenas dados públicos)
3. **Logout:** Limpamos `localStorage` ao desconectar

#### ⚠️ **O que falta para Produção:**
1. **Validação no Backend:** 
   ```javascript
   // Isso DEVE estar no seu servidor:
   const backendResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/google`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ token: credential })
   });
   ```

2. **Verificação da Assinatura:** O backend deve verificar se o JWT é assinado corretamente pelo Google

3. **HTTPS:** Em produção, sempre use HTTPS para proteger os tokens

---

### 8️⃣ **URLs Autorizadas no Google Console**

Estas são as origens configuradas no Google Cloud Console:

```
Origens JavaScript Autorizadas:
- http://localhost:5173      (desenvolvimento local)
- http://localhost:3000      (alternativa)

URIs de Redirecionamento Autorizados:
- http://localhost:5173/callback
- http://localhost:3000/callback
```

O Google **valida** se a requisição está vindo de uma origem autorizada.

---

### 9️⃣ **Exemplo Real de Resposta do Google**

Quando o usuário faz login, Google retorna um objeto assim:

```javascript
{
  credential: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ...", // JWT completo
  select_by: "user"  // Como o usuário foi selecionado
}
```

Depois de decodificar o JWT:

```javascript
{
  sub: "102859712345678901234",
  email: "usuario@gmail.com",
  name: "João Silva",
  picture: "https://lh3.googleusercontent.com/a/...",
  email_verified: true,
  aud: "338124788996-vl02r6a4mifee6ht20jvn520vabifvs7.apps.googleusercontent.com",
  iss: "https://accounts.google.com",
  iat: 1701848900,
  exp: 1701852500
}
```

---

### 🔟 **Resumo das Comunicações**

| Etapa | Quem | O Quê | Protocolo |
|-------|------|-------|-----------|
| 1 | Cliente | Carrega script Google | HTTP/HTTPS |
| 2 | Cliente | Inicializa cliente OAuth | JavaScript |
| 3 | Usuário | Clica botão | Browser |
| 4 | Google | Abre popup de login | HTTPS |
| 5 | Usuário | Faz login | Browser Google |
| 6 | Google | Retorna JWT | HTTPS Callback |
| 7 | Cliente | Decodifica JWT | JavaScript |
| 8 | Cliente | Salva em localStorage | Browser Storage |
| 9 | App | Mostra dashboard | React |

---

## 📞 Suporte e Referências

- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Google Identity Services (GIS)](https://developers.google.com/identity/gsi/web)
- [JWT Explicado](https://jwt.io/)
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [MDN Web Docs](https://developer.mozilla.org)

---

**Última atualização:** 6 de dezembro de 2025
**Status:** ✅ Parte 1 Completa
