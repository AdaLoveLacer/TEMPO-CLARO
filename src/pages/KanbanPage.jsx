import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/KanbanPage.css';
import TaskBoard from '../components/Kanban/TaskBoard';

export const KanbanPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  // Carregar tarefas do localStorage ao montar o componente
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (err) {
        console.error('Erro ao carregar tarefas:', err);
      }
    }
  }, []);

  // Salvar tarefas no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Categorizar tarefas por status baseado na data
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
        // Tarefas vencidas não concluídas voltam para em progresso
        inProgressTasks.push(task);
      }
    });

    // Ordenar por data/hora (mais recentes na frente)
    const sortByDate = (a, b) => new Date(b.date) - new Date(a.date);

    return {
      todo: todoTasks.sort(sortByDate),
      inProgress: inProgressTasks.sort(sortByDate),
      completed: completedTasks.sort(sortByDate),
    };
  };

  const handleAddTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleCompleteTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(
      tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleLogoutClick = () => {
    navigate('/login');
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
              onClick={() => navigate('/dashboard')}
              title="Ver estatísticas"
            >
              📊 Estatísticas
            </button>
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
