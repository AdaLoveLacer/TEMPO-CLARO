import React, { useState } from 'react';
import '../../styles/TaskCard.css';
import TaskEditModal from './TaskEditModal';

const TaskCard = ({ task, onDelete, onComplete, onUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <div className={`task-card ${task.completed ? 'completed' : ''}`}>
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

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-footer">
          <div className="task-date">
            <span className="date-icon">📅</span>
            {formatDate(task.date)}
          </div>
          <div className="task-actions">
            <button
              className="btn-edit"
              onClick={() => setShowEditModal(true)}
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

        {task.priority && (
          <div className={`task-priority priority-${task.priority}`}>
            {task.priority}
          </div>
        )}
      </div>

      {showEditModal && (
        <TaskEditModal
          task={task}
          onClose={() => setShowEditModal(false)}
          onUpdateTask={(updatedTask) => {
            onUpdate(updatedTask);
            setShowEditModal(false);
          }}
        />
      )}
    </>
  );
};

export default TaskCard;
