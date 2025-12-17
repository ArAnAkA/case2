// src/pages/Home.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { caseAPI } from '../services/api';
import ImageWithFallback from '../components/ImageWithFallback';
import './Home.css';
import { ThemeContext } from '../context/ThemeContext';
import { useBalance } from '../context/BalanceContext';

const Home = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { balance } = useBalance();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      console.log('🔄 Home: Загружаю кейсы... (Попытка', retryCount + 1, ')');
      const response = await caseAPI.getCases();
      console.log('✅ Home: Кейсы получены:', response.data);

      if (Array.isArray(response.data) && response.data.length > 0) {
        setCases(response.data);
      } else {
        console.log('⚠️ Home: Нет кейсов, сбрасываем...');
        const resetResponse = await caseAPI.resetToDefault();
        setCases(resetResponse.data);
      }
    } catch (err) {
      console.error('❌ Home: Ошибка загрузки:', err);
      setError(
        `Не удалось загрузить кейсы. Проверьте подключение. (${retryCount + 1}/3)`
      );

      if (retryCount < 2) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          loadCases();
        }, 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetCases = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await caseAPI.resetToDefault();
      setCases(response.data);
      setRetryCount(0);
    } catch (err) {
      console.error('❌ Home: Ошибка сброса:', err);
      setError('Не удалось сбросить кейсы. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="home-page" role="main" aria-label="Главная страница CS2 Case Battle">
        <section className="hero-section loading">
          <div className="hero-content">
            <h1 className="hero-title">CS2 CASE BATTLE</h1>
            <p className="hero-description">Готовим кейсы...</p>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="home-page" role="main" aria-label="Главная страница">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Переключатель темы и баланс */}
        <div className="header-controls">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <div className="balance-display">
            Баланс: <span>${balance.toFixed(2)}</span>
          </div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">CS2 CASE BATTLE</h1>
          <p className="hero-description">
            Открывай кейсы и выигрывай редкие скины!
          </p>

          {error && (
            <div className="error-message" role="alert">
              <p>{error}</p>
              <button onClick={loadCases} className="retry-btn" aria-label="Повторить загрузку">
                🔄 Повторить
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
                {cases.reduce((total, c) => total + c.items.length, 0)}
              </span>
              <span className="stat-label">Предметов</span>
            </div>
          </div>

          <div className="hero-actions">
            <a href="#cases" className="cta-button primary" aria-label="Перейти к кейсам">
              Начать открывать
            </a>
            <button
              onClick={handleResetCases}
              className="cta-button secondary"
              aria-label="Сбросить кейсы"
            >
              🔄 Сбросить
            </button>
          </div>
        </div>
      </section>

      {/* Cases Section */}
      <section id="cases" className="cases-section">
        <div className="section-header">
          <h2>Доступные кейсы</h2>
          <p>Выберите кейс и испытайте удачу</p>
          <div className="cases-counter">
            Найдено кейсов: <strong>{cases.length}</strong>
          </div>
        </div>

        {cases.length === 0 ? (
          <div className="no-cases" tabIndex="0">
            <div className="no-cases-icon" aria-label="Подарок">
              🎁
            </div>
            <h3>Кейсы не найдены</h3>
            <p>Попробуйте сбросить данные к начальным.</p>
            <button onClick={handleResetCases} className="reset-btn">
              Сбросить кейсы
            </button>
          </div>
        ) : (
          <div className="cases-grid" aria-label="Сетка кейсов">
            {cases.map(caseItem => (
              <Link
                to={`/case/${caseItem.id}`}
                key={caseItem.id}
                className="case-card"
                tabIndex="0"
                aria-label={`Открыть кейс ${caseItem.name}`}
              >
                <div className="case-card-header">
                  <h3 className="case-card-title">{caseItem.name}</h3>
                </div>

                <div className="glow-effect">
                  <div className="case-image-container">
                    <ImageWithFallback
                      src={caseItem.image}
                      alt={`Кейс: ${caseItem.name}`}
                      className="case-card-image"
                      fallback="/skins/fallback.jpg"
                    />
                  </div>
                </div>

                <div className="case-card-footer">
                  <div className="case-card-price">${caseItem.price.toFixed(2)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;