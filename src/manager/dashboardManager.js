/**
 * Dashboard Manager
 * Gerencia a lógica de carregamento de tarefas e cálculo de estatísticas
 */

export const dashboardManager = {
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
   * Calcula estatísticas das tarefas
   * @param {Array} taskList - Lista de tarefas
   * @returns {Object} Objeto com estatísticas
   */
  calculateStats(taskList) {
    const total = taskList.length;
    const completed = taskList.filter((t) => t.completed).length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const inProgress = taskList.filter(
      (t) => !t.completed && new Date(t.date).toDateString() === today.toDateString()
    ).length;
    
    const pending = total - completed - inProgress;
    const highPriority = taskList.filter((t) => t.priority === 'alta').length;
    const mediumPriority = taskList.filter((t) => t.priority === 'média').length;
    const lowPriority = taskList.filter((t) => t.priority === 'baixa').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      pending,
      highPriority,
      mediumPriority,
      lowPriority,
      completionRate,
    };
  },

  /**
   * Navega para a página Kanban
   * @param {Function} navigate - Função de navegação
   */
  navigateToKanban(navigate) {
    navigate('/kanban');
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
   * Calcula a porcentagem de uma prioridade em relação ao total
   * @param {number} count - Quantidade de tarefas da prioridade
   * @param {number} total - Total de tarefas
   * @returns {number} Porcentagem
   */
  calculatePriorityPercentage(count, total) {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  },
};
