import React, { useState } from 'react';
import { taskBoardManager } from '../../manager/taskBoardManager';
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

  const taskCounts = taskBoardManager.getTaskCounts(todoTasks, inProgressTasks, completedTasks);

  return (
    <div className="task-board">
      <div className="board-header">
        <h2>Minhas Tarefas</h2>
        <button
          className="btn-add-task"
          onClick={() => setShowModal(taskBoardManager.openAddTaskModal())}
        >
          + Nova Tarefa
        </button>
      </div>

      <div className="board-columns">
        <TaskColumn
          title="A Fazer"
          subtitle={`${taskCounts.todo} tarefas`}
          color="blue"
          tasks={todoTasks}
          onDeleteTask={onDeleteTask}
          onCompleteTask={onCompleteTask}
          onUpdateTask={onUpdateTask}
        />
        <TaskColumn
          title="Em Progresso"
          subtitle={`${taskCounts.inProgress} tarefas`}
          color="orange"
          tasks={inProgressTasks}
          onDeleteTask={onDeleteTask}
          onCompleteTask={onCompleteTask}
          onUpdateTask={onUpdateTask}
        />
        <TaskColumn
          title="Concluídas"
          subtitle={`${taskCounts.completed} tarefas`}
          color="green"
          tasks={completedTasks}
          onDeleteTask={onDeleteTask}
          onCompleteTask={onCompleteTask}
          onUpdateTask={onUpdateTask}
        />
      </div>

      {taskBoardManager.isModalVisible(showModal) && (
        <TaskModal
          onClose={() => setShowModal(taskBoardManager.closeAddTaskModal())}
          onAddTask={(taskData) => {
            onAddTask(taskData);
            setShowModal(taskBoardManager.closeAddTaskModal());
          }}
        />
      )}
    </div>
  );
};

export default TaskBoard;
