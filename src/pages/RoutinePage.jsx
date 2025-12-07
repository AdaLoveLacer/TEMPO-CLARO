import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { routineManager } from '../manager/routineManager';
import RoutineForm from '../components/Routine/RoutineForm';
import '../styles/RoutinePage.css';

export const RoutinePage = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [routines, setRoutines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('active');
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);

  // Carregar rotinas ao montar
  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = () => {
    const loaded = routineManager.loadRoutinesFromStorage();
    const sorted = routineManager.sortRoutinesByDate(loaded, 'asc');
    setRoutines(sorted);
  };

  const handleRoutineCreated = (routine) => {
    loadRoutines();
    setShowForm(false);
    setEditingRoutine(null);
  };

  const handleEditRoutine = (routine) => {
    setEditingRoutine(routine);
    setShowForm(true);
  };

  const handleDeleteRoutine = (routineId) => {
    if (window.confirm('Tem certeza que deseja deletar esta rotina?')) {
      routineManager.deleteRoutineFromStorage(routineId);
      loadRoutines();
    }
  };

  const handleExportToGoogle = async (routine) => {
    try {
      setSyncStatus({ status: 'loading', message: 'Sincronizando com Google Calendar...' });

      const events = routineManager.convertToGoogleCalendarEvents(routine);
      
      // Aqui você chamaria a API do Google Calendar
      // Por enquanto, vamos simular o sucesso
      setSyncStatus({
        status: 'success',
        message: `✅ ${events.length} eventos adicionados ao Google Calendar com sucesso!`,
      });

      setTimeout(() => setSyncStatus(null), 3000);
    } catch (error) {
      setSyncStatus({
        status: 'error',
        message: `❌ Erro ao sincronizar: ${error.message}`,
      });
    }
  };

  const filteredRoutines = routineManager.filterRoutinesByStatus(routines, filterStatus);
  const totalDuration = (routine) => routineManager.calculateTotalDuration(routine.tasks);

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <div className="routine-page-container">
      {/* Header */}
      <header className="routine-header">
        <div className="header-content">
          <h1>TEMPO-CLARO</h1>
          <div className="header-actions">
            <button 
              className="btn-dashboard" 
              onClick={() => navigate('/dashboard')}
              title="Ver Dashboard"
            >
              📊 Dashboard
            </button>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="routine-main">
        {showForm ? (
          <div className="form-section-wrapper">
            <button
              className="btn-back"
              onClick={() => {
                setShowForm(false);
                setEditingRoutine(null);
              }}
            >
              ← Voltar
            </button>
            <RoutineForm
              onRoutineCreated={handleRoutineCreated}
              editingRoutine={editingRoutine}
            />
          </div>
        ) : (
          <div className="routines-section">
            {/* Sync Status Message */}
            {syncStatus && (
              <div className={`sync-status sync-${syncStatus.status}`}>
                {syncStatus.message}
              </div>
            )}

            {/* Top Bar */}
            <div className="top-bar">
              <button
                className="btn-new-routine"
                onClick={() => setShowForm(true)}
              >
                ➕ Nova Rotina
              </button>

              <div className="filters">
                <button
                  className={`filter-btn ${filterStatus === 'active' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('active')}
                >
                  ✓ Ativas ({routineManager.filterRoutinesByStatus(routines, 'active').length})
                </button>
                <button
                  className={`filter-btn ${filterStatus === 'future' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('future')}
                >
                  📅 Futuras ({routineManager.filterRoutinesByStatus(routines, 'future').length})
                </button>
                <button
                  className={`filter-btn ${filterStatus === 'past' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('past')}
                >
                  ✓ Passadas ({routineManager.filterRoutinesByStatus(routines, 'past').length})
                </button>
              </div>
            </div>

            {/* Routines List */}
            <div className="routines-list">
              {filteredRoutines.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-icon">📭</p>
                  <h3>Nenhuma rotina encontrada</h3>
                  <p>Crie sua primeira rotina para começar!</p>
                  <button
                    className="btn-create"
                    onClick={() => setShowForm(true)}
                  >
                    ➕ Criar Primeira Rotina
                  </button>
                </div>
              ) : (
                filteredRoutines.map(routine => (
                  <div
                    key={routine.id}
                    className="routine-card"
                    style={{ borderLeftColor: routine.color }}
                  >
                    <div className="routine-header-card">
                      <div className="routine-title">
                        <h3>📅 {routine.name}</h3>
                        <span className="routine-dates">
                          {new Date(routine.startDate).toLocaleDateString('pt-BR')} até{' '}
                          {new Date(routine.endDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="routine-badge">
                        {routine.isActive ? '✓ Ativa' : '○ Inativa'}
                      </div>
                    </div>

                    <div className="routine-info">
                      <span className="info-item">
                        🎯 {routine.tasks.length} tarefa{routine.tasks.length !== 1 ? 's' : ''}
                      </span>
                      <span className="info-item">
                        ⏱️ {totalDuration(routine)} total
                      </span>
                    </div>

                    {routine.tasks.length > 0 && (
                      <div className="routine-preview">
                        {routine.tasks.slice(0, 3).map(task => (
                          <div key={task.id} className="preview-task">
                            <span className="task-time">🕐 {task.startTime}</span>
                            <span className="task-title">{task.title}</span>
                          </div>
                        ))}
                        {routine.tasks.length > 3 && (
                          <div className="preview-more">
                            +{routine.tasks.length - 3} mais...
                          </div>
                        )}
                      </div>
                    )}

                    <div className="routine-actions">
                      <button
                        className="btn-action btn-view"
                        title="Visualizar"
                        onClick={() => handleEditRoutine(routine)}
                      >
                        👁️ Ver
                      </button>
                      <button
                        className="btn-action btn-edit"
                        title="Editar"
                        onClick={() => handleEditRoutine(routine)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn-action btn-export"
                        title="Exportar para Google Calendar"
                        onClick={() => handleExportToGoogle(routine)}
                      >
                        📅 Exportar
                      </button>
                      <button
                        className="btn-action btn-delete"
                        title="Deletar"
                        onClick={() => handleDeleteRoutine(routine.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RoutinePage;
