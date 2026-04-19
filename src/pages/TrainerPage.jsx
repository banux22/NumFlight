import React from 'react';

export class TrainerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      currentGame: null, // выбранная игра: 'blitz', 'chain', 'compare'
      currentQuestion: null,
      feedback: '',
      score: { correct: 0, total: 0 },
      lastAnswer: null
    };
    
    this.assistant = props.assistant;
    
    this.startTraining = this.startTraining.bind(this);
    this.stopTraining = this.stopTraining.bind(this);
    this.showHelp = this.showHelp.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.generateQuestion = this.generateQuestion.bind(this);
    this.selectGame = this.selectGame.bind(this);
  }

  // Метод для выбора игры
  selectGame(gameType) {
    const gameNames = {
      'blitz': 'Блиц',
      'chain': 'Цепочки',
      'compare': 'Сравни числа'
    };
    this.setState({
      currentGame: gameType,
      isActive: false,
      currentQuestion: null,
      feedback: `Выбрана игра: ${gameNames[gameType]}. Скажите "начать тренировку"`,
      score: { correct: 0, total: 0 },
      lastAnswer: null
    });
  }

  selectAnotherGame() {
    this.setState({
      currentGame: null,
      isActive: false,
      currentQuestion: null,
      feedback: 'Выберите игру: "блиц", "цепочки" или "сравни числа"',
      score: { correct: 0, total: 0 },
      lastAnswer: null
    });
  }

  generateQuestion() {
    // Пока оставляем ту же логику, что и была
    const operations = ['+', '-', '*'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    
    let a, b, answer;
    switch (op) {
      case '+':
        a = Math.floor(Math.random() * 50) + 1;
        b = Math.floor(Math.random() * 50) + 1;
        answer = a + b;
        break;
      case '-':
        a = Math.floor(Math.random() * 50) + 1;
        b = Math.floor(Math.random() * a) + 1;
        answer = a - b;
        break;
      case '*':
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        answer = a * b;
        break;
      default:
        a = 1; b = 1; answer = 2;
    }
    
    return { text: `${a} ${op} ${b}`, answer: answer };
  }

  startTraining() {
    if (!this.state.currentGame) {
      this.setState({
        feedback: 'Сначала выберите игру: "блиц", "цепочки" или "сравни числа"'
      });
      return;
    }
    
    const question = this.generateQuestion();
    this.setState({
      isActive: true,
      currentQuestion: question,
      feedback: 'Скажите ответ голосом!',
      score: { correct: 0, total: 0 },
      lastAnswer: null
    });
  }

  stopTraining() {
    this.setState({
      isActive: false,
      currentQuestion: null,
      feedback: 'Тренировка завершена',
      lastAnswer: null
    });
  }

  showHelp() {
    this.setState({
      feedback: 'Сначала выберите игру: "блиц", "цепочки" или "сравни числа". Затем скажите "начать тренировку" и называйте ответ голосом. Например: "двадцать пять" или "ответ сорок два"'
    });
    setTimeout(() => {
      if (!this.state.isActive && this.state.currentGame) {
        this.setState({ feedback: 'Скажите "начать тренировку"' });
      } else if (!this.state.currentGame) {
        this.setState({ feedback: 'Скажите название игры: "блиц", "цепочки" или "сравни числа"' });
      }
    }, 5000);
  }

  checkAnswer(userAnswer) {
    if (!this.state.isActive) {
      return;
    }
    
    let userNumber = null;
    
    if (Array.isArray(userAnswer)) {
      if (userAnswer.length > 0 && userAnswer[0] && userAnswer[0].text) {
        userNumber = this.parseNumber(userAnswer[0].text);
      }
    }
    else if (typeof userAnswer === 'string') {
      userNumber = this.parseNumber(userAnswer);
    }
    else if (typeof userAnswer === 'number') {
      userNumber = userAnswer;
    }
    
    const isCorrect = (userNumber === this.state.currentQuestion.answer);
    
    const newScore = {
      correct: this.state.score.correct + (isCorrect ? 1 : 0),
      total: this.state.score.total + 1
    };
    
    let feedback;
    if (isCorrect) {
      feedback = `Правильно! ${this.state.currentQuestion.text} = ${this.state.currentQuestion.answer}`;
    } else {
      feedback = `Неправильно. ${this.state.currentQuestion.text} = ${this.state.currentQuestion.answer}`;
    }
    
    const nextQuestion = this.generateQuestion();
    
    this.setState({
      currentQuestion: nextQuestion,
      feedback: feedback,
      score: newScore,
      lastAnswer: userNumber
    });
  }

  parseNumber(text) {
    if (!text) return NaN;
    
    const numbers = {
      'один': 1, 'одна': 1, 'одно': 1,
      'два': 2, 'две': 2,
      'три': 3, 'четыре': 4, 'пять': 5,
      'шесть': 6, 'семь': 7, 'восемь': 8,
      'девять': 9, 'десять': 10,
      'одиннадцать': 11, 'двенадцать': 12, 'тринадцать': 13,
      'четырнадцать': 14, 'пятнадцать': 15, 'шестнадцать': 16,
      'семнадцать': 17, 'восемнадцать': 18, 'девятнадцать': 19,
      'двадцать': 20, 'тридцать': 30, 'сорок': 40,
      'пятьдесят': 50, 'шестьдесят': 60, 'семьдесят': 70,
      'восемьдесят': 80, 'девяносто': 90, 'сто': 100
    };
    
    const lowerText = text.toLowerCase().trim();
    
    if (numbers[lowerText]) return numbers[lowerText];
    
    const parts = lowerText.split(/\s+/);
    if (parts.length === 2) {
      const tens = numbers[parts[0]];
      const ones = numbers[parts[1]];
      if (tens && ones) return tens + ones;
    }
    
    const num = parseInt(text, 10);
    return isNaN(num) ? NaN : num;
  }

  render() {
    const { onBack } = this.props;
    const { isActive, currentGame, currentQuestion, feedback, score } = this.state;
    
    let questionText = '?';
    if (currentQuestion && typeof currentQuestion === 'object') {
      questionText = currentQuestion.text || '?';
    }
    questionText = String(questionText);
    
    let feedbackText = '';
    if (typeof feedback === 'string') {
      feedbackText = feedback;
    } else if (feedback) {
      feedbackText = String(feedback);
    }
    
    const correctCount = typeof score.correct === 'number' ? score.correct : 0;
    const totalCount = typeof score.total === 'number' ? score.total : 0;
    
    const gameNames = {
      'blitz': 'Блиц',
      'chain': 'Цепочки',
      'compare': 'Сравни числа'
    };
    console.log('Current game in state:', this.state.currentGame);
    console.log('Is active:', this.state.isActive);
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
        <button 
          onClick={onBack}
          style={{ 
            padding: '8px 16px', 
            background: '#888', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            marginBottom: '20px' 
          }}
        >
          ← На главную
        </button>
        
        <h1>Тренажёр устного счёта</h1>
        
        {/* Выбор игры */}
        {!isActive && !currentGame && (
          <div style={{ marginTop: '30px' }}>
            <h3>Выберите игру:</h3>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
              <button
                onClick={() => this.selectGame('blitz')}
                style={{
                  padding: '15px 30px',
                  fontSize: '18px',
                  background: '#FF9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                Блиц
              </button>
              <button
                onClick={() => this.selectGame('chain')}
                style={{
                  padding: '15px 30px',
                  fontSize: '18px',
                  background: '#9C27B0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                Цепочки
              </button>
              <button
                onClick={() => this.selectGame('compare')}
                style={{
                  padding: '15px 30px',
                  fontSize: '18px',
                  background: '#00BCD4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                Сравни числа
              </button>
            </div>
            <p style={{ marginTop: '20px', color: 'rgba(255,255,255,0.7)' }}>
              Или скажите голосом: "блиц", "цепочки" или "сравни числа"
            </p>
          </div>
        )}
        
        {/* Показываем выбранную игру, если активна */}
        {!isActive && currentGame && !currentQuestion && (
          <div style={{ marginTop: '30px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '400px',
              margin: '20px auto'
            }}>
              <h3>Выбрана игра: {gameNames[currentGame]}</h3>
              <button
                onClick={this.startTraining}
                style={{
                  marginTop: '20px',
                  padding: '12px 24px',
                  fontSize: '18px',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                Начать тренировку
              </button>
              <button
                onClick={() => this.setState({ currentGame: null, feedback: '' })}
                style={{
                  marginTop: '20px',
                  marginLeft: '10px',
                  padding: '12px 24px',
                  fontSize: '18px',
                  background: '#888',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                Выбрать другую игру
              </button>
            </div>
          </div>
        )}
        
        {!isActive && !currentGame && feedbackText && feedbackText.length > 0 && (
          <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
            {feedbackText}
          </div>
        )}
        
        {isActive && (
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '30px',
            padding: '40px',
            maxWidth: '500px',
            margin: '20px auto',
            color: 'white'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>
              Игра: {gameNames[currentGame]}
            </div>
            
            <div style={{ fontSize: '48px', fontWeight: 'bold', margin: '20px 0' }}>
              {questionText} = ?
            </div>
            
            <div style={{ fontSize: '20px', margin: '20px 0' }}>
              Счёт: {correctCount} / {totalCount}
            </div>
            
            {feedbackText && feedbackText.length > 0 && (
              <div style={{ 
                background: 'rgba(255,255,255,0.2)', 
                borderRadius: '15px', 
                padding: '15px',
                marginTop: '20px'
              }}>
                {feedbackText}
              </div>
            )}
            
            <button
              onClick={this.stopTraining}
              style={{
                marginTop: '30px',
                padding: '10px 20px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Завершить тренировку
            </button>
            
            <p style={{ marginTop: '30px', fontSize: '14px', opacity: 0.8 }}>
              Скажите ответ голосом, например: "двадцать пять"
            </p>
          </div>
        )}
        
        <div style={{ 
          marginTop: '40px', 
          padding: '20px', 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '16px',
          maxWidth: '400px',
          margin: '40px auto 0'
        }}>
          <h3>Голосовые команды</h3>
          <p>"блиц" — выбрать игру Блиц</p>
          <p>"цепочки" — выбрать игру Цепочки</p>
          <p>"сравни числа" — выбрать игру Сравни числа</p>
          <p>"начать тренировку" — запустить</p>
          <p>"25" или "ответ 42" — назвать ответ</p>
          <p>"завершить тренировку" — остановить</p>
          <p>"заметки" — перейти к списку задач</p>
          <p>"помощь" — подсказка</p>
        </div>
      </div>
    );
  }
}