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
            {user?.picture && (
              <img src={user.picture} alt={user.name} className="user-avatar" />
            )}
            <div className="user-details">
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
            <div className="card-icon">📊</div>
            <h3>Estatísticas</h3>
            <p>Acompanhe suas estatísticas e métricas importantes.</p>
          </div>
          <div className="card">
            <div className="card-icon">🎯</div>
            <h3>Metas</h3>
            <p>Defina e gerencie suas metas de aprendizado.</p>
          </div>
          <div className="card">
            <div className="card-icon">📈</div>
            <h3>Progresso</h3>
            <p>Veja seu progresso ao longo do tempo.</p>
          </div>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2025 TEMPO-CLARO. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};
