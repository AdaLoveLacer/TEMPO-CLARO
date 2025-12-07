/**
 * Login Manager
 * Gerencia a lógica de autenticação e redirecionamento da página de login
 */

export const loginManager = {
  /**
   * Verifica se o usuário já está autenticado e o redireciona se necessário
   * @param {Object} user - Usuário autenticado
   * @param {boolean} isLoading - Estado de carregamento da autenticação
   * @param {Function} navigate - Função de navegação do react-router
   */
  handleUserRedirect(user, isLoading, navigate) {
    if (user && !isLoading) {
      navigate('/kanban');
    }
  },

  /**
   * Verifica se a página está carregando
   * @param {boolean} isLoading - Estado de carregamento
   * @returns {boolean}
   */
  isPageLoading(isLoading) {
    return isLoading;
  },
};
