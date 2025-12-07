/**
 * Task Column Manager
 * Gerencia a lógica de uma coluna de tarefas
 */

export const taskColumnManager = {
  /**
   * Valida se há tarefas na coluna
   * @param {Array} tasks - Array de tarefas
   * @returns {boolean}
   */
  hasNoTasks(tasks) {
    return tasks.length === 0;
  },

  /**
   * Retorna o subtítulo da coluna baseado na contagem de tarefas
   * @param {number} count - Número de tarefas
   * @returns {string} Subtítulo formatado
   */
  getColumnSubtitle(count) {
    const plural = count === 1 ? 'tarefa' : 'tarefas';
    return `${count} ${plural}`;
  },

  /**
   * Determina a classe CSS para a coluna baseado na cor
   * @param {string} color - Cor da coluna
   * @returns {string} Classe CSS
   */
  getColumnClass(color) {
    return `task-column column-${color}`;
  },

  /**
   * Valida se o título é válido
   * @param {string} title - Título da coluna
   * @returns {boolean}
   */
  isValidTitle(title) {
    return title && title.trim().length > 0;
  },

  /**
   * Ordena tarefas por data (mais recentes na frente)
   * @param {Array} tasks - Array de tarefas
   * @returns {Array} Tarefas ordenadas
   */
  sortTasksByDate(tasks) {
    return [...tasks].sort((a, b) => new Date(b.date) - new Date(a.date));
  },
};
