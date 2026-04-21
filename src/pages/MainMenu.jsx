import React from 'react';

export const MainMenu = ({ onSelectTrainer }) => {
  return (
    <div className="container">
      <div className="header">
        <h1>🧠 Числовой полёт</h1>
        <p>Развивайте навыки счета, память и логику с голосовым ассистентом</p>
      </div>
      
      <div className="cards-grid">
        <div className="card" onClick={() => onSelectTrainer('blitz')}>
          <div className="card-icon">⚡</div>
          <h2>Блиц</h2>
          <p>Быстрые примеры на сложение, вычитание и умножение</p>
        </div>
        
        <div className="card" onClick={() => onSelectTrainer('chains')}>
          <div className="card-icon">🔗</div>
          <h2>Цепочки</h2>
          <p>Вычисляйте последовательно, шаг за шагом</p>
        </div>
        
        <div className="card" onClick={() => onSelectTrainer('compare')}>
          <div className="card-icon">⚖️</div>
          <h2>Сравни числа</h2>
          <p>Сравните сложные выражения со степенями, корнями и логарифмами</p>
        </div>
      </div>
      
      <div className="voice-hint">
        🎙️ Скажите: "блиц", "цепочки" или "сравни числа"
      </div>
    </div>
  );
};