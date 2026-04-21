export const CompareGameEngine = {
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
  
  // Возвращаем строку для отображения
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
    return `✅ Правильно! ${leftFormatted} ${sign} ${rightFormatted}`;
  },
  
  getWrongMessage: (question) => {
    const leftVal = question.leftValue;
    const rightVal = question.rightValue;
    const sign = leftVal > rightVal ? '>' : '<';
    const leftFormatted = Number.isInteger(leftVal) ? leftVal : leftVal.toFixed(2);
    const rightFormatted = Number.isInteger(rightVal) ? rightVal : rightVal.toFixed(2);
    const correct = leftVal > rightVal ? 'левое' : 'правое';
    return `❌ Неправильно. ${leftFormatted} ${sign} ${rightFormatted}. Правильный ответ: ${correct}`;
  },
  
  getStartMessage: () => 'Сравните выражения! Скажите "левое" или "правое"',
  
  getStopMessage: () => 'Игра Сравни числа завершена.',
  
  getEndMessage: (score) => {
    const percent = (score.correct / score.total) * 100;
    if (percent === 100) return '🏆 Идеально! 5 из 5!';
    if (percent >= 80) return '🎉 Отлично! ' + score.correct + ' из ' + score.total;
    if (percent >= 60) return '👍 Хорошо! ' + score.correct + ' из ' + score.total;
    return '💪 Результат: ' + score.correct + ' из ' + score.total;
  },
  
  getHint: () => 'Вычислите оба выражения и сравните результаты. Скажите "левое" или "правое"',
  
  getVoiceCommandHint: () => '"левое" или "правое"'
};