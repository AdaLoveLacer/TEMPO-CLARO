import React, { useState } from 'react';
import { taskModalManager } from '../../manager/taskModalManager';
import '../../styles/TaskModal.css';

const TaskModal = ({ onClose, onAddTask }) => {
  const [formData, setFormData] = useState(taskModalManager.getInitialFormData());
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(taskModalManager.updateFormField(formData, name, value));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validation = taskModalManager.validateForm(formData);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    const taskData = taskModalManager.prepareTaskData(formData);
    onAddTask(taskData);
    setFormData(taskModalManager.resetForm());
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nova Tarefa</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
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
              placeholder="Ex: Estudar React"
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
              rows="4"
              maxLength={500}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Data e Hora *</label>
              <input
                id="date"
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority">Prioridade</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="baixa">Baixa</option>
                <option value="média">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}

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
  );
};

export default TaskModal;
