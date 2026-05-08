import React from 'react';

// Движки игр
const BlitzGameEngine = {
  getName: () => 'Блиц',
  getIcon: () => '⚡',
  
  getDescription: () => 'Быстрые примеры на сложение, вычитание и умножение. У вас есть 5 вопросов.',
  
  getWelcomeMessage: () => 'Добро пожаловать в Блиц! Скажите ответ голосом.',
  
  generateQuestion: () => {
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
  },
  
  getQuestionText: (question) => {
    return question.text;
  },
  
  checkAnswer: (userAnswer, question) => {
    return userAnswer === question.answer;
  },
  
  renderQuestion: (question) => {
    return `${question.text} = ?`;
  },
  
  getCorrectMessage: (question) => `💚 Верно! ${question.text} = ${question.answer}`,
  
  getWrongMessage: (question) => `❤️ Ошибка! ${question.text} = ${question.answer}`,
  
  getStartMessage: () => 'Поехали! Скажите число, например 25',
  
  getStopMessage: () => 'Тренировка Блиц завершена.',
  
  getEndMessage: (score) => {
    const percent = (score.correct / score.total) * 100;
    if (percent === 100) return '🏆 Идеально!';
    if (percent >= 80) return '🎉 Отлично! ' + score.correct + ' из ' + score.total;
    if (percent >= 60) return '👍 Хорошо! ' + score.correct + ' из ' + score.total;
    return '💪 Результат: ' + score.correct + ' из ' + score.total;
  },
  
  getHint: () => 'Скажите число, например 25',
  
  getVoiceCommandHint: () => 'число, например 25'
};

const ChainsGameEngine = {
  getName: () => 'Цепочки',
  getIcon: () => '🔗',
  
  getDescription: () => 'Выполняйте действия ПОСЛЕДОВАТЕЛЬНО слева направо, без учёта приоритета операций!',
  
  getWelcomeMessage: () => 'ВНИМАНИЕ! В цепочках действия выполняются строго по порядку!',
  
  generateQuestion: () => {
    const steps = [];
    const stepCount = Math.floor(Math.random() * 3) + 3;
    let currentValue = Math.floor(Math.random() * 20) + 1;
    const operations = ['+', '-', '*'];
    
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
      answer: currentValue
    };
  },
  
  getQuestionText: (question) => {
    return question.fullChain;
  },
  
  checkAnswer: (userAnswer, question) => {
    return userAnswer === question.answer;
  },
  
  renderQuestion: (question) => {
    return `${question.fullChain} = ?`;
  },
  
  getCorrectMessage: (question) => `💚 Правильно! Ответ: ${question.answer}`,
  
  getWrongMessage: (question) => `❤️ Неправильно. Правильный ответ: ${question.answer}`,
  
  getStartMessage: () => 'Внимание! Действия выполняются последовательно! Скажите ответ.',
  
  getStopMessage: () => 'Игра Цепочки завершена.',
  
  getEndMessage: (score) => {
    const percent = (score.correct / score.total) * 100;
    if (percent === 100) return '🏆 Идеально!';
    if (percent >= 80) return '🎉 Отлично! ' + score.correct + ' из ' + score.total;
    if (percent >= 60) return '👍 Хорошо! ' + score.correct + ' из ' + score.total;
    return '💪 Результат: ' + score.correct + ' из ' + score.total;
  },
  
  getHint: () => 'Вычисляйте строго по порядку слева направо! Сначала первое действие, потом второе и так далее.',
  
  getVoiceCommandHint: () => 'число, например 42'
};

