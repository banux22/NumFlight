export const ChainsGameEngine = {
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
  
  // Возвращаем строку, а не React-компонент
  renderQuestion: (question) => {
    return `${question.fullChain} = ? (действия выполняются по порядку!)`;
  },
  
  getCorrectMessage: (question) => `✅ Правильно! Ответ: ${question.answer}`,
  
  getWrongMessage: (question) => `❌ Неправильно. Правильный ответ: ${question.answer}`,
  
  getStartMessage: () => 'Внимание! Действия выполняются последовательно! Скажите ответ.',
  
  getStopMessage: () => 'Игра Цепочки завершена.',
  
  getEndMessage: (score) => {
    const percent = (score.correct / score.total) * 100;
    if (percent === 100) return '🏆 Идеально! 5 из 5!';
    if (percent >= 80) return '🎉 Отлично! ' + score.correct + ' из ' + score.total;
    if (percent >= 60) return '👍 Хорошо! ' + score.correct + ' из ' + score.total;
    return '💪 Результат: ' + score.correct + ' из ' + score.total;
  },
  
  getHint: () => 'Вычисляйте строго по порядку слева направо!',
  
  getVoiceCommandHint: () => 'число, например 42'
};