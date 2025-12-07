import React, { useState } from 'react';
import '../../styles/TaskModal.css';

const TaskModal = ({ onClose, onAddTask }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().slice(0, 16),
    priority: 'média',
  });
  
  // Novo estado para o checkbox
  const [addToGoogle, setAddToGoogle] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Por favor, digite o título da tarefa');
      return;
    }
    
    // AQUI MUDOU: Passamos os dados E o valor do checkbox como segundo argumento
    onAddTask(formData, addToGoogle);
    
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().slice(0, 16),
      priority: 'média',
    });
    setAddToGoogle(false); // Resetar checkbox
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

          {/* NOVO CAMPO: Checkbox do Google Agenda */}
          <div className="form-group checkbox-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <input
              id="google-sync"
              type="checkbox"
              checked={addToGoogle}
              onChange={(e) => setAddToGoogle(e.target.checked)}
              style={{ width: 'auto', margin: 0 }}
            />
            <label htmlFor="google-sync" style={{ margin: 0, cursor: 'pointer' }}>
              Adicionar ao Google Agenda 📅
            </label>
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
  );
};

export default TaskModal;