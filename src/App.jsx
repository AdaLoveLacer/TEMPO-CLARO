import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { KanbanPage } from './pages/KanbanPage';
import { DashboardPage } from './pages/DashboardPage';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/kanban" element={<KanbanPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/" element={<Navigate to="/kanban" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
