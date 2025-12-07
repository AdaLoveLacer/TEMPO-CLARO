import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { kanbanManager } from '../manager/kanbanManager';
import '../styles/KanbanPage.css';
import TaskBoard from '../components/Kanban/TaskBoard';

export const KanbanPage = () => {
  const { user, isLoading: authLoading, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  // Se o usuário não está carregado, mostrar spinner
  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando dados...</p>
      </div>
    );
  }

  // Se não há usuário, isso não deveria acontecer (ProtectedRoute cuida disso)
  if (!user) {
    return null;
  }

  // Carregar tarefas do localStorage ao montar o componente
  useEffect(() => {
    const loadedTasks = kanbanManager.loadTasksFromStorage();
    setTasks(loadedTasks);
  }, []);

  // Salvar tarefas no localStorage sempre que mudar
  useEffect(() => {
    kanbanManager.saveTasksToStorage(tasks);
  }, [tasks]);

  // Categorizar tarefas por status baseado na data
  const categorizeTasks = () => {
    return kanbanManager.categorizeTasks(tasks);
  };

  const handleAddTask = (taskData) => {
    const newTask = kanbanManager.createTask(taskData);
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(kanbanManager.deleteTask(tasks, taskId));
  };

  const handleCompleteTask = (taskId) => {
    setTasks(kanbanManager.toggleCompleteTask(tasks, taskId));
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(kanbanManager.updateTask(tasks, updatedTask));
  };

  const handleLogoutClick = () => {
    kanbanManager.handleLogout(handleLogout, navigate);
  };

  const categorizedTasks = categorizeTasks();

  return (
    <div className="kanban-container">
      {/* Header */}
      <header className="kanban-header">
        <div className="header-content">
          <h1>TEMPO-CLARO</h1>
          <div className="header-actions">
            <button 
              className="btn-stats" 
              onClick={() => kanbanManager.navigateToDashboard(navigate)}
              title="Ver estatísticas"
            >
              📊 Estatísticas
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
      <main className="kanban-main">
        <TaskBoard
          todoTasks={categorizedTasks.todo}
          inProgressTasks={categorizedTasks.inProgress}
          completedTasks={categorizedTasks.completed}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
          onCompleteTask={handleCompleteTask}
          onUpdateTask={handleUpdateTask}
        />
      </main>
    </div>
  );
};