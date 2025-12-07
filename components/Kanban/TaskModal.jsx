"use client"

import { useState } from "react"
import "../../styles/TaskModal.css"

const TaskModal = ({ onClose, onAddTask, availableStatuses }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().slice(0, 16),
    priority: "média",
    status: "",
    location: "",
    latitude: null,
    longitude: null,
  })

  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não suportada pelo seu navegador")
      return
    }

    setIsLoadingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }))
        setIsLoadingLocation(false)
      },
      (error) => {
        console.error("Erro ao obter localização:", error)
        alert("Não foi possível obter sua localização")
        setIsLoadingLocation(false)
      },
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      alert("Por favor, digite o título da tarefa")
      return
    }
    if (!formData.status.trim()) {
      alert("Por favor, digite o status da tarefa")
      return
    }
    onAddTask(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nova Tarefa</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Título da Tarefa *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Reunião com cliente"
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva a tarefa (opcional)"
              rows="3"
              maxLength={500}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Data e Hora *</label>
              <input id="date" type="datetime-local" name="date" value={formData.date} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="priority">Prioridade</label>
              <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
                <option value="baixa">Baixa</option>
                <option value="média">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status / Coluna *</label>
            <input
              id="status"
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              placeholder="Ex: Em Progresso, Aguardando, etc."
              list="status-suggestions"
            />
            {availableStatuses && availableStatuses.length > 0 && (
              <datalist id="status-suggestions">
                {availableStatuses.map((status) => (
                  <option key={status} value={status} />
                ))}
              </datalist>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="location">Localização</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ex: Escritório, Casa, etc."
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isLoadingLocation}
                style={{
                  padding: "0.875rem 1rem",
                  background: "rgba(6, 182, 212, 0.2)",
                  border: "1px solid rgba(6, 182, 212, 0.3)",
                  borderRadius: "12px",
                  color: "#06b6d4",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
              >
                {isLoadingLocation ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ animation: "spin 1s linear infinite" }}
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {formData.latitude && formData.longitude && (
              <small style={{ color: "rgba(6, 182, 212, 0.8)", marginTop: "0.5rem", display: "block" }}>
                Coordenadas: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
              </small>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Criar Tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal
