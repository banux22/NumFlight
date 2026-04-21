import React from 'react';
import { createAssistant, createSmartappDebugger } from '@salutejs/client';

import './App.css';
import { MainMenu } from './pages/MainMenu';
import { GameTemplate } from './pages/_GameTemplate';
import { BlitzGameEngine } from './pages/gameBlitz';
import { ChainsGameEngine } from './pages/gameMemoryChain';
import { CompareGameEngine } from './pages/gameCompare';

const initializeAssistant = (getState) => {
  if (process.env.NODE_ENV === 'development') {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN ?? '',
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
      nativePanel: {
        defaultText: 'начнем',
        screenshotMode: false,
        tabIndex: -1,
      },
      settings: {
        audio: true,
        video: false,
      },
    });
  } else {
    return createAssistant({ getState, settings: { audio: false } });
  }
};

export class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      currentPage: 'main',
      selectedGame: null,
      currentEngine: null
    };
    
    this.gameTemplateRef = React.createRef();
    this.assistant = initializeAssistant(() => this.getStateForAssistant());

    this.assistant.on('data', (event) => {
      console.log('=== ASSISTANT DATA ===');
      console.log(JSON.stringify(event, null, 2));
      
      if (event.type === 'smart_app_data') {
        let action = event.smart_app_data || event.action || event.payload;
        
        if (typeof action === 'string') {
          try {
            action = JSON.parse(action);
          } catch(e) {}
        }
        
        if (action && typeof action === 'object') {
          this.dispatchAssistantAction(action);
        }
      }
    });

    this.assistant.on('start', (event) => {
      console.log('Assistant started');
      this.assistant.getInitialData();
    });
    
    this.selectGame = this.selectGame.bind(this);
    this.selectAnotherGame = this.selectAnotherGame.bind(this);
    this.select_section = this.select_section.bind(this);
    this.dispatchAssistantAction = this.dispatchAssistantAction.bind(this);
  }

  getStateForAssistant() {
    const state = {
      game_selector: {
        available_games: ['blitz', 'chains', 'compare'],
        current_page: this.state.currentPage
      }
    };
    return state;
  }

  extractAnswerFromAction(action) {
    console.log('Extracting answer from action:', action);
    
    if (!action) return null;
    
    if (typeof action === 'number') return action;
    if (typeof action === 'string') return action;
    
    if (action.answer !== undefined) return action.answer;
    if (action.value !== undefined) return action.value;
    if (action.text !== undefined) return action.text;
    if (action.number !== undefined) return action.number;
    if (action.result !== undefined) return action.result;
    
    if (action.parameters) {
      if (action.parameters.value !== undefined) return action.parameters.value;
      if (action.parameters.answer !== undefined) return action.parameters.answer;
      if (action.parameters.number !== undefined) return action.parameters.number;
    }
    
    if (action.smart_app_data) {
      return this.extractAnswerFromAction(action.smart_app_data);
    }
    
    if (action.payload) {
      return this.extractAnswerFromAction(action.payload);
    }
    
    for (let key in action) {
      if (typeof action[key] === 'number') {
        return action[key];
      }
      if (typeof action[key] === 'string' && !isNaN(parseFloat(action[key]))) {
        return parseFloat(action[key]);
      }
      if (typeof action[key] === 'object' && action[key] !== null) {
        const nested = this.extractAnswerFromAction(action[key]);
        if (nested !== null) return nested;
      }
    }
    
    return null;
  }

  dispatchAssistantAction(action) {
    console.log('Dispatching action:', action.type, action);
    
    if (!action || !action.type) return;
    
    switch (action.type) {
      case 'select_section':
        return this.select_section(action);
        
      case 'select_game':
        this.selectGame(action.game);
        return;
        
      case 'start_training':
        if (this.gameTemplateRef.current && this.state.currentPage === 'trainer') {
          this.gameTemplateRef.current.startGame();
        }
        return;
        
      case 'trainer_answer':
        const answerValue = this.extractAnswerFromAction(action);
        console.log('Extracted answer value:', answerValue);
        
        if (this.gameTemplateRef.current && this.state.currentPage === 'trainer') {
          this.gameTemplateRef.current.checkAnswer(answerValue);
        }
        return;
        
      case 'stop_training':
        if (this.gameTemplateRef.current) {
          this.gameTemplateRef.current.stopGame();
        }
        return;
        
      case 'trainer_help':
        if (this.gameTemplateRef.current) {
          this.gameTemplateRef.current.showHelp();
        }
        return;
        
      default:
        return null;
    }
  }

  select_section(action) {
    if (action.section === 'trainer') {
      this.setState({ currentPage: 'trainer', selectedGame: null, currentEngine: null });
    } else if (action.section === 'main') {
      this.setState({ currentPage: 'main', selectedGame: null, currentEngine: null });
    }
  }

  selectGame(gameType) {
    let engine = null;
    let gameName = '';
    
    switch(gameType) {
      case 'blitz':
        engine = BlitzGameEngine;
        gameName = 'blitz';
        break;
      case 'chains':
        engine = ChainsGameEngine;
        gameName = 'chains';
        break;
      case 'compare':
        engine = CompareGameEngine;
        gameName = 'compare';
        break;
      default:
        return;
    }
    
    this.setState({ 
      currentPage: 'trainer', 
      selectedGame: gameName,
      currentEngine: engine
    });
  }

  selectAnotherGame() {
    this.setState({ currentPage: 'main', selectedGame: null, currentEngine: null });
  }

  getGameEngine() {
    return this.state.currentEngine;
  }

  render() {
    if (this.state.currentPage === 'main') {
      return (
        <MainMenu 
          onSelectTrainer={(gameType) => {
            if (gameType) {
              this.selectGame(gameType);
            } else {
              this.setState({ currentPage: 'trainer', selectedGame: null, currentEngine: null });
            }
          }}
        />
      );
    }

    if (this.state.currentPage === 'trainer') {
      const engine = this.getGameEngine();
      
      if (!engine) {
        return (
          <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
            <button 
              onClick={() => this.setState({ currentPage: 'main' })}
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
            <h1>Выберите игру</h1>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px', flexWrap: 'wrap' }}>
              <button
                onClick={() => this.selectGame('blitz')}
                style={{ padding: '20px 40px', fontSize: '18px', background: '#FF9800', borderRadius: '15px', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                ⚡ Блиц
              </button>
              <button
                onClick={() => this.selectGame('chains')}
                style={{ padding: '20px 40px', fontSize: '18px', background: '#9C27B0', borderRadius: '15px', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                🔗 Цепочки
              </button>
              <button
                onClick={() => this.selectGame('compare')}
                style={{ padding: '20px 40px', fontSize: '18px', background: '#00BCD4', borderRadius: '15px', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                ⚖️ Сравни числа
              </button>
            </div>
            <p style={{ marginTop: '20px', color: 'rgba(255,255,255,0.7)' }}>
              🎙️ Скажите голосом: "блиц", "цепочки" или "сравни числа"
            </p>
          </div>
        );
      }
      
      return (
        <GameTemplate
          ref={this.gameTemplateRef}
          onBack={() => this.setState({ currentPage: 'main', selectedGame: null, currentEngine: null })}
          onSelectAnotherGame={() => this.selectAnotherGame()}
          assistant={this.assistant}
          gameEngine={engine}
          gameName={engine.getName()}
          gameIcon={engine.getIcon()}
        />
      );
    }
    
    return null;
  }
}