const CompareGameEngine = {
  getName: () => 'Сравни числа',
  getIcon: () => '⚖️',
  
  getDescription: () => 'Сравните два выражения и скажите, какое больше. Здесь есть степени, корни, логарифмы и скобки!',
  
  getWelcomeMessage: () => 'Скажите "левое" или "правое"!',
  
  generateQuestion: () => {
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    const expressionTypes = [
      'square', 'sqrt', 'fraction', 'power', 'multiplication',
      'sum', 'logarithm', 'different_root', 'square_sum', 'square_diff'
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
            { degree: 3, num: 8, value: 2, text: '∛8' },
            { degree: 3, num: 27, value: 3, text: '∛27' },
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
      leftValue: left.value,
      rightValue: right.value
    };
  },
  
  getQuestionText: (question) => {
    return `${question.left.text} и ${question.right.text}, какое больше?`;
  },
  
  checkAnswer: (userAnswer, question) => {
    return userAnswer === question.correctAnswer;
  },
  
  renderQuestion: (question) => {
    const formatExpression = (text) => {
      let formatted = text;
      formatted = formatted.replace(/²/g, '²').replace(/³/g, '³').replace(/⁴/g, '⁴');
      formatted = formatted.replace(/log₂/g, 'log₂').replace(/log₃/g, 'log₃');
      formatted = formatted.replace(/log₄/g, 'log₄').replace(/log₅/g, 'log₅');
      formatted = formatted.replace(/lg/g, 'lg');
      formatted = formatted.replace(/√/g, '√').replace(/∛/g, '∛').replace(/⁴√/g, '⁴√');
      formatted = formatted.replace(/×/g, '×');
      return formatted;
    };
    
    const formatValue = (val) => {
      if (Number.isInteger(val)) return val.toString();
      return val.toFixed(2).replace(/\.?0+$/, '');
    };
    
    return `${formatExpression(question.left.text)} (${formatValue(question.leftValue)}) ? ${formatExpression(question.right.text)} (${formatValue(question.rightValue)})`;
  },
  
  getCorrectMessage: (question) => {
    const leftVal = question.leftValue;
    const rightVal = question.rightValue;
    const sign = leftVal > rightVal ? '>' : '<';
    const leftFormatted = Number.isInteger(leftVal) ? leftVal : leftVal.toFixed(2);
    const rightFormatted = Number.isInteger(rightVal) ? rightVal : rightVal.toFixed(2);
    return `💚 Правильно! ${leftFormatted} ${sign} ${rightFormatted}`;
  },
  
  getWrongMessage: (question) => {
    const leftVal = question.leftValue;
    const rightVal = question.rightValue;
    const sign = leftVal > rightVal ? '>' : '<';
    const leftFormatted = Number.isInteger(leftVal) ? leftVal : leftVal.toFixed(2);
    const rightFormatted = Number.isInteger(rightVal) ? rightVal : rightVal.toFixed(2);
    const correct = leftVal > rightVal ? 'левое' : 'правое';
    return `❤️ Неправильно. ${leftFormatted} ${sign} ${rightFormatted}. Правильный ответ: ${correct}`;
  },
  
  getStartMessage: () => 'Сравните выражения! Скажите "левое" или "правое"',
  
  getStopMessage: () => 'Игра Сравни числа завершена.',
  
  getEndMessage: (score) => {
    const percent = (score.correct / score.total) * 100;
    if (percent === 100) return '🏆 Идеально!';
    if (percent >= 80) return '🎉 Отлично! ' + score.correct + ' из ' + score.total;
    if (percent >= 60) return '👍 Хорошо! ' + score.correct + ' из ' + score.total;
    return '💪 Результат: ' + score.correct + ' из ' + score.total;
  },
  
  getHint: () => 'Вычислите оба выражения и сравните результаты. Посчитайте значение слева и справа, затем скажите "левое" или "правое" в зависимости от того, какое выражение больше.',
  
  getVoiceCommandHint: () => '"левое" или "правое"'
};

