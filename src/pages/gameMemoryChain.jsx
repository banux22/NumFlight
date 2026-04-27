export const ChainsGameEngine = {
  getName: () => 'Цепочки',
  getIcon: () => '🔗',
  
  getDescription: () => 'Запоминайте результат каждого действия. В конце назовите итоговое число!',
  
  getWelcomeMessage: () => 'Запоминайте промежуточные результаты! Ошибки не показываются до конца.',
  
  // ФЛАГИ
  hideScore: true,
  stepByStepMode: true,
  allowNextCommand: true,
  hideStepFeedback: true,  // НЕ показывать сообщения об ошибках на каждом шаге
  
  generateQuestion: () => {
    const steps = [];
    const stepCount = 5; // ФИКСИРОВАННОЕ количество шагов
    let currentValue = Math.floor(Math.random() * 20) + 1;
    const initialValue = currentValue;
    const operations = ['+', '-', '*'];
    
    for (let i = 0; i < stepCount; i++) {
      const op = operations[Math.floor(Math.random() * operations.length)];
      let b;
      let operationSymbol = '';
      let operationVoice = '';
      
      switch (op) {
        case '+':
          b = Math.floor(Math.random() * 20) + 1;
          operationSymbol = '+';
          operationVoice = `прибавить ${b}`;
          steps.push({
            operation: '+',
            operand: b,
            result: currentValue + b,
            displayText: `${operationSymbol} ${b}`,
            voiceText: operationVoice,
            previousValue: currentValue,
            userAnswer: null  // запоминаем ответ пользователя
          });
          currentValue = currentValue + b;
          break;
        case '-':
          b = Math.floor(Math.random() * currentValue) + 1;
          operationSymbol = '-';
          operationVoice = `вычесть ${b}`;
          steps.push({
            operation: '-',
            operand: b,
            result: currentValue - b,
            displayText: `${operationSymbol} ${b}`,
            voiceText: operationVoice,
            previousValue: currentValue,
            userAnswer: null
          });
          currentValue = currentValue - b;
          break;
        case '*':
          b = Math.floor(Math.random() * 9) + 2;
          operationSymbol = '×';
          operationVoice = `умножить на ${b}`;
          steps.push({
            operation: '×',
            operand: b,
            result: currentValue * b,
            displayText: `${operationSymbol} ${b}`,
            voiceText: operationVoice,
            previousValue: currentValue,
            userAnswer: null
          });
          currentValue = currentValue * b;
          break;
      }
    }
    
    return {
      steps: steps,
      currentStepIndex: 0,
      finalAnswer: currentValue,
      initialValue: initialValue,
      totalSteps: stepCount,
      showInitial: true,
      allAnswers: []  // массив для хранения всех ответов пользователя
    };
  },
  
  getQuestionText: (question) => {
    if (question.showInitial) {
      return `Начальное число ${question.initialValue}. Запомните его. Будет 5 действий.`;
    }
    if (question.currentStepIndex >= question.steps.length) {
      return `Чему равен итоговый результат?`;
    }
    return question.steps[question.currentStepIndex].voiceText;
  },
  
  checkAnswer: (userAnswer, question) => {
    const answerStr = String(userAnswer).toLowerCase().trim();
    const isNextCommand = answerStr.includes('дальше') || 
                          answerStr.includes('продолжить') || 
                          answerStr === 'next';
    
    // На начальном шаге принимаем только "дальше"
    if (question.showInitial) {
      return isNextCommand;
    }
    
    // Сохраняем ответ пользователя (но не проверяем на правильность)
    if (question.currentStepIndex < question.steps.length) {
      // Запоминаем ответ, но не проверяем
      return true; // Всегда возвращаем true, чтобы двигаться дальше
    }
    
    // Финальный ответ - только здесь проверяем
    if (question.currentStepIndex >= question.steps.length) {
      const userNumber = Number(userAnswer);
      return userNumber === question.finalAnswer;
    }
    
    return false;
  },
  
  getNextStep: (question, userAnswer) => {
    const answerStr = String(userAnswer).toLowerCase().trim();
    const isNextCommand = answerStr.includes('дальше') || 
                          answerStr.includes('продолжить') || 
                          answerStr === 'next';
    
    // Начальный шаг - "дальше"
    if (question.showInitial && isNextCommand) {
      return {
        ...question,
        showInitial: false,
        currentStepIndex: 0,
        allAnswers: []
      };
    }
    
    // Сохраняем ответ пользователя для текущего шага
    const updatedSteps = [...question.steps];
    if (question.currentStepIndex < question.steps.length) {
      updatedSteps[question.currentStepIndex] = {
        ...updatedSteps[question.currentStepIndex],
        userAnswer: userAnswer
      };
    }
    
    const nextIndex = question.currentStepIndex + 1;
    
    // Если прошли все шаги - переходим к финальному вопросу
    if (nextIndex >= question.steps.length) {
      // Подсчитываем количество правильных ответов
      let correctCount = 0;
      updatedSteps.forEach((step, idx) => {
        if (Number(step.userAnswer) === step.result) {
          correctCount++;
        }
      });
      
      return {
        ...question,
        steps: updatedSteps,
        currentStepIndex: question.steps.length,
        allAnswers: updatedSteps.map(s => s.userAnswer),
        correctCount: correctCount
      };
    }
    
    // Переход к следующему шагу
    return {
      ...question,
      steps: updatedSteps,
      currentStepIndex: nextIndex
    };
  },
  
  renderQuestion: (question) => {
    if (!question) return '?';
    
    if (question.showInitial) {
      return `🔢 Начальное число: ${question.initialValue}`;
    }
    
    if (question.currentStepIndex >= question.steps.length) {
      return `❓ Чему равен итоговый результат?`;
    }
    
    const step = question.steps[question.currentStepIndex];
    return `${step.displayText} = ?`;
  },
  
  getHint: (question) => {
    if (!question) return 'Запоминайте промежуточные результаты!';
    if (question.showInitial) {
      return `Запомните начальное число: ${question.initialValue}. Скажите "дальше" чтобы продолжить.`;
    }
    if (question.currentStepIndex >= question.steps.length) {
      const lastStep = question.steps[question.steps.length - 1];
      return `Последний результат был: ${lastStep?.result}. Назовите итоговое число.`;
    }
    const step = question.steps[question.currentStepIndex];
    return `Предыдущий результат был: ${step.previousValue}`;
  },
  
  // Сообщения показываются ТОЛЬКО в конце
  getCorrectMessage: (question) => {
    // Для финального ответа
    if (question.currentStepIndex >= question.steps.length) {
      const correctCount = question.correctCount || 0;
      const totalSteps = question.steps.length;
      
      if (correctCount === totalSteps) {
        return `🎉 Поздравляю! Все ${totalSteps} шагов решены верно! Итоговый результат: ${question.finalAnswer}`;
      } else {
        return `📊 Вы решили правильно ${correctCount} из ${totalSteps} шагов. Итоговый результат: ${question.finalAnswer}`;
      }
    }
    return ''; // Нет сообщений для отдельных шагов
  },
  
  getWrongMessage: (question) => {
    // Для финального ответа
    if (question.currentStepIndex >= question.steps.length) {
      const correctCount = question.correctCount || 0;
      const totalSteps = question.steps.length;
      return `❌ Неправильно. Правильный итоговый результат: ${question.finalAnswer}. Вы решили правильно ${correctCount} из ${totalSteps} шагов.`;
    }
    return ''; // Нет сообщений для отдельных шагов
  },
  
  getStartMessage: () => 'Цепочка из 5 действий. Запоминайте результат каждого шага. Скажите "дальше" когда запомните начальное число.',
  
  getStopMessage: () => 'Игра Цепочки памяти завершена.',
  
  getEndMessage: (score) => {
    const percent = (score.correct / score.total) * 100;
    if (percent === 100) return '🏆 Идеально! Отличная память!';
    if (percent >= 80) return '🎉 Отлично! ' + score.correct + ' из ' + score.total;
    if (percent >= 60) return '👍 Хорошо! ' + score.correct + ' из ' + score.total;
    return '💪 Результат: ' + score.correct + ' из ' + score.total;
  },
  
  getVoiceCommandHint: () => 'число или "дальше"'
};