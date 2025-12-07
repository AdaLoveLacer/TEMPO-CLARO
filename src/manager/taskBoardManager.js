/**
 * Task Board Manager
 * Gerencia a lógica de exibição e controle do quadro de tarefas
 */

export const taskBoardManager = {
  /**
   * Abre o modal de criação de tarefa
   * @returns {boolean}
   */
  openAddTaskModal() {
    return true;
  },

  /**
   * Fecha o modal de criação de tarefa
   * @returns {boolean}
   */
  closeAddTaskModal() {
    return false;
  },

  /**
   * Trata o adicionar de uma nova tarefa
   * @param {Array} tasks - Array de tarefas existentes
   * @param {Object} taskData - Dados da tarefa
   * @returns {Array} Array de tarefas atualizado
   */
  handleAddTask(tasks, taskData) {
    const newTask = {
      id: Date.now(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    return [...tasks, newTask];
  },

  /**
   * Valida se o modal de tarefas deve estar visível
   * @param {boolean} showModal - Estado do modal
   * @returns {boolean}
   */
  isModalVisible(showModal) {
    return showModal;
  },

  /**
   * Calcula o total de tarefas por coluna
   * @param {Array} todoTasks - Tarefas A Fazer
   * @param {Array} inProgressTasks - Tarefas Em Progresso
   * @param {Array} completedTasks - Tarefas Concluídas
   * @returns {Object} Contagem de tarefas por coluna
   */
  getTaskCounts(todoTasks, inProgressTasks, completedTasks) {
    return {
      todo: todoTasks.length,
      inProgress: inProgressTasks.length,
      completed: completedTasks.length,
    };
  },
};
