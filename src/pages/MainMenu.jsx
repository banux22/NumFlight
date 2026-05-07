import React from 'react';

export const MainMenu = ({ onSelectTrainer }) => {
  return (
    <div style={{ 
      minHeight: '90vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 10px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '48px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '10px'
        }}>
          🧠 Числовой полёт
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}>
          Развивайте навыки счета с голосовым ассистентом
        </p>
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: '30px', 
        justifyContent: 'center', 
        alignItems: 'stretch',
        flexWrap: 'wrap',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Блиц */}
        <div 
          onClick={() => onSelectTrainer('blitz')}
          style={{ 
            flex: '1 1 280px',
            minWidth: '240px',
            maxWidth: '320px',
            padding: '30px 20px',
            cursor: 'pointer',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>⚡</div>
          <h2 style={{ fontSize: '24px', marginBottom: '10px', color: 'white' }}>Блиц</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5', fontSize: '14px' }}>
            Быстрые примеры на сложение, вычитание и умножение
          </p>
        </div>
        
        {/* Цепочки */}
        <div 
          onClick={() => onSelectTrainer('chains')}
          style={{ 
            flex: '1 1 280px',
            minWidth: '240px',
            maxWidth: '320px',
            padding: '30px 20px',
            cursor: 'pointer',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔗</div>
          <h2 style={{ fontSize: '24px', marginBottom: '10px', color: 'white' }}>Цепочки</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5', fontSize: '14px' }}>
            Вычисляйте последовательно, шаг за шагом
          </p>
        </div>
        
        {/* Сравни числа */}
        <div 
          onClick={() => onSelectTrainer('compare')}
          style={{ 
            flex: '1 1 280px',
            minWidth: '240px',
            maxWidth: '320px',
            padding: '30px 20px',
            cursor: 'pointer',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>⚖️</div>
          <h2 style={{ fontSize: '24px', marginBottom: '10px', color: 'white' }}>Сравни числа</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5', fontSize: '14px' }}>
            Сравните сложные выражения со степенями, корнями и логарифмами
          </p>
        </div>
      </div>
      
      <div style={{ 
        marginTop: '40px', 
        padding: '12px 24px',
        background: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '50px',
        fontSize: '14px',
        color: '#ffd700',
        textAlign: 'center'
      }}>
        🎙️ Скажите голосом: "блиц", "цепочки" или "сравни числа"
      </div>
    </div>
  );
};