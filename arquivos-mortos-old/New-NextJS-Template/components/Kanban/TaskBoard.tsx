"use client"

import { useState } from "react"
import "../../styles/TaskBoard.css"
import TaskColumn from "./TaskColumn"
import TaskModal from "./TaskModal"

const TaskBoard = ({
  tasksByStatus,
  onAddTask,
  onDeleteTask,
  onCompleteTask,
  onUpdateTask,
  onStatusChange,
  allStatuses,
}) => {
  const [showModal, setShowModal] = useState(false)

  const getStatuses = () => {
    return Object.keys(tasksByStatus || {})
  }

  const statusColorMap = {
    "Em Progresso": "orange",
    Concluídas: "green",
    Aguardando: "purple",
    Pausada: "gray",
  }

  const statuses = getStatuses()
  const hasNoTasks = statuses.length === 0

  return (
    <div className="task-board">
      <div className="board-header">
        <div className="header-left">
          <h2>Minhas Tarefas</h2>
          {!hasNoTasks && (
            <span className="task-count">
              {Object.values(tasksByStatus).reduce((sum, tasks) => sum + tasks.length, 0)} tarefas
            </span>
          )}
        </div>
        <button className="btn-add-task" onClick={() => setShowModal(true)}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            style={{ marginRight: "8px" }}
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nova Tarefa
        </button>
      </div>

      {hasNoTasks ? (
        <div className="empty-state-container">
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path d="M9 12h6M9 16h6" />
              </svg>
            </div>
            <h3>Nenhuma tarefa ainda</h3>
            <p>Comece a organizar seu dia criando sua primeira tarefa com localização</p>
            <button className="btn-empty-state" onClick={() => setShowModal(true)}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{ marginRight: "8px" }}
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Criar primeira tarefa
            </button>
          </div>
        </div>
      ) : (
        <div className="board-columns">
          {statuses.map((status) => (
            <TaskColumn
              key={status}
              title={status}
              subtitle={`${tasksByStatus[status]?.length || 0} tarefa${tasksByStatus[status]?.length !== 1 ? "s" : ""}`}
              color={statusColorMap[status] || "blue"}
              tasks={tasksByStatus[status] || []}
              onDeleteTask={onDeleteTask}
              onCompleteTask={onCompleteTask}
              onUpdateTask={onUpdateTask}
              onStatusChange={onStatusChange}
              availableStatuses={statuses}
            />
          ))}
        </div>
      )}

      {showModal && (
        <TaskModal
          onClose={() => setShowModal(false)}
          onAddTask={(taskData) => {
            onAddTask(taskData)
            setShowModal(false)
          }}
          availableStatuses={allStatuses}
        />
      )}
    </div>
  )
}

export default TaskBoard
