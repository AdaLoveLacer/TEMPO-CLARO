import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { dashboardManager } from '../manager/dashboardManager';
import '../styles/DashboardPage.css';

export const DashboardPage = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    completionRate: 0,
  });

  // Carregar tarefas do localStorage
  useEffect(() => {
    const loadedTasks = dashboardManager.loadTasksFromStorage();
    setTasks(loadedTasks);
    setStats(dashboardManager.calculateStats(loadedTasks));
  }, []);

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
            <button onClick={() => dashboardManager.handleLogout(handleLogout, navigate)} className="logout-btn">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <div className="welcome-content">
            <h2>Análise de Tarefas</h2>
            <p>Visualize suas estatísticas e métricas de produtividade</p>
          </div>
          <button className="btn-kanban" onClick={() => dashboardManager.navigateToKanban(navigate)}>
            📋 Ir para Kanban
          </button>
        </div>

        {/* Cards de Estatísticas Principais */}
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-header">
              <h3>Total de Tarefas</h3>
              <span className="stat-icon">📋</span>
            </div>
            <div className="stat-value">{stats.total}</div>
            <p className="stat-description">Todas as suas tarefas</p>
          </div>

          <div className="stat-card stat-completed">
            <div className="stat-header">
              <h3>Concluídas</h3>
              <span className="stat-icon">✅</span>
            </div>
            <div className="stat-value">{stats.completed}</div>
            <p className="stat-description">{stats.completionRate}% concluído</p>
          </div>

          <div className="stat-card stat-inprogress">
            <div className="stat-header">
              <h3>Em Progresso</h3>
              <span className="stat-icon">⏳</span>
            </div>
            <div className="stat-value">{stats.inProgress}</div>
            <p className="stat-description">Hoje</p>
          </div>

          <div className="stat-card stat-pending">
            <div className="stat-header">
              <h3>Pendentes</h3>
              <span className="stat-icon">📌</span>
            </div>
            <div className="stat-value">{stats.pending}</div>
            <p className="stat-description">Aguardando execução</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-header">
            <h3>Taxa de Conclusão</h3>
            <span className="progress-percentage">{stats.completionRate}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${stats.completionRate}%` }}
            ></div>
          </div>
        </div>

        {/* Análise de Prioridades */}
        <div className="analysis-section">
          <h3>Análise de Prioridades</h3>
          <div className="priority-grid">
            <div className="priority-card priority-alta">
              <div className="priority-header">
                <span className="priority-label">🔴 Alta</span>
                <span className="priority-count">{stats.highPriority}</span>
              </div>
              <div className="priority-bar">
                <div
                  className="priority-fill"
                  style={{
                    width: `${dashboardManager.calculatePriorityPercentage(stats.highPriority, stats.total)}%`,
                  }}
                ></div>
              </div>
              <p className="priority-percentage">
                {dashboardManager.calculatePriorityPercentage(stats.highPriority, stats.total)}
                % do total
              </p>
            </div>

            <div className="priority-card priority-media">
              <div className="priority-header">
                <span className="priority-label">🟠 Média</span>
                <span className="priority-count">{stats.mediumPriority}</span>
              </div>
              <div className="priority-bar">
                <div
                  className="priority-fill"
                  style={{
                    width: `${dashboardManager.calculatePriorityPercentage(stats.mediumPriority, stats.total)}%`,
                  }}
                ></div>
              </div>
              <p className="priority-percentage">
                {dashboardManager.calculatePriorityPercentage(stats.mediumPriority, stats.total)}
                % do total
              </p>
            </div>

            <div className="priority-card priority-baixa">
              <div className="priority-header">
                <span className="priority-label">🟢 Baixa</span>
                <span className="priority-count">{stats.lowPriority}</span>
              </div>
              <div className="priority-bar">
                <div
                  className="priority-fill"
                  style={{
                    width: `${dashboardManager.calculatePriorityPercentage(stats.lowPriority, stats.total)}%`,
                  }}
                ></div>
              </div>
              <p className="priority-percentage">
                {dashboardManager.calculatePriorityPercentage(stats.lowPriority, stats.total)}
                % do total
              </p>
            </div>
          </div>
        </div>

        {/* Resumo Rápido */}
        {tasks.length === 0 && (
          <div className="empty-state">
            <p className="empty-icon">📭</p>
            <h3>Nenhuma tarefa ainda</h3>
            <p>Crie sua primeira tarefa no Kanban para ver as estatísticas aqui!</p>
            <button className="btn-create" onClick={() => dashboardManager.navigateToKanban(navigate)}>
              Criar Primeira Tarefa
            </button>
          </div>
        )}
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2025 TEMPO-CLARO. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};
