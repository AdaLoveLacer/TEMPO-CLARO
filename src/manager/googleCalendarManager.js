/**
 * Google Calendar Manager
 * Gerencia a integração com Google Calendar API
 */

export const googleCalendarManager = {
  /**
   * Inicializa a API do Google Calendar
   * @param {Object} gapi - Objeto global do Google API
   * @returns {Promise}
   */
  async initializeCalendarAPI(gapi) {
    return new Promise((resolve, reject) => {
      gapi.load('client', async () => {
        try {
          await gapi.client.init({
            apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
            clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
            scope: 'https://www.googleapis.com/auth/calendar',
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  },

  /**
   * Cria eventos no Google Calendar
   * @param {Array} events - Lista de eventos a criar
   * @param {string} calendarId - ID do calendário (padrão: 'primary')
   * @returns {Promise<Object>} Resultado da operação
   */
  async createCalendarEvents(events, calendarId = 'primary') {
    try {
      const results = {
        successful: 0,
        failed: 0,
        errors: [],
      };

      for (const event of events) {
        try {
          const response = await gapi.client.calendar.events.insert({
            calendarId,
            resource: event,
          });

          if (response.result) {
            results.successful++;
          }
        } catch (error) {
          results.failed++;
          results.errors.push({
            event: event.summary,
            error: error.message,
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Erro ao criar eventos no Google Calendar:', error);
      throw new Error(`Falha ao sincronizar: ${error.message}`);
    }
  },

  /**
   * Lista calendários disponíveis
   * @returns {Promise<Array>} Lista de calendários
   */
  async listCalendars() {
    try {
      const response = await gapi.client.calendar.calendarList.list();
      return response.result.items || [];
    } catch (error) {
      console.error('Erro ao listar calendários:', error);
      return [];
    }
  },

  /**
   * Obtém ou cria um calendário para rotinas
   * @returns {Promise<string>} ID do calendário
   */
  async getOrCreateRoutineCalendar() {
    try {
      const calendars = await this.listCalendars();
      
      // Procura por calendário existente
      const existingCalendar = calendars.find(
        cal => cal.summary === 'TEMPO-CLARO Rotinas'
      );

      if (existingCalendar) {
        return existingCalendar.id;
      }

      // Cria novo calendário se não existir
      const newCalendar = await gapi.client.calendar.calendars.insert({
        resource: {
          summary: 'TEMPO-CLARO Rotinas',
          description: 'Rotinas estruturadas criadas no TEMPO-CLARO',
          timeZone: 'America/Sao_Paulo',
        },
      });

      return newCalendar.result.id;
    } catch (error) {
      console.error('Erro ao obter/criar calendário:', error);
      throw new Error('Falha ao acessar Google Calendar');
    }
  },

  /**
   * Valida se o usuário está autenticado no Google
   * @returns {boolean}
   */
  isUserAuthenticated() {
    try {
      return gapi.auth2.getAuthInstance().isSignedIn.get();
    } catch (error) {
      return false;
    }
  },

  /**
   * Obtém token de acesso do Google
   * @returns {string|null}
   */
  getAccessToken() {
    try {
      const user = gapi.auth2.getAuthInstance().currentUser.get();
      return user.getAuthResponse().id_token;
    } catch (error) {
      return null;
    }
  },

  /**
   * Constrói evento para Google Calendar
   * @param {Object} task - Tarefa estruturada
   * @param {string} date - Data do evento (YYYY-MM-DD)
   * @param {string} routineColor - Cor da rotina
   * @returns {Object} Evento formatado para Google Calendar
   */
  buildCalendarEvent(task, date, routineColor) {
    const [startHour, startMin] = task.startTime.split(':');
    const [endHour, endMin] = task.endTime.split(':');

    const startDateTime = `${date}T${startHour}:${startMin}:00`;
    const endDateTime = `${date}T${endHour}:${endMin}:00`;

    return {
      summary: task.title,
      description: task.description || '',
      start: {
        dateTime: startDateTime,
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'America/Sao_Paulo',
      },
      colorId: this.mapColorToGoogleColorId(routineColor),
      conferenceData: {
        conferenceSolution: {
          key: { conferenceSolutionKey: { conferenceSolutionType: 'hangoutsMeet' } },
        },
      },
    };
  },

  /**
   * Mapeia cores hex para IDs do Google Calendar
   * @param {string} hexColor - Cor em hex
   * @returns {string} ID da cor
   */
  mapColorToGoogleColorId(hexColor) {
    const colorMap = {
      '#667eea': '1',  // Azul
      '#764ba2': '2',  // Roxo
      '#10b981': '3',  // Verde
      '#f59e0b': '4',  // Laranja
      '#ef4444': '5',  // Vermelho
      '#06b6d4': '6',  // Cyan
      '#ec4899': '7',  // Rosa
      '#6366f1': '8',  // Índigo
    };

    return colorMap[hexColor] || '1';
  },

  /**
   * Gera datas para eventos recorrentes
   * @param {string} startDate - Data de início (YYYY-MM-DD)
   * @param {string} endDate - Data de fim (YYYY-MM-DD)
   * @param {string} recurrence - Tipo de recorrência
   * @param {Array} daysOfWeek - Dias da semana selecionados
   * @returns {Array} Array de datas geradas
   */
  generateEventDates(startDate, endDate, recurrence, daysOfWeek) {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    const dayNumberMap = {
      segunda: 1,
      terça: 2,
      quarta: 3,
      quinta: 4,
      sexta: 5,
      sábado: 6,
      domingo: 0,
    };

    const selectedDayNumbers = daysOfWeek.map(day => dayNumberMap[day]).sort();

    let current = new Date(start);

    while (current <= end) {
      const dayOfWeek = current.getDay();

      if (recurrence === 'daily' || selectedDayNumbers.includes(dayOfWeek)) {
        const dateStr = current.toISOString().split('T')[0];
        dates.push(dateStr);
      }

      current.setDate(current.getDate() + 1);
    }

    return dates;
  },

  /**
   * Sincroniza rotina com Google Calendar
   * @param {Object} routine - Rotina estruturada
   * @returns {Promise<Object>} Resultado da sincronização
   */
  async syncRoutineToCalendar(routine) {
    try {
      // Verificar autenticação
      if (!this.isUserAuthenticated()) {
        throw new Error('Usuário não autenticado no Google');
      }

      // Obter/criar calendário
      const calendarId = await this.getOrCreateRoutineCalendar();

      // Construir eventos
      const events = [];
      
      for (const task of routine.tasks) {
        const dates = this.generateEventDates(
          routine.startDate,
          routine.endDate,
          routine.recurrence,
          task.daysOfWeek
        );

        for (const date of dates) {
          const event = this.buildCalendarEvent(task, date, routine.color);
          events.push(event);
        }
      }

      // Criar eventos no calendário
      const result = await this.createCalendarEvents(events, calendarId);

      return {
        success: result.failed === 0,
        totalEvents: events.length,
        successful: result.successful,
        failed: result.failed,
        errors: result.errors,
        calendarId,
        message: this.buildResultMessage(result),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        totalEvents: 0,
        successful: 0,
        failed: 0,
      };
    }
  },

  /**
   * Constrói mensagem de resultado
   * @param {Object} result - Resultado da operação
   * @returns {string}
   */
  buildResultMessage(result) {
    if (result.failed === 0) {
      return `✅ ${result.successful} eventos adicionados com sucesso!`;
    } else if (result.successful === 0) {
      return `❌ Falha ao sincronizar ${result.failed} eventos`;
    } else {
      return `⚠️ ${result.successful} eventos criados, ${result.failed} falharam`;
    }
  },

  /**
   * Abre Google Calendar em nova aba
   * @param {string} calendarId - ID do calendário (opcional)
   */
  openGoogleCalendar(calendarId = null) {
    if (calendarId) {
      window.open(`https://calendar.google.com/calendar/u/0/r?cid=${calendarId}`, '_blank');
    } else {
      window.open('https://calendar.google.com', '_blank');
    }
  },

  /**
   * Remove eventos da rotina do Google Calendar
   * @param {string} calendarId - ID do calendário
   * @param {Array} eventIds - IDs dos eventos a remover
   * @returns {Promise<Object>}
   */
  async removeCalendarEvents(calendarId, eventIds) {
    try {
      const results = {
        successful: 0,
        failed: 0,
      };

      for (const eventId of eventIds) {
        try {
          await gapi.client.calendar.events.delete({
            calendarId,
            eventId,
          });
          results.successful++;
        } catch (error) {
          results.failed++;
        }
      }

      return results;
    } catch (error) {
      console.error('Erro ao remover eventos:', error);
      throw error;
    }
  },
};