export class TrainerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      showResults: false,
      currentGame: props.initialGame || null,
      currentEngine: null,
      currentQuestion: null,
      currentIndex: 0,
      totalQuestions: 5,
      feedback: props.initialGame ? 'Выберите игру или скажите "начать тренировку"' : '',
      score: { correct: 0, total: 0 },
      lastAnswer: null,
      showHint: false,
      isLoading: false
    };
    
    this.assistant = props.assistant;
    
    this.gameEngines = {
      'blitz': BlitzGameEngine,
      'chains': ChainsGameEngine,
      'compare': CompareGameEngine
    };
    
    this.startGame = this.startGame.bind(this);
    this.stopGame = this.stopGame.bind(this);
    this.stopTraining = this.stopGame.bind(this);
    this.startTraining = this.startGame.bind(this);
    this.showHelp = this.showHelp.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.selectGame = this.selectGame.bind(this);
    this.selectAnotherGame = this.selectAnotherGame.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.goToMainMenu = this.goToMainMenu.bind(this);
    this.parseNumber = this.parseNumber.bind(this);
    this.safeString = this.safeString.bind(this);
  }

  safeString(value) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    return String(value);
  }

  keepListening = () => {
    if (this.props.onKeepListening) {
      this.props.onKeepListening();
    } else if (this.assistant) {
      this.assistant.sendData({ type: "keep_listening" });
    }
  }

  componentDidMount() {
    if (this.props.initialGame) {
      this.selectGame(this.props.initialGame);
    }
    setTimeout(() => {
      this.keepListening();
    }, 1000);
  }

  selectGame(gameType) {
    const engine = this.gameEngines[gameType];
    if (!engine) return;
    
    this.setState({
      currentGame: gameType,
      currentEngine: engine,
      isActive: false,
      showResults: false,
      currentQuestion: null,
      currentIndex: 0,
      feedback: `Выбрана игра: ${engine.getName()}. Скажите "начать"`,
      score: { correct: 0, total: 0 },
      lastAnswer: null,
      showHint: false
    }, () => {
      setTimeout(() => {
        this.keepListening();
      }, 500);
    });
  }

  selectAnotherGame() {
    if (this.props.onBack) {
      this.props.onBack();
    }
  }

  restartGame() {
    if (!this.state.currentEngine) return;
    
    const firstQuestion = this.state.currentEngine.generateQuestion();
    
    this.setState({
      isActive: true,
      showResults: false,
      currentQuestion: firstQuestion,
      currentIndex: 1,
      feedback: this.state.currentEngine.getStartMessage(),
      score: { correct: 0, total: 0 },
      lastAnswer: null,
      showHint: false
    }, () => {
      setTimeout(() => {
        this.keepListening();
      }, 500);
    });
  }

  goToMainMenu() {
    if (this.props.onBack) {
      this.props.onBack();
    }
  }

  startGame() {
    if (!this.state.currentEngine) {
      this.setState({
        feedback: 'Сначала выберите игру'
      });
      return;
    }
    
    const firstQuestion = this.state.currentEngine.generateQuestion();
    
    this.setState({
      isActive: true,
      showResults: false,
      currentQuestion: firstQuestion,
      currentIndex: 1,
      feedback: this.state.currentEngine.getStartMessage(),
      score: { correct: 0, total: 0 },
      lastAnswer: null,
      showHint: false
    }, () => {
      setTimeout(() => {
        this.keepListening();
      }, 500);
    });
  }

  stopGame() {
    this.setState({
      isActive: false,
      showResults: true
    });
  }

  showHelp() {
    const engine = this.state.currentEngine;
    const { currentGame, isActive } = this.state;
    
    if (!engine) {
      this.setState({
        feedback: 'Сначала выберите игру: "блиц", "цепочки" или "сравни числа"'
      });
      this.keepListening();
      return;
    }
    
    let hintText = '';
    
    if (currentGame === 'blitz') {
      hintText = '💡 Подсказка: Скажите число, например "двадцать пять" или просто "25"';
    } else if (currentGame === 'chains') {
      hintText = '💡 Подсказка: Вычисляйте строго по порядку слева направо! Не используйте приоритет умножения.';
    } else if (currentGame === 'compare') {
      hintText = '💡 Подсказка: Вычислите значение левого выражения и правого выражения, затем сравните их. Скажите "левое", если левое больше, или "правое", если правое больше.';
    } else {
      hintText = engine.getHint();
    }
    
    this.setState({ 
      showHint: true, 
      feedback: hintText 
    });
    
    setTimeout(() => {
      if (this.state.showHint) {
        this.setState({ showHint: false });
        // Возвращаем обычное сообщение после подсказки
        if (this.state.isActive && engine) {
          this.setState({ feedback: engine.getStartMessage() });
        } else if (this.state.currentGame && !this.state.isActive) {
          this.setState({ feedback: `Выбрана игра: ${engine.getName()}. Скажите "начать"` });
        }
      }
    }, 10000);
    
    this.keepListening();
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

  checkAnswer(userAnswer) {
    if (!this.state.isActive || !this.state.currentEngine) {
      console.log('Game not active');
      return;
    }
    
    const engine = this.state.currentEngine;
    let isCorrect = false;
    
    if (this.state.currentGame === 'compare') {
      const answerStr = this.safeString(userAnswer).toLowerCase().trim();
      
      if (answerStr.includes('лево') || answerStr === 'left' || answerStr === 'левое') {
        isCorrect = (this.state.currentQuestion.correctAnswer === 'left');
      } else if (answerStr.includes('прав') || answerStr === 'right' || answerStr === 'правое') {
        isCorrect = (this.state.currentQuestion.correctAnswer === 'right');
      } else {
        this.setState({
          feedback: 'Скажите "левое" или "правое"'
        });
        this.keepListening();
        return;
      }
    } else {
      let userNumber = null;
      
      if (Array.isArray(userAnswer)) {
        if (userAnswer.length > 0 && userAnswer[0] && userAnswer[0].text) {
          userNumber = this.parseNumber(userAnswer[0].text);
        }
      } else if (typeof userAnswer === 'string') {
        userNumber = this.parseNumber(userAnswer);
      } else if (typeof userAnswer === 'number') {
        userNumber = userAnswer;
      }
      
      isCorrect = (userNumber === this.state.currentQuestion.answer);
    }
    
    const newScore = {
      correct: this.state.score.correct + (isCorrect ? 1 : 0),
      total: this.state.score.total + 1
    };
    
    let feedback;
    if (this.state.currentGame === 'compare') {
      feedback = isCorrect 
        ? engine.getCorrectMessage(this.state.currentQuestion)
        : engine.getWrongMessage(this.state.currentQuestion);
    } else if (this.state.currentGame === 'chains') {
      feedback = isCorrect 
        ? engine.getCorrectMessage(this.state.currentQuestion)
        : engine.getWrongMessage(this.state.currentQuestion);
    } else {
      feedback = isCorrect 
        ? engine.getCorrectMessage(this.state.currentQuestion)
        : engine.getWrongMessage(this.state.currentQuestion);
    }
    
    if (newScore.total >= this.state.totalQuestions) {
      this.setState({
        isActive: false,
        showResults: true,
        score: newScore,
        feedback: feedback
      });
      return;
    }
    
    const nextQuestion = engine.generateQuestion();
    
    this.setState({
      currentQuestion: nextQuestion,
      currentIndex: this.state.currentIndex + 1,
      feedback: feedback,
      score: newScore,
      lastAnswer: userAnswer
    });
    
    setTimeout(() => {
      if (this.state.isActive) {
        this.keepListening();
      }
    }, 2000);
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
    const { isActive, showResults, currentGame, currentEngine, currentQuestion, currentIndex, totalQuestions, feedback, score, showHint } = this.state;
    
    let questionText = '?';
    let isCompareGame = false;
    let leftText = '';
    let rightText = '';
    
    if (currentQuestion && currentEngine && !showResults) {
      if (currentGame === 'compare') {
        isCompareGame = true;
        leftText = currentQuestion.left?.text || '';
        rightText = currentQuestion.right?.text || '';
        questionText = `${this.formatExpression(leftText)} ? ${this.formatExpression(rightText)}`;
      } else {
        questionText = currentEngine.renderQuestion(currentQuestion);
      }
    }
    
    const correctCount = typeof score.correct === 'number' ? score.correct : 0;
    const totalCount = typeof score.total === 'number' ? score.total : 0;
    const engine = currentEngine;
    const percent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    
    if (showResults && engine) {
      return (
        <div className="game-template-container">
          <div className="game-template-top-bar">
            <button onClick={onBack} className="game-template-back-btn">← На главную</button>
            <h2 className="game-template-title">
              {engine.getIcon()} {engine.getName()}
            </h2>
            <button onClick={this.showHelp} className="game-template-help-btn">❓ Подсказка</button>
          </div>

          <div className="game-template-card">
            <div className="game-template-start-screen">
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>
                {percent === 100 ? '🏆' : percent >= 80 ? '🎉' : percent >= 60 ? '👍' : '💪'}
              </div>
              <h2 style={{ fontSize: '32px', marginBottom: '15px' }}>Результат!</h2>
              <p className="game-template-description" style={{ fontSize: '24px' }}>
                {correctCount} / {totalCount} правильных ответов
              </p>
              <p className="game-template-description">
                {engine.getEndMessage(score)}
              </p>
              <div style={{ marginTop: '30px' }}>
                <button onClick={this.restartGame} className="game-template-start-btn">
                  🎮 Играть снова
                </button>
                <button onClick={this.goToMainMenu} className="game-template-another-game-btn">
                  🎲 Выбрать другую игру
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="game-template-container">
        <div className="game-template-top-bar">
          <button onClick={onBack} className="game-template-back-btn">← На главную</button>
          <h2 className="game-template-title">
            {engine ? engine.getIcon() : '🧠'} {engine ? engine.getName() : 'Тренажёр'}
          </h2>
          <button onClick={this.showHelp} className="game-template-help-btn">❓ Подсказка</button>
        </div>

        {isActive && (
          <div className="game-template-progress">
            <span>📊 Вопрос {currentIndex} из {totalQuestions}</span>
            <span className="game-template-score-badge">✅ {correctCount} / {totalCount}</span>
          </div>
        )}

        <div className="game-template-card">
          {!isActive && !showResults ? (
            <div className="game-template-start-screen">
              <p className="game-template-description">
                {engine ? engine.getDescription() : 'Выберите игру для тренировки'}
              </p>
              {engine ? (
                <button onClick={this.startGame} className="game-template-start-btn">
                  🎮 Начать игру
                </button>
              ) : (
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
                      ⚡ Блиц
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
                      🔗 Цепочки
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
                      ⚖️ Сравни числа
                    </button>
                  </div>
                  <p style={{ marginTop: '20px', color: 'rgba(255,255,255,0.7)' }}>
                    Или скажите голосом: "блиц", "цепочки" или "сравни числа"
                  </p>
                </div>
              )}
              {engine && (
                <button onClick={this.selectAnotherGame} className="game-template-another-game-btn">
                  🎲 Выбрать другую игру
                </button>
              )}
            </div>
          ) : isActive && (
            <>
              {isCompareGame ? (
                <div className="game-template-question-card" style={{ fontSize: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ background: 'rgba(255,255,255,0.15)', padding: '20px', borderRadius: '20px', minWidth: '150px' }}>
                      {this.formatExpression(leftText)}
                    </div>
                    <span style={{ fontSize: '48px' }}>?</span>
                    <div style={{ background: 'rgba(255,255,255,0.15)', padding: '20px', borderRadius: '20px', minWidth: '150px' }}>
                      {this.formatExpression(rightText)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="game-template-question-card">{questionText}</div>
              )}
              <button 
                onClick={this.stopGame} 
                className="game-template-stop-btn"
                style={{
                  background: '#ff9800',
                  padding: '8px 16px',
                  fontSize: '14px',
                  width: 'auto',
                  marginTop: '20px'
                }}
              >
                ⏹️ Завершить игру
              </button>
            </>
          )}
        </div>

        <div className="game-template-feedback-area">
          {showHint ? (
            <div className="game-template-hint-box">
              {feedback}
            </div>
          ) : (
            <div className="game-template-feedback-box">
              {feedback || (engine ? engine.getWelcomeMessage() : 'Добро пожаловать в Числовой полёт!')}
            </div>
          )}
        </div>
      </div>
    );
  }
}