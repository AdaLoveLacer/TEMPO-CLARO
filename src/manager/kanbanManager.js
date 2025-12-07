/**
 * Kanban Manager
 * Gerencia a lógica de tarefas, categorização e operações do Kanban
 */

export const kanbanManager = {
  /**
   * Carrega tarefas do localStorage
   * @returns {Array} Array de tarefas
   */
  loadTasksFromStorage() {
    try {
      const savedTasks = localStorage.getItem('tasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (err) {
      console.error('Erro ao carregar tarefas:', err);
      return [];
    }
  },

  /**
   * Salva tarefas no localStorage
   * @param {Array} tasks - Array de tarefas
   */
  saveTasksToStorage(tasks) {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (err) {
      console.error('Erro ao salvar tarefas:', err);
    }
  },

  /**
   * Categoriza tarefas por status baseado na data
   * @param {Array} tasks - Array de tarefas
   * @returns {Object} Objeto com tarefas categorizadas
   */
  categorizeTasks(tasks) {
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
  },

  /**
   * Cria uma nova tarefa
   * @param {Object} taskData - Dados da tarefa
   * @returns {Object} Objeto da tarefa criada
   */
  createTask(taskData) {
    return {
      id: Date.now(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Deleta uma tarefa
   * @param {Array} tasks - Array de tarefas
   * @param {number} taskId - ID da tarefa a deletar
   * @returns {Array} Array de tarefas atualizado
   */
  deleteTask(tasks, taskId) {
    return tasks.filter((task) => task.id !== taskId);
  },

  /**
   * Marca/desmarca uma tarefa como concluída
   * @param {Array} tasks - Array de tarefas
   * @param {number} taskId - ID da tarefa
   * @returns {Array} Array de tarefas atualizado
   */
  toggleCompleteTask(tasks, taskId) {
    return tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
  },

  /**
   * Atualiza uma tarefa
   * @param {Array} tasks - Array de tarefas
   * @param {Object} updatedTask - Tarefa atualizada
   * @returns {Array} Array de tarefas atualizado
   */
  updateTask(tasks, updatedTask) {
    return tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
  },

  /**
   * Realiza logout do usuário
   * @param {Function} handleLogout - Função de logout
   * @param {Function} navigate - Função de navegação
   */
  handleLogout(handleLogout, navigate) {
    handleLogout();
    navigate('/login');
  },

  /**
   * Navega para a página de Dashboard
   * @param {Function} navigate - Função de navegação
   */
  navigateToDashboard(navigate) {
    navigate('/dashboard');
  },
};
