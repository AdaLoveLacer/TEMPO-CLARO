// src/context/TasksContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';

const TasksContext = createContext({});

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const { getCalendarToken } = useAuth();

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try { setTasks(JSON.parse(savedTasks)); } catch (err) { console.error(err); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const syncWithGoogleCalendar = async (task) => {
    // 1. Pega o token direto (já deve estar logado e autorizado)
    const token = await getCalendarToken();
    
    if (!token) {
      alert("Erro: Você precisa estar logado para sincronizar.");
      return null;
    }

    const event = {
      summary: task.title,
      description: task.description,
      start: { dateTime: new Date(task.date).toISOString() },
      end: { dateTime: new Date(new Date(task.date).getTime() + 3600000).toISOString() },
    };

    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      
      if (!response.ok) {
        // Se der erro 401 (Unauthorized), o token expirou
        if (response.status === 401) {
             alert("Sessão expirada. Por favor, faça login novamente.");
             // Aqui você poderia chamar um logout automático se quisesse
        }
        throw new Error('Falha na API Google');
      }

      const data = await response.json();
      console.log("Sucesso Google Agenda:", data);
      return data.id;
    } catch (error) {
      console.error("Erro Google Sync:", error);
      return null;
    }
  };

  const addTask = async (taskData, addToGoogle = false) => {
    const tempId = Date.now();
    let newTask = {
      id: tempId,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      googleEventId: null
    };

    setTasks((prev) => [...prev, newTask]);

    if (addToGoogle) {
      const googleId = await syncWithGoogleCalendar(newTask);
      if (googleId) {
        setTasks((prev) => 
          prev.map(t => t.id === tempId ? { ...t, googleEventId: googleId } : t)
        );
      }
    }
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks((prev) =>
      prev.map((task) => task.id === taskId ? { ...task, completed: !task.completed } : task)
    );
  };

  const updateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => task.id === updatedTask.id ? updatedTask : task)
    );
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, deleteTask, toggleTaskCompletion, updateTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);