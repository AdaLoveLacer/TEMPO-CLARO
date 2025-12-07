import React, { useState, useEffect } from 'react';
import { taskEditModalManager } from '../../manager/taskEditModalManager';
import '../../styles/TaskEditModal.css';

const TaskEditModal = ({ task, onClose, onUpdateTask }) => {
  const [formData, setFormData] = useState(taskEditModalManager.getInitialFormData(task));
  const [error, setError] = useState('');

  // Preencher form com dados da tarefa atual
  useEffect(() => {
    if (task) {
      setFormData(taskEditModalManager.getInitialFormData(task));
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(taskEditModalManager.updateFormField(formData, name, value));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = taskEditModalManager.validateForm(formData);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    // Enviar dados atualizados
    const updatedTask = taskEditModalManager.prepareUpdatedTask(task, formData);
    onUpdateTask(updatedTask);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-edit" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Tarefa</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="title">Título da Tarefa *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Estudar React"
              maxLength="100"
              required
            />
            <span className="char-count">
              {taskEditModalManager.getTitleCharCount(formData.title)}/100
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição (Opcional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva os detalhes da tarefa..."
              maxLength="500"
              rows="4"
            />
            <span className="char-count">
              {taskEditModalManager.getDescriptionCharCount(formData.description)}/500
            </span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Data e Hora *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
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
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-save"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditModal;
