import React from 'react';

export const TrainerPage = ({ onBack }) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <button 
        onClick={onBack}
        style={{ padding: '8px 16px', background: '#888', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px' }}
      >
        На главную
      </button>
      <h1>Тренажер устного счета</h1>
      <p>Скажите: "начать тренировку"</p>
      <div style={{ marginTop: '30px', padding: '20px', background: '#f0f0f0', borderRadius: '12px', maxWidth: '400px', margin: '30px auto' }}>
        <p>Голосовые команды:</p>
        <p>"начать тренировку"</p>
        <p>"помощь"</p>
        <p>"заметки" - вернуться к заметкам</p>
      </div>
    </div>
  );
};