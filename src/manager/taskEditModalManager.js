/**
 * Task Edit Modal Manager
 * Gerencia a lógica do modal de edição de tarefas
 */

export const taskEditModalManager = {
  /**
   * Formata a data da tarefa para o input de data
   * @param {string} dateString - String de data ISO
   * @returns {string} Data formatada para input (YYYY-MM-DD)
   */
  formatDateForInput(dateString) {
    if (!dateString) return '';
    const taskDate = new Date(dateString);
    return taskDate.toISOString().split('T')[0];
  },

  /**
   * Estado inicial do formulário de edição baseado na tarefa
   * @param {Object} task - Dados da tarefa
   * @returns {Object} Dados do formulário
   */
  getInitialFormData(task) {
    if (!task) {
      return {
        title: '',
        description: '',
        date: '',
        priority: 'média',
      };
    }

    return {
      title: task.title || '',
      description: task.description || '',
      date: this.formatDateForInput(task.date),
      priority: task.priority || 'média',
    };
  },

  /**
   * Atualiza um campo do formulário
   * @param {Object} formData - Dados atuais do formulário
   * @param {string} name - Nome do campo
   * @param {string} value - Novo valor
   * @returns {Object} Formulário atualizado
   */
  updateFormField(formData, name, value) {
    return {
      ...formData,
      [name]: value,
    };
  },

  /**
   * Valida o formulário de edição de tarefa
   * @param {Object} formData - Dados do formulário
   * @returns {Object} Objeto com isValid e mensagem de erro
   */
  validateForm(formData) {
    if (!formData.title.trim()) {
      return {
        isValid: false,
        message: 'O título da tarefa é obrigatório',
      };
    }

    if (!formData.date) {
      return {
        isValid: false,
        message: 'Selecione uma data para a tarefa',
      };
    }

    return {
      isValid: true,
      message: '',
    };
  },

  /**
   * Prepara os dados da tarefa atualizada
   * @param {Object} task - Tarefa original
   * @param {Object} formData - Dados do formulário
   * @returns {Object} Tarefa atualizada
   */
  prepareUpdatedTask(task, formData) {
    return {
      ...task,
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: new Date(formData.date).toISOString(),
      priority: formData.priority,
    };
  },

  /**
   * Conta caracteres do título
   * @param {string} title - Título da tarefa
   * @returns {number}
   */
  getTitleCharCount(title) {
    return title.length;
  },

  /**
   * Conta caracteres da descrição
   * @param {string} description - Descrição da tarefa
   * @returns {number}
   */
  getDescriptionCharCount(description) {
    return description.length;
  },

  /**
   * Valida o comprimento do título
   * @param {string} title - Título da tarefa
   * @param {number} maxLength - Comprimento máximo
   * @returns {boolean}
   */
  isTitleValid(title, maxLength = 100) {
    return title.length <= maxLength;
  },

  /**
   * Valida o comprimento da descrição
   * @param {string} description - Descrição da tarefa
   * @param {number} maxLength - Comprimento máximo
   * @returns {boolean}
   */
  isDescriptionValid(description, maxLength = 500) {
    return description.length <= maxLength;
  },
};
