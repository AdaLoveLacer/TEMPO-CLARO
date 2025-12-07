import React, { useState } from 'react';
import { taskCardManager } from '../../manager/taskCardManager';
import '../../styles/TaskCard.css';
import TaskEditModal from './TaskEditModal';

const TaskCard = ({ task, onDelete, onComplete, onUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <div className={taskCardManager.getTaskClass(task.completed)}>
        <div className="task-header">
          <input
            type="checkbox"
            className="task-checkbox"
            checked={task.completed}
            onChange={() => onComplete(task.id)}
            aria-label="Marcar tarefa como concluída"
          />
          <h4 className="task-title">{task.title}</h4>
        </div>

        {taskCardManager.hasDescription(task.description) && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-footer">
          <div className="task-date">
            <span className="date-icon">📅</span>
            {taskCardManager.formatDate(task.date)}
          </div>
          <div className="task-actions">
            <button
              className="btn-edit"
              onClick={() => setShowEditModal(taskCardManager.openEditModal())}
              title="Editar tarefa"
            >
              ✏️
            </button>
            <button
              className="btn-delete"
              onClick={() => onDelete(task.id)}
              title="Deletar tarefa"
            >
              🗑️
            </button>
          </div>
        </div>

        {taskCardManager.hasPriority(task.priority) && (
          <div className={taskCardManager.getPriorityClass(task.priority)}>
            {task.priority}
          </div>
        )}
      </div>

      {showEditModal && (
        <TaskEditModal
          task={task}
          onClose={() => setShowEditModal(taskCardManager.closeEditModal())}
          onUpdateTask={(updatedTask) => {
            onUpdate(updatedTask);
            setShowEditModal(taskCardManager.closeEditModal());
          }}
        />
      )}
    </>
  );
};

export default TaskCard;
