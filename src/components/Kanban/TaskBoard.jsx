import React, { useState } from 'react';
import '../../styles/TaskBoard.css';
import TaskColumn from './TaskColumn';
import TaskModal from './TaskModal';

const TaskBoard = ({
  todoTasks,
  inProgressTasks,
  completedTasks,
  onAddTask,
  onDeleteTask,
  onCompleteTask,
  onUpdateTask,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="task-board">
      <div className="board-header">
        <h2>Minhas Tarefas</h2>
        <button
          className="btn-add-task"
          onClick={() => setShowModal(true)}
        >
          + Nova Tarefa
        </button>
      </div>

      <div className="board-columns">
        <TaskColumn
          title="A Fazer"
          subtitle={`${todoTasks.length} tarefas`}
          color="blue"
          tasks={todoTasks}
          onDeleteTask={onDeleteTask}
          onCompleteTask={onCompleteTask}
          onUpdateTask={onUpdateTask}
        />
        <TaskColumn
          title="Em Progresso"
          subtitle={`${inProgressTasks.length} tarefas`}
          color="orange"
          tasks={inProgressTasks}
          onDeleteTask={onDeleteTask}
          onCompleteTask={onCompleteTask}
          onUpdateTask={onUpdateTask}
        />
        <TaskColumn
          title="Concluídas"
          subtitle={`${completedTasks.length} tarefas`}
          color="green"
          tasks={completedTasks}
          onDeleteTask={onDeleteTask}
          onCompleteTask={onCompleteTask}
          onUpdateTask={onUpdateTask}
        />
      </div>

      {showModal && (
        <TaskModal
          onClose={() => setShowModal(false)}
          // AQUI MUDOU: Agora recebemos dois argumentos e passamos os dois adiante
          onAddTask={(taskData, addToGoogle) => {
            onAddTask(taskData, addToGoogle);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default TaskBoard;