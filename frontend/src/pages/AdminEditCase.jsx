// src/pages/AdminEditCase.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { caseAPI } from '../services/api';
import './AdminCaseForm.css';

const AdminEditCase = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    items: []
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadCase();
  }, [caseId]);

  const loadCase = async () => {
    try {
      const response = await caseAPI.getCaseById(caseId);
      setFormData(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке кейса:', error);
      alert('Кейс не найден');
      navigate('/admin');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await caseAPI.updateCase(caseId, formData);
      alert('Кейс успешно обновлен!');
      navigate('/admin');
    } catch (error) {
      console.error('Ошибка при обновлении кейса:', error);
      alert('Ошибка при обновлении кейса');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const updateItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          name: 'Новый предмет',
          image: '/skins/fallback.jpg',
          rarity: 'common',
          value: '1.00',
          chance: '10.00'
        }
      ]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotalChance = () => {
    return formData.items.reduce((total, item) => {
      const chance = parseFloat(item.chance) || 0;
      return total + chance;
    }, 0);
  };

  const totalChance = calculateTotalChance();

  if (initialLoading) {
    return (
      <div className="admin-case-form">
        <div className="loading">Загрузка кейса...</div>
      </div>
    );
  }

  return (
    <div className="admin-case-form">
      <div className="form-header">
        <h1>Редактировать кейс</h1>
        <button 
          type="button" 
          onClick={() => navigate('/admin')}
          className="back-btn"
        >
          ← Назад к админке
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Основная информация о кейсе */}
        <div className="form-section">
          <h2>Основная информация</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Название кейса *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Например: Dragon Case"
                required
              />
            </div>

            <div className="form-group">
              <label>Цена кейса ($) *</label>
              <input
                type="number"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="Например: 2.99"
                required
              />
            </div>

            <div className="form-group full-width">
              <label>URL изображения кейса</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="/skins/fallback.jpg"
              />
            </div>
          </div>
        </div>

        {/* Предметы в кейсе */}
        <div className="form-section">
          <div className="section-header">
            <h2>Предметы в кейсе</h2>
            <button type="button" onClick={addItem} className="add-item-btn">
              + Добавить предмет
            </button>
          </div>

          <div className="chance-stats">
            <div className={`total-chance ${Math.abs(totalChance - 100) < 0.01 ? 'valid' : 'invalid'}`}>
              Общая вероятность: <strong>{totalChance.toFixed(2)}%</strong>
              {Math.abs(totalChance - 100) >= 0.01 && (
                <span className="chance-warning">
                  {totalChance < 100 ? `Добавьте ${(100 - totalChance).toFixed(2)}%` : `Уберите ${(totalChance - 100).toFixed(2)}%`}
                </span>
              )}
            </div>
          </div>

          <div className="items-list">
            {formData.items.map((item, index) => (
              <div key={index} className="item-card">
                <div className="item-header">
                  <h3>Предмет {index + 1}</h3>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="remove-item-btn"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="item-form-grid">
                  <div className="form-group">
                    <label>Название предмета *</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      placeholder="AK-47 | Redline"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Стоимость ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.value}
                      onChange={(e) => updateItem(index, 'value', e.target.value)}
                      placeholder="45.99"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Шанс (%) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.chance}
                      onChange={(e) => updateItem(index, 'chance', e.target.value)}
                      placeholder="15.5"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Редкость</label>
                    <select
                      value={item.rarity}
                      onChange={(e) => updateItem(index, 'rarity', e.target.value)}
                    >
                      <option value="common">Обычный</option>
                      <option value="uncommon">Необычный</option>
                      <option value="rare">Редкий</option>
                      <option value="mythical">Мифический</option>
                      <option value="legendary">Легендарный</option>
                      <option value="ancient">Древний</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>URL изображения предмета</label>
                    <input
                      type="text"
                      value={item.image}
                      onChange={(e) => updateItem(index, 'image', e.target.value)}
                      placeholder="/skins/fallback.jpg"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="cancel-btn"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditCase;