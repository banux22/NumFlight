import React from 'react';
import './_GameTemplate.css';

export class GameTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      currentQuestion: null,
      currentIndex: 0,
      totalQuestions: 5,
      feedback: '',
      score: { correct: 0, total: 0 },
      lastAnswer: null,
      showHint: false
    };
    
    this.assistant = props.assistant;
    this.gameEngine = props.gameEngine;
    
    this.startGame = this.startGame.bind(this);
    this.stopGame = this.stopGame.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.showHelp = this.showHelp.bind(this);
    this.endGame = this.endGame.bind(this);
    this.speak = this.speak.bind(this);
    this.parseNumber = this.parseNumber.bind(this);
    this.safeString = this.safeString.bind(this);
    this.keepListening = this.keepListening.bind(this);
  }

  safeString(value) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (typeof value === 'boolean') return String(value);
    if (typeof value === 'object') {
      if (value.text && typeof value.text === 'string') return value.text;
      if (value.value !== undefined) return String(value.value);
      if (value.answer !== undefined) return String(value.answer);
      try {
        return JSON.stringify(value);
      } catch(e) {
        return String(value);
      }
    }
    return String(value);
  }

  keepListening() {
    if (!this.assistant) return;
    
    try {
      const data = {
        action: {
          action_id: "repeat",
          parameters: {
            continue: true
          }
        }
      };
      
      this.assistant.sendData(data, (response) => {
        console.log('Keep listening command sent');
      });
    } catch (error) {
      console.error('Error keeping listening:', error);
    }
  }

  componentDidMount() {
    if (this.gameEngine && this.gameEngine.onMount) {
      this.gameEngine.onMount(this);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.gameEngine !== this.props.gameEngine) {
      this.gameEngine = this.props.gameEngine;
      this.setState({
        isActive: false,
        currentQuestion: null,
        currentIndex: 0,
        feedback: '',
        score: { correct: 0, total: 0 },
        lastAnswer: null,
        showHint: false
      });
    }
  }

  speak(text) {
    if (!this.assistant) return;
    
    const cleanText = this.safeString(text);
    
    try {
      const data = {
        action: {
          action_id: "voice_response",
          parameters: {
            text: cleanText
          }
        }
      };
      
      this.assistant.sendData(data, (response) => {
        console.log('Voice response sent:', cleanText);
        setTimeout(() => {
          this.keepListening();
        }, 500);
      });
    } catch (error) {
      console.error('Error sending voice response:', error);
    }
  }

  parseNumber(text) {
    if (!text) return NaN;
    
    const cleanText = this.safeString(text);
    const num = parseInt(cleanText, 10);
    return isNaN(num) ? NaN : num;
  }

  startGame() {
    if (!this.gameEngine) {
      const errorMsg = 'Ошибка: игра не загружена';
      this.setState({ feedback: errorMsg });
      this.speak(errorMsg);
      return;
    }
    
    const firstQuestion = this.gameEngine.generateQuestion();
    const startMsg = this.gameEngine.getStartMessage ? this.gameEngine.getStartMessage() : 'Скажите ответ голосом!';
    
    this.setState({
      isActive: true,
      currentQuestion: firstQuestion,
      currentIndex: 1,
      feedback: startMsg,
      score: { correct: 0, total: 0 },
      lastAnswer: null,
      showHint: false
    });
    
    this.speak(startMsg);
    
    setTimeout(() => {
      this.keepListening();
    }, 1000);
  }

  stopGame() {
    const stopMsg = this.gameEngine && this.gameEngine.getStopMessage ? 
      this.gameEngine.getStopMessage() : 'Игра завершена.';
    
    this.setState({
      isActive: false,
      currentQuestion: null,
      currentIndex: 0,
      feedback: this.safeString(stopMsg),
      showHint: false
    });
    
    this.speak(stopMsg);
  }
