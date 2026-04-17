import React from 'react';

export const MainMenu = ({ onSelectTrainer, onSelectNotes }) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Числовой полет</h1>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '50px' }}>
        <button 
          onClick={onSelectTrainer}
          style={{ padding: '20px 40px', fontSize: '20px', cursor: 'pointer', borderRadius: '12px', border: 'none', background: '#4CAF50', color: 'white' }}
        >
          Тренажер
        </button>
        <button 
          onClick={onSelectNotes}
          style={{ padding: '20px 40px', fontSize: '20px', cursor: 'pointer', borderRadius: '12px', border: 'none', background: '#2196F3', color: 'white' }}
        >
          Заметки
        </button>
      </div>
      <p style={{ marginTop: '50px', color: '#666' }}>Скажите: "тренажер" или "заметки"</p>
    </div>
  );
};