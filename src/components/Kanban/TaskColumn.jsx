import React from 'react';
import '../../styles/TaskColumn.css';
import TaskCard from './TaskCard';

const TaskColumn = ({
  title,
  subtitle,
  color,
  tasks,
  onDeleteTask,
  onCompleteTask,
  onUpdateTask,
}) => {
  return (
    <div className={`task-column column-${color}`}>
      <div className="column-header">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="column-content">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma tarefa aqui</p>
          </div>
        ) : (
          <div className="tasks-list">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
                onComplete={onCompleteTask}
                onUpdate={onUpdateTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
