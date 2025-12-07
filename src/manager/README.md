# Manager - Lógica da Aplicação

Pasta responsável por manter toda a lógica de negócio separada dos componentes de UI (páginas e componentes).

## Estrutura

### Managers por Funcionalidade

#### `loginManager.js`
Gerencia a lógica de autenticação e redirecionamento da página de login.
- `handleUserRedirect()` - Redireciona usuário autenticado
- `isPageLoading()` - Verifica estado de carregamento

#### `dashboardManager.js`
Gerencia a lógica de carregamento de tarefas e cálculo de estatísticas.
- `loadTasksFromStorage()` - Carrega tarefas do localStorage
- `calculateStats()` - Calcula estatísticas das tarefas
- `navigateToKanban()` - Navega para página Kanban
- `handleLogout()` - Realiza logout do usuário
- `calculatePriorityPercentage()` - Calcula porcentagem de prioridades

#### `kanbanManager.js`
Gerencia a lógica principal do quadro Kanban (CRUD de tarefas).
- `loadTasksFromStorage()` - Carrega tarefas
- `saveTasksToStorage()` - Salva tarefas no localStorage
- `categorizeTasks()` - Categoriza tarefas por status
- `createTask()` - Cria nova tarefa
- `deleteTask()` - Deleta uma tarefa
- `toggleCompleteTask()` - Marca/desmarca tarefa como concluída
- `updateTask()` - Atualiza uma tarefa
- `handleLogout()` - Realiza logout
- `navigateToDashboard()` - Navega para Dashboard

#### `taskBoardManager.js`
Gerencia a lógica de exibição do quadro de tarefas.
- `openAddTaskModal()` - Abre modal de criação
- `closeAddTaskModal()` - Fecha modal de criação
- `handleAddTask()` - Trata adição de nova tarefa
- `isModalVisible()` - Valida visibilidade do modal
- `getTaskCounts()` - Calcula contagem de tarefas por coluna

#### `taskCardManager.js`
Gerencia a lógica de um card individual de tarefa.
- `openEditModal()` - Abre modal de edição
- `closeEditModal()` - Fecha modal de edição
- `formatDate()` - Formata data para exibição
- `getTaskClass()` - Retorna classe CSS da tarefa
- `getPriorityClass()` - Retorna classe CSS da prioridade
- `hasDescription()` - Valida se tem descrição
- `hasPriority()` - Valida se tem prioridade

#### `taskColumnManager.js`
Gerencia a lógica de uma coluna de tarefas.
- `hasNoTasks()` - Valida se coluna está vazia
- `getColumnSubtitle()` - Retorna subtítulo formatado
- `getColumnClass()` - Retorna classe CSS da coluna
- `isValidTitle()` - Valida título
- `sortTasksByDate()` - Ordena tarefas por data

#### `taskModalManager.js`
Gerencia a lógica do modal de criação de tarefas.
- `getInitialFormData()` - Retorna dados iniciais do form
- `updateFormField()` - Atualiza campo do form
- `validateForm()` - Valida formulário
- `resetForm()` - Reseta formulário
- `prepareTaskData()` - Prepara dados para envio

#### `taskEditModalManager.js`
Gerencia a lógica do modal de edição de tarefas.
- `formatDateForInput()` - Formata data para input
- `getInitialFormData()` - Retorna dados iniciais baseado na tarefa
- `updateFormField()` - Atualiza campo do form
- `validateForm()` - Valida formulário
- `prepareUpdatedTask()` - Prepara tarefa atualizada
- `getTitleCharCount()` - Conta caracteres do título
- `getDescriptionCharCount()` - Conta caracteres da descrição
- `isTitleValid()` - Valida comprimento do título
- `isDescriptionValid()` - Valida comprimento da descrição

## Como Usar

### Importação Simples
```javascript
import { kanbanManager } from '../manager/kanbanManager';

// Usar as funções
const tasks = kanbanManager.loadTasksFromStorage();
const categorized = kanbanManager.categorizeTasks(tasks);
```

### Importação via Index
```javascript
import { kanbanManager, taskCardManager } from '../manager';

// Usar os managers
```

## Benefícios

✅ **Separação de Responsabilidades** - Lógica separada da UI
✅ **Reutilização de Código** - Managers podem ser usados em múltiplos componentes
✅ **Facilidade de Testes** - Funções puras e testáveis
✅ **Manutenção** - Código organizado e centralizado
✅ **Escalabilidade** - Fácil adicionar novos managers conforme a app cresce
