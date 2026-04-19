import React from 'react';

export const MainMenu = ({ onSelectTrainer, onSelectMemory, onSelectLogic }) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Числовой полет</h1>
      <p style={{ color: '#aaa', marginBottom: '50px' }}>Развивайте навыки счета, память и логику</p>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          onClick={onSelectTrainer}
          style={{ 
            padding: '20px 40px', 
            fontSize: '20px', 
            cursor: 'pointer', 
            borderRadius: '16px', 
            border: 'none', 
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            minWidth: '200px'
          }}
        >
          Устный счет
        </button>
        
        <button 
          onClick={onSelectMemory}
          style={{ 
            padding: '20px 40px', 
            fontSize: '20px', 
            cursor: 'pointer', 
            borderRadius: '16px', 
            border: 'none', 
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            color: 'white',
            minWidth: '200px'
          }}
        >
          Память
        </button>
        
        <button 
          onClick={onSelectLogic}
          style={{ 
            padding: '20px 40px', 
            fontSize: '20px', 
            cursor: 'pointer', 
            borderRadius: '16px', 
            border: 'none', 
            background: 'linear-gradient(135deg, #f44336, #e53935)',
            color: 'white',
            minWidth: '200px'
          }}
        >
          Логика
        </button>
      </div>
      
      <div style={{ 
        marginTop: '60px', 
        padding: '20px', 
        background: 'rgba(255,255,255,0.05)', 
        borderRadius: '16px',
        maxWidth: '500px',
        margin: '60px auto 0'
      }}>
      </div>
    </div>
  );
};