// src/pages/AdminAddCase.jsx (обновленная версия)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { caseAPI } from '../services/api';
import './AdminCaseForm.css';

const AdminAddCase = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'Operation Broken Fang Case',
    price: '2.99',
    image: '/skins/operation_broken_fang_case.jpg',
    items: [
      {
        name: 'P90 | Blind Spot',
        image: '/skins/p90_blind_spot.jpg',
        rarity: 'common',
        value: '0.45',
        chance: '25.0'
      },
      {
        name: 'Nova | Green Apple',
        image: '/skins/nova_green_apple.jpg',
        rarity: 'common',
        value: '0.32',
        chance: '20.0'
      },
      {
        name: 'UMP-45 | Bone Pile',
        image: '/skins/ump_45_bone_pile.jpg',
        rarity: 'uncommon',
        value: '1.25',
        chance: '15.0'
      },
      {
        name: 'Dual Berettas | Black Limba',
        image: '/skins/dual_berettas_black_limba.jpg',
        rarity: 'uncommon',
        value: '0.85',
        chance: '12.0'
      },
      {
        name: 'PP-Bizon | Forest Leaves',
        image: '/skins/pp_bizon_forest_leaves.jpg',
        rarity: 'rare',
        value: '3.50',
        chance: '8.0'
      },
      {
        name: 'Negev | Ultralight',
        image: '/skins/negev_ultralight.jpg',
        rarity: 'rare',
        value: '2.75',
        chance: '7.0'
      },
      {
        name: 'XM1014 | Ziggy Anarchy',
        image: '/skins/xm1014_ziggy_anarchy.jpg',
        rarity: 'mythical',
        value: '12.00',
        chance: '5.0'
      },
      {
        name: 'P2000 | Urban Hazard',
        image: '/skins/p2000_urban_hazard.jpg',
        rarity: 'mythical',
        value: '8.50',
        chance: '4.0'
      },
      {
        name: 'Galil AR | Cold Fusion',
        image: '/skins/galil_ar_cold_fusion.jpg',
        rarity: 'legendary',
        value: '45.00',
        chance: '2.5'
      },
      {
        name: 'MP9 | Food Chain',
        image: '/skins/mp9_food_chain.jpg',
        rarity: 'legendary',
        value: '35.00',
        chance: '1.5'
      }
    ]
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name || !formData.price) {
        alert('Заполните название и цену кейса');
        return;
      }

      const caseData = {
        ...formData,
        price: parseFloat(formData.price),
        items: formData.items.map(item => ({
          ...item,
          value: parseFloat(item.value),
          chance: parseFloat(item.chance)
        }))
      };

      console.log('Создаем кейс:', caseData);
      await caseAPI.createCase(caseData);
      
      alert('Кейс успешно создан!');
      navigate('/admin');
    } catch (error) {
      console.error('Ошибка при создании кейса:', error);
      alert('Ошибка при создании кейса: ' + error.message);
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

  return (
    <div className="admin-case-form">
      <div className="form-header">
        <h1>Добавить новый кейс</h1>
        <button 
          type="button" 
          onClick={() => navigate('/admin')}
          className="back-btn"
        >
          ← Назад к админке
        </button>
      </div>

      <form onSubmit={handleSubmit}>
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
                placeholder="Например: Operation Broken Fang Case"
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
                placeholder="/skins/operation_broken_fang_case.jpg"
              />
              <small style={{color: '#b0c3d9', marginTop: '0.5rem', display: 'block'}}>
                Примеры: /skins/operation_broken_fang_case.jpg, /skins/revolution_case.jpg
              </small>
            </div>
          </div>
        </div>

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
                      placeholder="P90 | Blind Spot"
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
                      placeholder="0.45"
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
                      placeholder="25.0"
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
                      placeholder="/skins/p90_blind_spot.jpg"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
            {loading ? 'Создание...' : 'Создать кейс'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddCase;