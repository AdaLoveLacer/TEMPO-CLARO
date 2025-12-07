/**
 * Google Calendar Manager
 * Gerencia a integração com Google Calendar API
 */

export const googleCalendarManager = {
  /**
   * Inicializa a API do Google Calendar (Carrega o script gapi)
   */
  async initializeCalendarAPI() {
    return new Promise((resolve, reject) => {
      if (!window.gapi) {
        reject(new Error('Google API Script não carregado'));
        return;
      }
      
      window.gapi.load('client', async () => {
        try {
          // Apenas carrega o cliente, a autenticação vem de fora
          await window.gapi.client.init({
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  },

  /**
   * Sincroniza rotina com Google Calendar
   * @param {Object} routine - Rotina estruturada
   * @param {string} accessToken - Token de acesso do usuário logado
   */
  async syncRoutineToCalendar(routine, accessToken) {
    try {
      if (!accessToken) {
        throw new Error('Token de acesso inválido ou expirado.');
      }

      // Garante que a API está carregada
      if (!window.gapi.client) {
        await this.initializeCalendarAPI();
      }

      // Define o token para a requisição
      window.gapi.client.setToken({ access_token: accessToken });

      // 1. Obter ou criar o calendário "TEMPO-CLARO Rotinas"
      const calendarId = await this.getOrCreateRoutineCalendar();

      // 2. Gerar eventos baseados na recorrência
      const eventsToCreate = [];
      
      for (const task of routine.tasks) {
        // Gera todas as datas que essa tarefa acontece
        const dates = this.generateEventDates(
          routine.startDate,
          routine.endDate,
          routine.recurrence,
          task.daysOfWeek
        );

        // Cria um evento para cada data
        for (const date of dates) {
          const eventPayload = this.buildCalendarEvent(task, date, routine.color);
          eventsToCreate.push(eventPayload);
        }
      }

      // 3. Enviar eventos para o Google
      const results = { successful: 0, failed: 0, errors: [] };

      // Nota: Em produção, o ideal é usar "batch requests", mas faremos loop simples para garantir funcionamento
      for (const event of eventsToCreate) {
        try {
          await window.gapi.client.calendar.events.insert({
            calendarId: calendarId,
            resource: event,
          });
          results.successful++;
        } catch (err) {
          console.error('Erro ao criar evento:', event.summary, err);
          results.failed++;
          results.errors.push(err.message);
        }
      }

      return {
        success: results.failed === 0, // Sucesso total se nenhuma falhar
        totalEvents: eventsToCreate.length,
        successful: results.successful,
        failed: results.failed,
        calendarId,
        message: this.buildResultMessage(results),
      };

    } catch (error) {
      console.error('Erro na sincronização:', error);
      return {
        success: false,
        error: error.message || 'Erro desconhecido na sincronização',
      };
    }
  },

  /**
   * Obtém ou cria um calendário específico para o app
   */
  async getOrCreateRoutineCalendar() {
    try {
      // Lista calendários existentes
      const response = await window.gapi.client.calendar.calendarList.list();
      const calendars = response.result.items || [];
      
      const existingCalendar = calendars.find(
        cal => cal.summary === 'TEMPO-CLARO Rotinas'
      );

      if (existingCalendar) {
        return existingCalendar.id;
      }

      // Cria novo se não existir
      const newCalendar = await window.gapi.client.calendar.calendars.insert({
        resource: {
          summary: 'TEMPO-CLARO Rotinas',
          description: 'Rotinas criadas pelo app TempoClaro',
          timeZone: 'America/Sao_Paulo',
        },
      });

      return newCalendar.result.id;
    } catch (error) {
      throw new Error('Falha ao acessar calendário. Verifique as permissões.');
    }
  },

  /**
   * Gera lista de datas baseada na recorrência
   */
  generateEventDates(startDate, endDate, recurrence, daysOfWeek) {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Ajustar fuso horário para garantir comparação correta de datas (apenas dia)
    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);

    const dayNumberMap = {
      'domingo': 0, 'segunda': 1, 'terça': 2, 'quarta': 3, 
      'quinta': 4, 'sexta': 5, 'sábado': 6
    };

    const selectedDayNumbers = daysOfWeek.map(day => dayNumberMap[day.toLowerCase()]);

    let current = new Date(start);

    while (current <= end) {
      const dayOfWeek = current.getDay();

      // Se for "once" (uma vez), adiciona só a data de início e para
      if (recurrence === 'once') {
        dates.push(current.toISOString().split('T')[0]);
        break;
      }

      // Se for diário ou o dia da semana bater com os escolhidos
      if (recurrence === 'daily' || selectedDayNumbers.includes(dayOfWeek)) {
        dates.push(current.toISOString().split('T')[0]);
      }
      
      // Se for semanal ou mensal, a lógica básica aqui trata como "nos dias selecionados dentro do período"
      // Avança um dia
      current.setDate(current.getDate() + 1);
    }

    return dates;
  },

  buildCalendarEvent(task, date, routineColor) {
    // Formata hora (09:00 -> 09, 00)
    const [startHour, startMin] = task.startTime.split(':');
    const [endHour, endMin] = task.endTime.split(':');

    return {
      summary: task.title,
      description: task.description || '',
      start: {
        dateTime: `${date}T${startHour}:${startMin}:00`,
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: `${date}T${endHour}:${endMin}:00`,
        timeZone: 'America/Sao_Paulo',
      },
      colorId: this.mapColorToGoogleColorId(routineColor),
    };
  },

  mapColorToGoogleColorId(hexColor) {
    // Mapeamento simples de cores
    const colorMap = {
      '#667eea': '1', '#764ba2': '2', '#10b981': '3', 
      '#f59e0b': '4', '#ef4444': '5', '#06b6d4': '6', '#ec4899': '7'
    };
    return colorMap[hexColor] || '1'; // Azul padrão se não achar
  },

  buildResultMessage(result) {
    if (result.failed === 0) return `✅ ${result.successful} eventos sincronizados!`;
    if (result.successful === 0) return `❌ Falha total. Erros: ${result.errors[0]}`;
    return `⚠️ Parcial: ${result.successful} sucessos, ${result.failed} falhas.`;
  },

  openGoogleCalendar(calendarId) {
    const url = calendarId 
      ? `https://calendar.google.com/calendar/u/0/r?cid=${calendarId}` 
      : 'https://calendar.google.com';
    window.open(url, '_blank');
  }
};