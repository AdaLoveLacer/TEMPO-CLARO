/**
 * Task Card Manager
 * Gerencia a lógica de um card individual de tarefa
 */

export const taskCardManager = {
  /**
   * Abre o modal de edição de tarefa
   * @returns {boolean}
   */
  openEditModal() {
    return true;
  },

  /**
   * Fecha o modal de edição de tarefa
   * @returns {boolean}
   */
  closeEditModal() {
    return false;
  },

  /**
   * Formata a data e hora da tarefa para exibição
   * @param {string} dateString - String de data ISO
   * @returns {string} Data formatada
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  /**
   * Determina a classe CSS para a tarefa
   * @param {boolean} isCompleted - Se a tarefa está completa
   * @returns {string} Classe CSS
   */
  getTaskClass(isCompleted) {
    return isCompleted ? 'task-card completed' : 'task-card';
  },

  /**
   * Determina a classe CSS para a prioridade
   * @param {string} priority - Prioridade da tarefa
   * @returns {string} Classe CSS
   */
  getPriorityClass(priority) {
    return `task-priority priority-${priority}`;
  },

  /**
   * Valida se a tarefa tem descrição
   * @param {string} description - Descrição da tarefa
   * @returns {boolean}
   */
  hasDescription(description) {
    return description && description.trim().length > 0;
  },

  /**
   * Valida se a tarefa tem prioridade
   * @param {string} priority - Prioridade da tarefa
   * @returns {boolean}
   */
  hasPriority(priority) {
    return priority && priority.trim().length > 0;
  },
};
