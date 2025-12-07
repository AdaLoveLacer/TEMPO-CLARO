import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from '../hooks/useAuth'; // Importamos para usar o token do Google

const TasksContext = createContext({});

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const { getCalendarToken } = useAuth(); // Função que vamos criar no AuthContext

  // 1. Carregar tarefas do localStorage ao iniciar
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

  // 2. Salvar tarefas no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Função auxiliar para enviar ao Google Calendar
  const syncWithGoogleCalendar = async (task) => {
    // Se a função não existir (ainda não atualizamos o AuthContext), ignoramos
    if (!getCalendarToken) return null;

    const token = await getCalendarToken();
    
    if (!token) {
      console.warn("Sem permissão para o Google Calendar ou token inválido");
      return null;
    }

    const event = {
      summary: task.title,
      description: task.description,
      start: {
        dateTime: new Date(task.date).toISOString(),
      },
      end: {
        dateTime: new Date(new Date(task.date).getTime() + 3600000).toISOString(), // Duração de 1h padrão
      },
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
      
      const data = await response.json();
      if (data.error) throw data.error;
      
      console.log("Evento criado no Google Agenda:", data);
      return data.id;
    } catch (error) {
      console.error("Erro ao sincronizar com Google:", error);
      return null;
    }
  };

  // 3. Adicionar Tarefa (Com integração Google opcional)
  const addTask = async (taskData, addToGoogle = false) => {
    const tempId = Date.now();
    
    // Cria tarefa localmente primeiro (UI otimista)
    let newTask = {
      id: tempId,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      googleEventId: null
    };

    // Adiciona na lista visual imediatamente
    setTasks((prev) => [...prev, newTask]);

    // Se o usuário pediu para adicionar ao Google
    if (addToGoogle) {
      const googleId = await syncWithGoogleCalendar(newTask);
      
      // Se criou com sucesso, atualizamos a tarefa com o ID do Google
      if (googleId) {
        setTasks((prev) => 
          prev.map(t => t.id === tempId ? { ...t, googleEventId: googleId } : t)
        );
      }
    }
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    // Futuro: Adicionar lógica para deletar do Google Calendar também se tiver googleEventId
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const updateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  return (
    <TasksContext.Provider 
      value={{ 
        tasks, 
        addTask, 
        deleteTask, 
        toggleTaskCompletion, 
        updateTask 
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks deve ser usado dentro de um TasksProvider');
  }
  return context;
};