// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { caseAPI } from '../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const response = await caseAPI.getCases();
      setCases(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке кейсов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCase = async (caseId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот кейс?')) {
      try {
        await caseAPI.deleteCase(caseId);
        loadCases();
      } catch (error) {
        console.error('Ошибка при удалении кейса:', error);
        alert('Ошибка при удалении кейса');
      }
    }
  };

  const handleResetCases = async () => {
    if (window.confirm('Вы уверены, что хотите сбросить все кейсы к значениям по умолчанию?')) {
      try {
        await caseAPI.resetToDefault();
        loadCases();
        alert('Кейсы сброшены к значениям по умолчанию');
      } catch (error) {
        console.error('Ошибка при сбросе кейсов:', error);
        alert('Ошибка при сбросе кейсов');
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="loading">Загрузка кейсов...</div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Управление кейсами</h1>
        <p>Создавайте, редактируете и удаляйте кейсы</p>
      </div>

      <div className="admin-actions">
        <Link to="/admin/add-case" className="admin-action-card">
          <div className="action-icon">📦</div>
          <h3>Добавить новый кейс</h3>
          <p>Создайте новый кейс с предметами</p>
        </Link>
        
        <button onClick={handleResetCases} className="admin-action-card reset-card">
          <div className="action-icon">🔄</div>
          <h3>Сбросить к дефолтным</h3>
          <p>Вернуть все кейсы к исходным значениям</p>
        </button>
      </div>

      <div className="cases-grid">
        {cases.length === 0 ? (
          <div className="no-cases">
            <p>Нет добавленных кейсов</p>
            <Link to="/admin/add-case" className="add-case-btn">
              Добавить первый кейс
            </Link>
          </div>
        ) : (
          cases.map(caseItem => (
            <div key={caseItem.id} className="case-card">
              <div className="case-preview">
                <img 
                  src={caseItem.image} 
                  alt={caseItem.name}
                  className="case-image"
                  onError={(e) => {
                    e.target.src = '/skins/fallback.jpg';
                  }}
                />
                <div className="case-info">
                  <h3>{caseItem.name}</h3>
                  <p className="case-price">${caseItem.price}</p>
                  <p className="case-items">{caseItem.items?.length || 0} предметов</p>
                </div>
              </div>
              
              <div className="case-actions">
                <Link 
                  to={`/admin/edit-case/${caseItem.id}`} 
                  className="edit-btn"
                >
                  ✏️ Редактировать
                </Link>
                <button 
                  onClick={() => handleDeleteCase(caseItem.id)}
                  className="delete-btn"
                >
                  🗑️ Удалить
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPanel;