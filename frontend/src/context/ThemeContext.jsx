// src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('isDark');
    if (saved !== null) {
      setIsDark(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    document.body.className = isDark ? 'dark-theme' : 'light-theme';
    localStorage.setItem('isDark', JSON.stringify(isDark));
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
