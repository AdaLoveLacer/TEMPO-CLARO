/**
 * Login Manager
 * Gerencia a lógica de autenticação e redirecionamento na página de login
 */

import { uiManager } from './uiManager';

export const loginManager = {
  /**
   * Processa efeitos de autenticação ao carregar a página
   * @param {Object} user - usuário do contexto
   * @param {boolean} isLoading - se está carregando
   * @param {Function} navigate - função navigate
   * @param {string} redirectPath - para onde redirecionar se autenticado
   */
  handleAuthCheck(user, isLoading, navigate, redirectPath = '/routine') {
    uiManager.redirectIfAuthenticated(user, isLoading, navigate, redirectPath);
  },

  /**
   * Verifica se o usuário já está autenticado e o redireciona (DEPRECATED - usar handleAuthCheck)
   */
  handleUserRedirect(user, isLoading, navigate) {
    this.handleAuthCheck(user, isLoading, navigate, '/routine');
  },

  /**
   * Retorna dados para renderização da página de login
   * @returns {Object} - dados da página de login
   */
  getLoginPageData() {
    return {
      appTitle: 'TEMPO-CLARO',
      welcomeText: 'Bem-vindo ao nosso aplicativo',
      loginDescription: 'Faça login usando sua conta Google para acessar o aplicativo.',
      termsText: 'Ao fazer login, você concorda com nossos',
      termsLink: '/terms',
      termsLabel: 'Termos de Serviço',
      privacyLink: '/privacy',
      privacyLabel: 'Política de Privacidade',
      loginButtonText: 'Entrar com Google e Permitir Agenda',
    };
  },

  /**
   * Valida se o estado de carregamento é válido para mostrar login
   * @param {boolean} isLoading - se está carregando
   * @returns {boolean} - se deve mostrar página de login
   */
  shouldShowLoginPage(isLoading) {
    return !isLoading;
  },

  isPageLoading(isLoading) {
    return isLoading;
  },
};