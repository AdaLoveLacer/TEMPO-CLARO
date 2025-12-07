"use client"

import { useState } from "react"
import "../../styles/TaskCard.css"
import TaskEditModal from "./TaskEditModal"

const TaskCard = ({ task, onDelete, onComplete, onUpdate, onStatusChange, availableStatuses }) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleStatusSelect = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(task.id, newStatus)
    }
    setShowStatusDropdown(false)
  }

  return (
    <>
      <div className={`task-card ${task.completed ? "completed" : ""}`}>
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

        {task.description && <p className="task-description">{task.description}</p>}

        {task.location && (
          <div className="task-location">
            <div className="location-info">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{task.location}</span>
            </div>
          </div>
        )}

        {task.latitude && task.longitude && (
          <div className="task-location-map" onClick={() => setShowMapModal(true)}>
            <div className="map-placeholder">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span>Ver no mapa</span>
            </div>
          </div>
        )}

        <div className="task-footer">
          <div className="task-date">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            {formatDate(task.date)}
          </div>
          <div className="task-actions">
            <div className="status-dropdown-wrapper">
              <button
                className="btn-status"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                title="Mudar status"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 3a2.85 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
              </button>
              {showStatusDropdown && availableStatuses && (
                <div className="status-dropdown-menu">
                  {availableStatuses.map((status) => (
                    <button
                      key={status}
                      className={`status-option ${status === task.status ? "active" : ""}`}
                      onClick={() => handleStatusSelect(status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="btn-edit" onClick={() => setShowEditModal(true)} title="Editar tarefa">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button className="btn-delete" onClick={() => onDelete(task.id)} title="Deletar tarefa">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </button>
          </div>
        </div>

        {task.priority && <div className={`task-priority priority-${task.priority}`}>{task.priority}</div>}
      </div>

      {showEditModal && (
        <TaskEditModal
          task={task}
          onClose={() => setShowEditModal(false)}
          onUpdateTask={(updatedTask) => {
            onUpdate(updatedTask)
            setShowEditModal(false)
          }}
          availableStatuses={availableStatuses}
        />
      )}

      {showMapModal && task.latitude && task.longitude && (
        <div className="modal-overlay" onClick={() => setShowMapModal(false)}>
          <div className="map-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="map-modal-header">
              <h3>{task.title}</h3>
              <button className="modal-close" onClick={() => setShowMapModal(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="map-modal-body">
              <div className="map-placeholder-full">
                <div className="map-content">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="1.5">
                    <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="map-coords">
                    Lat: {task.latitude.toFixed(6)}
                    <br />
                    Long: {task.longitude.toFixed(6)}
                  </p>
                  <p className="map-note">Integração com mapas em desenvolvimento</p>
                </div>
              </div>
              {task.location && (
                <div className="map-info">
                  <p>
                    <strong>Local:</strong> {task.location}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TaskCard
