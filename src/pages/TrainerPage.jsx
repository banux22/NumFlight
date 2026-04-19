import React from 'react';

export class TrainerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      currentGame: null,
      currentQuestion: null,
      feedback: '',
      score: { correct: 0, total: 0 },
      lastAnswer: null,
      chainSteps: []
    };
    
    this.assistant = props.assistant;
    
    this.startTraining = this.startTraining.bind(this);
    this.stopTraining = this.stopTraining.bind(this);
    this.showHelp = this.showHelp.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.generateQuestion = this.generateQuestion.bind(this);
    this.generateChain = this.generateChain.bind(this);
    this.generateCompare = this.generateCompare.bind(this);
    this.selectGame = this.selectGame.bind(this);
    this.selectAnotherGame = this.selectAnotherGame.bind(this);
  }

  selectGame(gameType) {
    const gameNames = {
      'blitz': 'Блиц',
      'chains': 'Цепочки',
      'chain': 'Цепочки',
      'compare': 'Сравни числа'
    };
    
    let normalized = gameType;
    if (gameType === 'chain') {
        normalized = 'chains';
    }
    
    const displayName = gameNames[gameType] || gameNames[normalized] || 'Неизвестная игра';
    
    this.setState({
      currentGame: normalized,
      isActive: false,
      currentQuestion: null,
      feedback: `Выбрана игра: ${displayName}. Скажите "начать тренировку"`,
      score: { correct: 0, total: 0 },
      lastAnswer: null,
      chainSteps: []
    });
  }

  selectAnotherGame() {
    this.setState({
      currentGame: null,
      isActive: false,
      currentQuestion: null,
      feedback: 'Выберите игру: "блиц", "цепочки" или "сравни числа"',
      score: { correct: 0, total: 0 },
      lastAnswer: null,
      chainSteps: []
    });
  }

  generateChain() {
    const steps = [];
    const stepCount = Math.floor(Math.random() * 3) + 3;
    let currentValue = Math.floor(Math.random() * 20) + 1;
    const operations = ['+', '-', '*', '/'];
    
    let lastOpWasMultiply = false;
    let multiplyCount = 0;
    
    for (let i = 0; i < stepCount; i++) {
      let availableOps = [...operations];
      if (lastOpWasMultiply && multiplyCount >= 1) {
        availableOps = operations.filter(op => op !== '*');
      }
      
      const op = availableOps[Math.floor(Math.random() * availableOps.length)];
      let b;
      
      switch (op) {
        case '+':
          b = Math.floor(Math.random() * 20) + 1;
          steps.push({ text: `${currentValue} + ${b}`, result: currentValue + b, operation: '+', operand: b });
          currentValue = currentValue + b;
          lastOpWasMultiply = false;
          multiplyCount = 0;
          break;
        case '-':
          b = Math.floor(Math.random() * currentValue) + 1;
          steps.push({ text: `${currentValue} - ${b}`, result: currentValue - b, operation: '-', operand: b });
          currentValue = currentValue - b;
          lastOpWasMultiply = false;
          multiplyCount = 0;
          break;
        case '*':
          b = Math.floor(Math.random() * 9) + 2;
          steps.push({ text: `${currentValue} × ${b}`, result: currentValue * b, operation: '×', operand: b });
          currentValue = currentValue * b;
          lastOpWasMultiply = true;
          multiplyCount++;
          break;
        case '/':
          const divisors = [];
          for (let d = 2; d <= Math.sqrt(currentValue); d++) {
            if (currentValue % d === 0) divisors.push(d);
          }
          if (divisors.length > 0 && currentValue > 1) {
            b = divisors[Math.floor(Math.random() * divisors.length)];
            steps.push({ text: `${currentValue} ÷ ${b}`, result: currentValue / b, operation: '÷', operand: b });
            currentValue = currentValue / b;
          } else {
            b = Math.floor(Math.random() * 20) + 1;
            steps.push({ text: `${currentValue} + ${b}`, result: currentValue + b, operation: '+', operand: b });
            currentValue = currentValue + b;
          }
          lastOpWasMultiply = false;
          multiplyCount = 0;
          break;
      }
    }
    
    let fullChain = '';
    for (let i = 0; i < steps.length; i++) {
      if (i === 0) {
        fullChain = steps[i].text;
      } else {
        const step = steps[i];
        fullChain = fullChain + ' ' + step.operation + ' ' + step.operand;
      }
    }
    
    return {
      steps: steps,
      fullChain: fullChain,
      spokenText: fullChain,
      answer: currentValue
    };
  }

  generateCompare() {
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    const expressionTypes = [
      'square',
      'sqrt',
      'fraction',
      'power',
      'multiplication',
      'sum',
      'logarithm',
      'different_root',
      'square_sum',
      'square_diff'
    ];
    
    const generateExpression = () => {
      const type = expressionTypes[Math.floor(Math.random() * expressionTypes.length)];
      let value, text;
      
      switch(type) {
        case 'square':
          const numForSquare = getRandomInt(2, 12);
          value = numForSquare * numForSquare;
          text = `${numForSquare}²`;
          break;
        
        case 'sqrt':
          const sqrtValues = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144];
          const sqrtNum = sqrtValues[Math.floor(Math.random() * sqrtValues.length)];
          value = Math.sqrt(sqrtNum);
          text = `√${sqrtNum}`;
          break;
        
        case 'fraction':
          const numerator = getRandomInt(1, 8);
          const denominator = getRandomInt(numerator + 1, 10);
          value = numerator / denominator;
          text = `${numerator}/${denominator}`;
          break;
        
        case 'power':
          const base = getRandomInt(2, 5);
          const exp = getRandomInt(2, 4);
          value = Math.pow(base, exp);
          const expSymbol = exp === 2 ? '²' : exp === 3 ? '³' : exp === 4 ? '⁴' : `^${exp}`;
          text = `${base}${expSymbol}`;
          break;
        
        case 'multiplication':
          const a = getRandomInt(6, 15);
          const b = getRandomInt(6, 15);
          value = a * b;
          text = `${a}×${b}`;
          break;
        
        case 'sum':
          const c = getRandomInt(10, 30);
          const d = getRandomInt(10, 30);
          value = c + d;
          text = `${c}+${d}`;
          break;
        
        case 'logarithm':
          const logOptions = [
            { base: 2, arg: 8, value: 3, text: 'log₂8' },
            { base: 2, arg: 16, value: 4, text: 'log₂16' },
            { base: 2, arg: 32, value: 5, text: 'log₂32' },
            { base: 3, arg: 9, value: 2, text: 'log₃9' },
            { base: 3, arg: 27, value: 3, text: 'log₃27' },
            { base: 4, arg: 16, value: 2, text: 'log₄16' },
            { base: 5, arg: 25, value: 2, text: 'log₅25' },
            { base: 10, arg: 100, value: 2, text: 'lg100' },
            { base: 10, arg: 1000, value: 3, text: 'lg1000' }
          ];
          const log = logOptions[Math.floor(Math.random() * logOptions.length)];
          value = log.value;
          text = log.text;
          break;
        
        case 'different_root':
          const rootOptions = [
            { degree: 2, num: 16, value: 4, text: '√16' },
            { degree: 2, num: 25, value: 5, text: '√25' },
            { degree: 2, num: 36, value: 6, text: '√36' },
            { degree: 2, num: 49, value: 7, text: '√49' },
            { degree: 2, num: 64, value: 8, text: '√64' },
            { degree: 2, num: 81, value: 9, text: '√81' },
            { degree: 3, num: 8, value: 2, text: '∛8' },
            { degree: 3, num: 27, value: 3, text: '∛27' },
            { degree: 3, num: 64, value: 4, text: '∛64' },
            { degree: 3, num: 125, value: 5, text: '∛125' },
            { degree: 4, num: 16, value: 2, text: '⁴√16' },
            { degree: 4, num: 81, value: 3, text: '⁴√81' }
          ];
          const root = rootOptions[Math.floor(Math.random() * rootOptions.length)];
          value = root.value;
          text = root.text;
          break;
        
        case 'square_sum':
          const sumA = getRandomInt(2, 8);
          const sumB = getRandomInt(2, 8);
          value = Math.pow(sumA + sumB, 2);
          text = `(${sumA}+${sumB})²`;
          break;
        
        case 'square_diff':
          const diffA = getRandomInt(5, 12);
          const diffB = getRandomInt(2, diffA - 1);
          value = Math.pow(diffA - diffB, 2);
          text = `(${diffA}-${diffB})²`;
          break;
        
        default:
          value = 10;
          text = '10';
      }
      
      return { value, text };
    };
    
    let left = generateExpression();
    let right = generateExpression();
    
    let attempts = 0;
    while (Math.abs(left.value - right.value) < 0.01 && attempts < 5) {
      if (Math.random() > 0.5) {
        left = generateExpression();
      } else {
        right = generateExpression();
      }
      attempts++;
    }
    
    if (Math.abs(left.value - right.value) < 0.01) {
      right.value = right.value + 1;
      right.text = `${right.text}+1`;
    }
    
    let correctAnswer = '';
    let comparisonSymbol = '';
    
    if (left.value > right.value) {
      correctAnswer = 'left';
      comparisonSymbol = '>';
    } else {
      correctAnswer = 'right';
      comparisonSymbol = '<';
    }
    
    return {
      left: left,
      right: right,
      correctAnswer: correctAnswer,
      comparisonSymbol: comparisonSymbol,
      answer: correctAnswer,
      text: `${left.text} ? ${right.text}`
    };
  }

  generateQuestion() {
    const { currentGame } = this.state;
    
    if (currentGame === 'chains') {
      return this.generateChain();
    }
    
    if (currentGame === 'compare') {
      return this.generateCompare();
    }
    
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
    
    return { 
      text: `${a} ${op} ${b}`, 
      answer: answer,
      fullChain: `${a} ${op} ${b}`
    };
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
      feedback: this.state.currentGame === 'chains' 
        ? '!!!действия выполняются последовательно, без учёта приоритета операций!!!' 
        : this.state.currentGame === 'compare'
        ? '!!!Сравните выражения и скажите "левое" или "правое"!!!'
        : 'Скажите ответ голосом!',
      score: { correct: 0, total: 0 },
      lastAnswer: null
    });
    
    if (this.state.currentGame === 'chains') {
      setTimeout(() => {
        if (this.state.isActive) {
          this.setState({ feedback: 'Вычисляйте последовательно и называйте ответ!' });
        }
      }, 5000);
    }
    
    if (this.state.currentGame === 'compare') {
      setTimeout(() => {
        if (this.state.isActive) {
          this.setState({ feedback: 'Какое выражение больше? Скажите "левое" или "правое"' });
        }
      }, 5000);
    }
  }

  stopTraining() {
    this.setState({
      isActive: false,
      currentGame: null,
      currentQuestion: null,
      feedback: 'Тренировка завершена. Выберите игру для новой тренировки.',
      lastAnswer: null,
      score: { correct: 0, total: 0 },
      chainSteps: []
    });
  }

  showHelp() {
    const { currentGame, isActive } = this.state;
    
    if (!currentGame && !isActive) {
      this.setState({
        feedback: 'Скажите название игры: "блиц", "цепочки" или "сравни числа"'
      });
    } else if (currentGame === 'chains' && !isActive) {
      this.setState({
        feedback: 'В игре "Цепочки" вам нужно выполнять действия ПОСЛЕДОВАТЕЛЬНО. Скажите "начать тренировку"'
      });
    } else if (currentGame === 'compare' && !isActive) {
      this.setState({
        feedback: 'В игре "Сравни числа" нужно определить, какое выражение больше: левое или правое. Здесь есть степени, корни, логарифмы и скобки. Скажите "начать тренировку"'
      });
    } else if (currentGame === 'compare' && isActive) {
      this.setState({
        feedback: 'Сравните значения выражений. Скажите "левое" если левое больше, или "правое" если правое больше'
      });
    } else if (currentGame && !isActive) {
      this.setState({
        feedback: 'Скажите "начать тренировку" чтобы начать игру'
      });
    } else if (isActive) {
      this.setState({
        feedback: 'Скажите ответ голосом!'
      });
    }
    
    setTimeout(() => {
      if (this.state.isActive && this.state.currentGame === 'compare') {
        this.setState({ feedback: 'Какое выражение больше? Левое или правое?' });
      } else if (this.state.isActive && this.state.currentGame === 'chains') {
        this.setState({ feedback: 'Вычисляйте последовательно!' });
      } else if (this.state.isActive) {
        this.setState({ feedback: 'Скажите ответ голосом!' });
      } else if (this.state.currentGame && !this.state.isActive) {
        this.setState({ feedback: 'Скажите "начать тренировку"' });
      }
    }, 8000);
  }

  checkAnswer(userAnswer) {
    if (!this.state.isActive) {
      return;
    }
    
    let isCorrect = false;
    let userResponse = '';
    
    if (this.state.currentGame === 'compare') {
      const answerStr = String(userAnswer).toLowerCase().trim();
      
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
        return;
      }
    } 

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
      
      isCorrect = (userNumber === this.state.currentQuestion.answer);
    }
    
    const newScore = {
      correct: this.state.score.correct + (isCorrect ? 1 : 0),
      total: this.state.score.total + 1
    };
    
    let feedback;
    
    if (this.state.currentGame === 'chains') {
      if (isCorrect) {
        feedback = `Правильно! Ответ: ${this.state.currentQuestion.answer}`;
      } else {
        feedback = `Неправильно. Правильный ответ: ${this.state.currentQuestion.answer}`;
      }
    } 
    else if (this.state.currentGame === 'compare') {
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
    } 
    else {
      if (isCorrect) {
        feedback = `Правильно! ${this.state.currentQuestion.text} = ${this.state.currentQuestion.answer}`;
      } else {
        feedback = `Неправильно. ${this.state.currentQuestion.text} = ${this.state.currentQuestion.answer}`;
      }
    }
    
    const nextQuestion = this.generateQuestion();
    
    this.setState({
      currentQuestion: nextQuestion,
      feedback: feedback,
      score: newScore,
      lastAnswer: userResponse || null
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
      'восемьдесят': 80, 'девяносто': 90, 'сто': 100,
      'двести': 200, 'триста': 300, 'четыреста': 400, 'пятьсот': 500,
      'шестьсот': 600, 'семьсот': 700, 'восемьсот': 800, 'девятьсот': 900,
      'тысяча': 1000
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

  formatExpression(text) {
    if (!text) return '';
    let formatted = text;
    
    formatted = formatted.replace(/²/g, '²');
    formatted = formatted.replace(/³/g, '³');
    formatted = formatted.replace(/⁴/g, '⁴');
    
    formatted = formatted.replace(/log₂/g, 'log₂');
    formatted = formatted.replace(/log₃/g, 'log₃');
    formatted = formatted.replace(/log₄/g, 'log₄');
    formatted = formatted.replace(/log₅/g, 'log₅');
    formatted = formatted.replace(/lg/g, 'lg');
    
    formatted = formatted.replace(/√/g, '√');
    formatted = formatted.replace(/∛/g, '∛');
    formatted = formatted.replace(/⁴√/g, '⁴√');
    
    formatted = formatted.replace(/×/g, '×');
    
    return formatted;
  }

  render() {
    const { onBack } = this.props;
    const { isActive, currentGame, currentQuestion, feedback, score } = this.state;
    
    let displayText = '?';
    let isChainGame = false;
    let isCompareGame = false;
    let leftText = '';
    let rightText = '';
    
    if (currentQuestion && typeof currentQuestion === 'object') {
      if (currentGame === 'chains' && currentQuestion.fullChain) {
        displayText = currentQuestion.fullChain;
        isChainGame = true;
      } else if (currentGame === 'compare' && currentQuestion.left && currentQuestion.right) {
        leftText = currentQuestion.left.text;
        rightText = currentQuestion.right.text;
        isCompareGame = true;
      } else if (currentQuestion.text) {
        displayText = currentQuestion.text;
      } else {
        displayText = '?';
      }
    }
    displayText = String(displayText);
    
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
      'chains': 'Цепочки',
      'chain': 'Цепочки',
      'compare': 'Сравни числа'
    };
    
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
          На главную
        </button>
        
        <h1>Тренажёр устного счёта</h1>
        
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
                onClick={() => this.selectGame('chains')}
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
        
        {!isActive && currentGame && (
          <div style={{ marginTop: '30px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '400px',
              margin: '20px auto'
            }}>
              <h3>Выбрана игра: {gameNames[currentGame]}</h3>
              {currentGame === 'chains' && (
                <div style={{ marginTop: '15px', fontSize: '14px', background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '10px' }}>
                  <strong>!!!Важное правило:</strong><br/>
                  Действия выполняются <strong>ПОСЛЕДОВАТЕЛЬНО</strong> слева направо,<br/>
                  без учёта приоритета умножения и деления!
                </div>
              )}
              {currentGame === 'compare' && (
                <div style={{ marginTop: '15px', fontSize: '14px', background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '10px' }}>
                  <strong>!!!Правила игры:</strong><br/>
                  Сравните два выражения и скажите<br/>
                  <strong>"левое"</strong> или <strong>"правое"</strong><br/>
                  <span style={{ fontSize: '12px', opacity: 0.8 }}>Здесь есть степени, корни, логарифмы и скобки</span>
                </div>
              )}
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
                onClick={this.selectAnotherGame}
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
            maxWidth: '600px',
            margin: '20px auto',
            color: 'white'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>
              Игра: {gameNames[currentGame]}
            </div>
            
            {currentGame === 'chains' && (
              <div style={{ 
                fontSize: '14px', 
                background: 'rgba(255,215,0,0.2)', 
                padding: '8px 16px', 
                borderRadius: '20px',
                marginBottom: '15px',
                display: 'inline-block'
              }}>
                ⚡ Действия выполняются по порядку!
              </div>
            )}
            
            {currentGame === 'compare' && (
              <div style={{ 
                fontSize: '14px', 
                background: 'rgba(255,215,0,0.2)', 
                padding: '8px 16px', 
                borderRadius: '20px',
                marginBottom: '15px',
                display: 'inline-block'
              }}>
                Какое выражение больше?
              </div>
            )}
            
            {isCompareGame ? (
              <div style={{ 
                fontSize: '32px', 
                fontWeight: 'bold', 
                margin: '20px 0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '20px',
                flexWrap: 'wrap'
              }}>
                <div style={{ 
                  background: 'rgba(255,255,255,0.15)', 
                  padding: '20px', 
                  borderRadius: '20px',
                  minWidth: '150px',
                  fontFamily: 'monospace'
                }}>
                  {this.formatExpression(leftText)}
                </div>
                <div style={{ fontSize: '48px' }}>?</div>
                <div style={{ 
                  background: 'rgba(255,255,255,0.15)', 
                  padding: '20px', 
                  borderRadius: '20px',
                  minWidth: '150px',
                  fontFamily: 'monospace'
                }}>
                  {this.formatExpression(rightText)}
                </div>
              </div>
            ) : isChainGame ? (
              <div style={{ 
                fontSize: '32px', 
                fontWeight: 'bold', 
                margin: '20px 0',
                lineHeight: '1.3',
                wordBreak: 'break-word'
              }}>
                {displayText.split(' ').map((part, idx) => (
                  <span key={idx} style={{ 
                    display: 'inline-block',
                    margin: '0 5px',
                    padding: part.match(/[+\-×÷]/) ? '0 10px' : '0',
                    background: part.match(/[+\-×÷]/) ? 'rgba(255,255,255,0.2)' : 'transparent',
                    borderRadius: '10px'
                  }}>
                    {part}
                  </span>
                ))}
                <div style={{ fontSize: '24px', marginTop: '20px', color: '#ffd700' }}>= ?</div>
              </div>
            ) : (
              <div style={{ fontSize: '48px', fontWeight: 'bold', margin: '20px 0' }}>
                {displayText} = ?
              </div>
            )}
            
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
              Завершить игру
            </button>
            
            <p style={{ marginTop: '30px', fontSize: '14px', opacity: 0.8 }}>
              {currentGame === 'chains' 
                ? 'Вычисляйте строго по порядку: сначала первое действие, потом второе и т.д.'
                : currentGame === 'compare'
                ? 'Скажите "левое" или "правое"'
                : 'Скажите ответ голосом, например: "двадцать пять"'}
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
        </div>
      </div>
    );
  }
}