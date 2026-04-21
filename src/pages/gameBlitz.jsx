export const BlitzGameEngine = {
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
  
  getCorrectMessage: (question) => `✅ Верно! ${question.text} = ${question.answer}`,
  
  getWrongMessage: (question) => `❌ Ошибка! ${question.text} = ${question.answer}`,
  
  getStartMessage: () => 'Поехали! Скажите число, например 25',
  
  getStopMessage: () => 'Тренировка Блиц завершена.',
  
  getEndMessage: (score) => {
    const percent = (score.correct / score.total) * 100;
    if (percent === 100) return '🏆 Идеально! 5 из 5!';
    if (percent >= 80) return '🎉 Отлично! ' + score.correct + ' из ' + score.total;
    if (percent >= 60) return '👍 Хорошо! ' + score.correct + ' из ' + score.total;
    return '💪 Результат: ' + score.correct + ' из ' + score.total;
  },
  
  getHint: () => 'Скажите число, например 25',
  
  getVoiceCommandHint: () => 'число, например 25'
};