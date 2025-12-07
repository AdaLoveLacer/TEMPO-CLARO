/**
 * Task Modal Manager
 * Gerencia a lógica do modal de criação de tarefas
 */

export const taskModalManager = {
  /**
   * Estado inicial do formulário de criação
   * @returns {Object} Objeto com dados iniciais do formulário
   */
  getInitialFormData() {
    return {
      title: '',
      description: '',
      date: new Date().toISOString().slice(0, 16),
      priority: 'média',
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
   * Valida o formulário de criação de tarefa
   * @param {Object} formData - Dados do formulário
   * @returns {Object} Objeto com isValid e mensagem de erro
   */
  validateForm(formData) {
    if (!formData.title.trim()) {
      return {
        isValid: false,
        message: 'Por favor, digite o título da tarefa',
      };
    }

    if (!formData.date) {
      return {
        isValid: false,
        message: 'Por favor, selecione uma data para a tarefa',
      };
    }

    return {
      isValid: true,
      message: '',
    };
  },

  /**
   * Reseta o formulário para estado inicial
   * @returns {Object} Formulário resetado
   */
  resetForm() {
    return this.getInitialFormData();
  },

  /**
   * Prepara os dados da tarefa para ser adicionada
   * @param {Object} formData - Dados do formulário
   * @returns {Object} Dados da tarefa prontos
   */
  prepareTaskData(formData) {
    return {
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: formData.date,
      priority: formData.priority,
    };
  },
};
