import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../context/TasksContext'; // <--- Usando o Contexto
import { useNavigate } from 'react-router-dom';
import '../styles/KanbanPage.css';
import TaskBoard from '../components/Kanban/TaskBoard';

export const KanbanPage = () => {
  const { user, isLoading: authLoading, handleLogout } = useAuth();
  
  // AQUI: Pegamos addTask e as tarefas do contexto global
  const { tasks, addTask, deleteTask, toggleTaskCompletion, updateTask } = useTasks();
  
  const navigate = useNavigate();

  if (authLoading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  // Lógica de visualização (filtro)
  const categorizeTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todoTasks = [];
    const inProgressTasks = [];
    const completedTasks = [];

    tasks.forEach((task) => {
      const taskDate = new Date(task.date);
      taskDate.setHours(0, 0, 0, 0);

      if (task.completed) {
        completedTasks.push(task);
      } else if (taskDate.getTime() === today.getTime()) {
        inProgressTasks.push(task);
      } else if (taskDate > today) {
        todoTasks.push(task);
      } else {
        inProgressTasks.push(task);
      }
    });

    const sortByDate = (a, b) => new Date(b.date) - new Date(a.date);

    return {
      todo: todoTasks.sort(sortByDate),
      inProgress: inProgressTasks.sort(sortByDate),
      completed: completedTasks.sort(sortByDate),
    };
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  const categorizedTasks = categorizeTasks();

  return (
    <div className="kanban-container">
      <header className="kanban-header">
        <div className="header-content">
          <h1>TEMPO-CLARO</h1>
          <div className="header-actions">
            <button className="btn-stats" onClick={() => navigate('/dashboard')}>
              📊 Estatísticas
            </button>
            <div className="user-info">
              {user?.picture && <img src={user.picture} alt={user.name} className="user-avatar" />}
              <div className="user-details">
                <p className="user-name">{user?.name}</p>
                <p className="user-email">{user?.email}</p>
              </div>
              <button onClick={handleLogoutClick} className="logout-btn">Sair</button>
            </div>
          </div>
        </div>
      </header>

      <main className="kanban-main">
        <TaskBoard
          todoTasks={categorizedTasks.todo}
          inProgressTasks={categorizedTasks.inProgress}
          completedTasks={categorizedTasks.completed}
          
          /* AQUI: Passamos os dados e o booleano (addToGoogle) para o contexto */
          onAddTask={(taskData, addToGoogle) => addTask(taskData, addToGoogle)}
          
          onDeleteTask={deleteTask}
          onCompleteTask={toggleTaskCompletion}
          onUpdateTask={updateTask}
        />
      </main>
    </div>
  );
};