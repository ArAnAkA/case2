// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { caseAPI } from '../services/api';
import ImageWithFallback from '../components/ImageWithFallback';
import './Home.css';

const Home = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      console.log('🔄 Home: Загружаю кейсы...');
      const response = await caseAPI.getCases();
      console.log('✅ Home: Кейсы загружены:', response.data);
      
      if (response.data && response.data.length > 0) {
        setCases(response.data);
      } else {
        console.log('⚠️ Home: Кейсы пустые, сбрасываю к дефолтным...');
        const resetResponse = await caseAPI.resetToDefault();
        setCases(resetResponse.data);
      }
    } catch (error) {
      console.error('❌ Home: Ошибка загрузки кейсов:', error);
      setError('Ошибка загрузки кейсов');
    } finally {
      setLoading(false);
    }
  };

  const handleResetCases = async () => {
    try {
      setLoading(true);
      const response = await caseAPI.resetToDefault();
      setCases(response.data);
      setError('');
    } catch (error) {
      console.error('❌ Ошибка сброса кейсов:', error);
      setError('Ошибка сброса кейсов');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка кейсов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">CS2 CASE BATTLE</h1>
          <p className="hero-description">
            Открывай кейсы и выигрывай скины!
          </p>
          
          {error && (
            <div className="error-message">
              {error}
              <button onClick={loadCases} className="retry-btn">
                Повторить
              </button>
            </div>
          )}

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{cases.length}</span>
              <span className="stat-label">Кейсов</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {cases.reduce((total, caseItem) => total + caseItem.items.length, 0)}
              </span>
              <span className="stat-label">Предметов</span>
            </div>
          </div>

          <div className="hero-actions">
            <a href="#cases" className="cta-button primary">
              Начать открывать
            </a>
          </div>
        </div>
      </section>

      {/* Cases Section */}
      <section id="cases" className="cases-section">
        <div className="section-header">
          <h2>Доступные кейсы</h2>
          <p>Выберите кейс и испытайте удачу</p>
        </div>

        {cases.length === 0 ? (
          <div className="no-cases">
            <div className="no-cases-icon">🎁</div>
            <h3>Кейсы не найдены</h3>
            <p>Попробуйте сбросить кейсы к значениям по умолчанию</p>
            <button onClick={handleResetCases} className="reset-btn">
              Сбросить кейсы
            </button>
          </div>
        ) : (
          <div className="cases-grid">
            {cases.map(caseItem => (
              <div key={caseItem.id} className="case-card">
                <div className="case-image-container">
                  <ImageWithFallback
                    src={caseItem.image}
                    alt={caseItem.name}
                    className="case-card-image"
                    fallback="/skins/fallback.jpg"
                  />
                </div>
                
                <div className="case-card-content">
                  <h3 className="case-card-title">{caseItem.name}</h3>
                  <div className="case-card-price">${caseItem.price}</div>
                  <div className="case-items-count">
                    {caseItem.items.length} предметов
                  </div>
                  
                  <Link to={`/case/${caseItem.id}`} className="open-case-link">
                    Открыть кейс
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;