checkAnswer(userAnswer) {
  console.log('=== CHECK ANSWER ===');
  console.log('userAnswer:', userAnswer);
  
  if (!this.state.isActive) {
    console.log('Game not active, ignoring answer');
    return;
  }
  
  // Проверка на команду "дальше" для игр с allowNextCommand
  const answerStr = this.safeString(userAnswer).toLowerCase().trim();
  const isNextCommand = answerStr.includes('дальше') || 
                        answerStr.includes('продолжить') || 
                        answerStr === 'next';
  
  // Для пошаговых игр с поддержкой "дальше" на начальном шаге
  if (this.gameEngine.allowNextCommand && 
      this.state.currentQuestion && 
      this.state.currentQuestion.showInitial && 
      isNextCommand) {
    const nextQuestion = this.gameEngine.getNextStep(this.state.currentQuestion, userAnswer);
    this.setState({
      currentQuestion: nextQuestion,
      feedback: `Начальное число: ${this.state.currentQuestion.initialValue}`
    });
    
    setTimeout(() => {
      if (this.state.isActive && this.state.currentQuestion && 
          this.state.currentQuestion.steps && 
          this.state.currentQuestion.steps[0]) {
        this.speak(this.state.currentQuestion.steps[0].voiceText);
      }
    }, 500);
    return;
  }
  
  let isCorrect = false;
  let userResponse = '';
  
  // Для игры Сравни числа
  if (this.gameEngine.getName() === 'Сравни числа') {
    const answerStr = this.safeString(userAnswer).toLowerCase().trim();
    
    if (answerStr.includes('лево') || answerStr === 'left' || answerStr === 'левое') {
      userResponse = 'left';
      isCorrect = (this.state.currentQuestion.correctAnswer === 'left');
    } else if (answerStr.includes('прав') || answerStr === 'right' || answerStr === 'правое') {
      userResponse = 'right';
      isCorrect = (this.state.currentQuestion.correctAnswer === 'right');
    } else {
      this.setState({
        feedback: 'Скажите "левое" или "правое"'
      });
      this.speak('Скажите левое или правое');
      return;
    }
  } 
  // Для пошаговых игр (Цепочки)
  else if (this.gameEngine.stepByStepMode) {
    isCorrect = this.gameEngine.checkAnswer(userAnswer, this.state.currentQuestion);
    userResponse = userAnswer;
  }
  // Для обычных игр (Блиц и другие)
  else {
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
    else if (typeof userAnswer === 'object') {
      if (userAnswer.text) {
        userNumber = this.parseNumber(userAnswer.text);
      } else if (userAnswer.value !== undefined) {
        userNumber = this.parseNumber(String(userAnswer.value));
      } else if (userAnswer.answer !== undefined) {
        userNumber = this.parseNumber(String(userAnswer.answer));
      } else {
        userNumber = this.parseNumber(JSON.stringify(userAnswer));
      }
    }
    
    isCorrect = (userNumber === this.state.currentQuestion.answer);
    userResponse = userNumber;
  }
  
  // ВАЖНО: newScore объявляем ТОЛЬКО ЗДЕСЬ, после всех проверок
  const newScore = {
    correct: this.state.score.correct + (isCorrect ? 1 : 0),
    total: this.state.score.total + 1
  };
  
  let feedback;
  
  // Формируем feedback в зависимости от типа игры
  if (this.gameEngine.getName() === 'Сравни числа') {
    const leftValue = this.state.currentQuestion.left.value;
    const rightValue = this.state.currentQuestion.right.value;
    const leftText = this.state.currentQuestion.left.text;
    const rightText = this.state.currentQuestion.right.text;
    const sign = leftValue > rightValue ? '>' : (leftValue < rightValue ? '<' : '=');
    
    const formatValue = (val) => {
      if (Number.isInteger(val)) return val.toString();
      return val.toFixed(2).replace(/\.?0+$/, '');
    };
    
    const leftFormatted = formatValue(leftValue);
    const rightFormatted = formatValue(rightValue);
    
    if (isCorrect) {
      feedback = `Правильно! ${leftFormatted} ${sign} ${rightFormatted} (${leftText} ? ${rightText})`;
    } else {
      feedback = `Неправильно. ${leftFormatted} ${sign} ${rightFormatted} (${leftText} ? ${rightText})`;
    }
    
    const safeFeedback = this.safeString(feedback);
    this.speak(safeFeedback);
    
    if (this.state.currentIndex >= this.state.totalQuestions) {
      this.endGame(newScore);
      return;
    }
    
    const nextQuestion = this.gameEngine.generateQuestion();
    this.setState({
      currentQuestion: nextQuestion,
      currentIndex: this.state.currentIndex + 1,
      feedback: safeFeedback,
      score: newScore,
      lastAnswer: userResponse
    });
    return;
  }
  else if (this.gameEngine.stepByStepMode) {
    // Для пошаговых игр
    const hideStepFeedback = this.gameEngine.hideStepFeedback || false;
    const nextQuestion = this.gameEngine.getNextStep(this.state.currentQuestion, userAnswer);
    
    // Проверяем, завершена ли цепочка
    const isGameComplete = nextQuestion && 
                           nextQuestion.currentStepIndex >= nextQuestion.steps?.length && 
                           !nextQuestion.showInitial;
    
    // Формируем feedback только для финала или если не скрываем
    if (isGameComplete && !hideStepFeedback) {
      feedback = isCorrect ? 
        this.gameEngine.getCorrectMessage(this.state.currentQuestion) : 
        this.gameEngine.getWrongMessage(this.state.currentQuestion);
    } else if (!hideStepFeedback) {
      feedback = isCorrect ? 
        this.gameEngine.getCorrectMessage(this.state.currentQuestion) : 
        this.gameEngine.getWrongMessage(this.state.currentQuestion);
    } else {
      feedback = ''; // Пустое сообщение для скрытых шагов
    }
    
    // Озвучиваем только если есть что сказать
    if (feedback && !hideStepFeedback) {
      this.speak(feedback);
    }
    
    // Обновляем состояние
    this.setState({
      currentQuestion: nextQuestion,
      feedback: feedback || '✅',
      score: newScore,
      lastAnswer: userResponse
    });
    
    // Озвучиваем следующий шаг
    if (!isGameComplete && nextQuestion && nextQuestion.steps && 
        nextQuestion.currentStepIndex < nextQuestion.steps.length) {
      setTimeout(() => {
        if (this.state.isActive && this.state.currentQuestion) {
          const nextStepText = this.gameEngine.getQuestionText(this.state.currentQuestion);
          if (nextStepText && !hideStepFeedback) {
            this.speak(nextStepText);
          }
        }
      }, 500);
    }
    return;
  }
  else {
    // Обычные игры (Блиц)
    if (isCorrect) {
      feedback = `Правильно! ${this.state.currentQuestion.text} = ${this.state.currentQuestion.answer}`;
    } else {
      feedback = `Неправильно. ${this.state.currentQuestion.text} = ${this.state.currentQuestion.answer}`;
    }
    
    const safeFeedback = this.safeString(feedback);
    this.speak(safeFeedback);
    
    if (this.state.currentIndex >= this.state.totalQuestions) {
      this.endGame(newScore);
      return;
    }
    
    const nextQuestion = this.gameEngine.generateQuestion();
    this.setState({
      currentQuestion: nextQuestion,
      currentIndex: this.state.currentIndex + 1,
      feedback: safeFeedback,
      score: newScore,
      lastAnswer: userResponse
    });
    return;
  }
}
  endGame(score) {
    let endMsg;
    if (this.gameEngine && this.gameEngine.getEndMessage) {
      const result = this.gameEngine.getEndMessage(score);
      endMsg = this.safeString(result);
    } else {
      endMsg = `Игра окончена! Результат: ${score.correct} из ${score.total}`;
    }
    
    console.log('End game message:', endMsg);
    
    this.setState({
      isActive: false,
      currentQuestion: null,
      currentIndex: 0,
      feedback: endMsg,
      lastAnswer: null,
      showHint: false
    });
    
    this.speak(endMsg);
  }

  showHelp() {
    this.setState({ showHint: true });
    let hintMsg;
    
    if (this.gameEngine && this.gameEngine.getHint) {
      hintMsg = this.gameEngine.getHint(this.state.currentQuestion);
    } else {
      hintMsg = 'Скажите ответ голосом!';
    }
    
    this.speak(this.safeString(hintMsg));
    
    setTimeout(() => {
      if (this.state.showHint) {
        this.setState({ showHint: false });
      }
    }, 8000);
  }

  render() {
    const { onBack, gameName, gameIcon, onSelectAnotherGame } = this.props;
    const { isActive, currentQuestion, currentIndex, totalQuestions, 
            feedback, score, showHint } = this.state;
    
    const feedbackText = this.safeString(feedback);
    
    let questionText = '?';
    if (currentQuestion && this.gameEngine && typeof this.gameEngine.renderQuestion === 'function') {
      questionText = this.safeString(this.gameEngine.renderQuestion(currentQuestion));
    }
    
    return (
      <div className="game-template-container">
        <div className="game-template-top-bar">
          <button onClick={onBack} className="game-template-back-btn">
            ← На главную
          </button>
          <h2 className="game-template-title">
            {gameIcon} {gameName}
          </h2>
          <button onClick={this.showHelp} className="game-template-help-btn">
            ❓ Подсказка
          </button>
        </div>
        
        {/* Счётчик - показываем только если игра не скрывает его */}
        {isActive && !this.gameEngine.hideScore && (
          <div className="game-template-progress">
            <span>📊 Вопрос {currentIndex} из {totalQuestions}</span>
            <span className="game-template-score-badge">
              ✅ {score.correct} / {score.total}
            </span>
          </div>
        )}
        
        <div className="game-template-card">
          {!isActive ? (
            <div className="game-template-start-screen">
              <p className="game-template-description">
                {this.gameEngine && this.gameEngine.getDescription ? this.safeString(this.gameEngine.getDescription()) : 'Описание игры'}
              </p>
              <button onClick={this.startGame} className="game-template-start-btn">
                🎮 Начать игру
              </button>
              {onSelectAnotherGame && (
                <button onClick={onSelectAnotherGame} className="game-template-another-game-btn">
                  🎲 Выбрать другую игру
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="game-template-question-card">
                {questionText}
              </div>
              
              <button onClick={this.stopGame} className="game-template-stop-btn">
                ⏹️ Завершить игру
              </button>
            </>
          )}
        </div>
        
        {this.state.lastAnswer && !isActive && (
          <div className="game-template-last-answer">
            📝 Последний ответ: {this.state.lastAnswer}
          </div>
        )}
        
        <div className="game-template-feedback-area">
          {showHint ? (
            <div className="game-template-hint-box">
              💡 {this.gameEngine && this.gameEngine.getHint ? 
                  this.safeString(this.gameEngine.getHint(this.state.currentQuestion)) : 
                  'Скажите ответ голосом!'}
            </div>
          ) : (
            <div className="game-template-feedback-box">
              {feedbackText || (this.gameEngine && this.gameEngine.getWelcomeMessage ? 
                this.safeString(this.gameEngine.getWelcomeMessage()) : 'Выберите игру')}
            </div>
          )}
        </div>
        
        <div className="game-template-voice-hint">
          🎙️ Скажите голосом: {this.gameEngine && this.gameEngine.getVoiceCommandHint ? 
            this.safeString(this.gameEngine.getVoiceCommandHint()) : 'число'}
        </div>
      </div>
    );
  }
}