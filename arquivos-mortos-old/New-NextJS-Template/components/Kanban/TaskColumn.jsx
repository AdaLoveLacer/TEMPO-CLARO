"use client"

import "../../styles/TaskColumn.css"
import TaskCard from "./TaskCard"

const TaskColumn = ({
  title,
  subtitle,
  color,
  tasks,
  onDeleteTask,
  onCompleteTask,
  onUpdateTask,
  onStatusChange,
  availableStatuses,
}) => {
  return (
    <div className={`task-column column-${color}`}>
      <div className="column-header">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <div className="column-content">
        {tasks && tasks.length > 0 ? (
          <div className="tasks-list">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
                onComplete={onCompleteTask}
                onUpdate={onUpdateTask}
                onStatusChange={onStatusChange}
                availableStatuses={availableStatuses}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">Nenhuma tarefa</div>
        )}
      </div>
    </div>
  )
}

export default TaskColumn
