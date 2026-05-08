import React from 'react';
import { createAssistant, createSmartappDebugger } from '@salutejs/client';
import './App.css';
import { MainMenu } from './pages/MainMenu';
import { TrainerPage } from './pages/TrainerPage';

const initializeAssistant = (getState) => {
  if (process.env.NODE_ENV === 'development') {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN ?? '',
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
      nativePanel: {
        defaultText: 'скажите привет',
        screenshotMode: false,
        tabIndex: -1,
      },
      settings: {
        audio: false,
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
      selectedGame: null
    };

    this.trainerPageRef = React.createRef();
    this.pendingGameAction = null;
    this.pendingAction = null;
    this.assistant = initializeAssistant(() => this.getStateForAssistant());

    this.assistant.on('data', (event) => {
      console.log('assistant.on(data):', event);
      
      if (event.type === 'smart_app_data') {
        let action = event.smart_app_data || event.action || event.payload;
        
        if (typeof action === 'string') {
          try {
            action = JSON.parse(action);
          } catch(e) {
            // Silent fail
          }
        }
        
        if (action && typeof action === 'object') {
          this.dispatchAssistantAction(action);
        }
      }
    });

    this.assistant.on('start', (event) => {
      this.assistant.getInitialData();
    });
  }

  componentDidMount() {
    // Отправляем keep_listening после монтирования
    setTimeout(() => {
      if (this.assistant) {
        this.assistant.sendData({ type: "keep_listening" });
      }
    }, 500);
  }

  getStateForAssistant() {
    const state = {
      current_page: this.state.currentPage,
      selected_game: this.state.selectedGame
    };
    return state;
  }

  dispatchAssistantAction(action) {
    console.log('dispatchAssistantAction:', action);
    if (!action || !action.type) return;
    
    switch (action.type) {
      case 'select_section':
        return this.select_section(action);
        
      case 'select_game':
        console.log('select_game received:', action.game);
        this.selectGame(action.game);
        return;
        
      case 'select_another_game':
        if (this.trainerPageRef && this.trainerPageRef.current) {
          this.trainerPageRef.current.selectAnotherGame();
        } else {
          this.setState({ currentPage: 'main', selectedGame: null });
        }
        return;
        
      case 'start_training':
        if (this.trainerPageRef && this.trainerPageRef.current) {
          this.trainerPageRef.current.startTraining();
        } else {
          this.pendingAction = action;
          if (this.state.currentPage !== 'trainer') {
            this.setState({ currentPage: 'trainer' });
          }
        }
        return;
        
      case 'trainer_answer':
        let answerValue = action.answer || action.value || action.text;
        if (action.parameters && action.parameters.value) answerValue = action.parameters.value;
        if (action.smart_app_data && action.smart_app_data.answer) answerValue = action.smart_app_data.answer;
        
        if (this.trainerPageRef && this.trainerPageRef.current) {
          this.trainerPageRef.current.checkAnswer(answerValue);
        }
        return;
        
      case 'stop_training':
        if (this.trainerPageRef && this.trainerPageRef.current) {
          this.trainerPageRef.current.stopTraining();
        }
        return;
        
      case 'trainer_help':
        if (this.trainerPageRef && this.trainerPageRef.current) {
          this.trainerPageRef.current.showHelp();
        }
        return;
        
      default:
        console.log('Unknown action type:', action.type);
    }
  }

  selectGame(gameType) {
    const gameMap = {
      'blitz': 'blitz',
      'блиц': 'blitz',
      'chains': 'chains',
      'цепочки': 'chains',
      'chain': 'chains',
      'compare': 'compare',
      'сравни числа': 'compare',
      'сравни': 'compare'
    };
    const normalizedGame = gameMap[gameType] || gameType;

    this.setState({ 
      currentPage: 'trainer', 
      selectedGame: normalizedGame 
    }, () => {
      if (this.trainerPageRef && this.trainerPageRef.current) {
        this.trainerPageRef.current.selectGame(normalizedGame);
      }
    });
  }

  select_section(action) {
    if (action.section === 'trainer') {
      this.setState({ currentPage: 'trainer', selectedGame: null }, () => {
        if (this.pendingGameAction) {
          if (this.trainerPageRef && this.trainerPageRef.current) {
            this.trainerPageRef.current.selectGame(this.pendingGameAction.game);
          }
          this.pendingGameAction = null;
        }
        if (this.pendingAction && this.pendingAction.type === 'start_training') {
          if (this.trainerPageRef && this.trainerPageRef.current) {
            this.trainerPageRef.current.startTraining();
          }
          this.pendingAction = null;
        }
      });
    } else if (action.section === 'main') {
      this.setState({
        currentPage: 'main',
        selectedGame: null,
        pendingAction: null,
        pendingGameAction: null
      });
    }
  }

  render() {
    if (this.state.currentPage === 'main') {
      return (
        <MainMenu
          onSelectTrainer={(gameType) => {
            this.selectGame(gameType);
          }}
        />
      );
    }
    
    if (this.state.currentPage === 'trainer') {
      return (
        <TrainerPage 
          ref={this.trainerPageRef}
          onBack={() => {
            this.setState({ currentPage: 'main', selectedGame: null });
          }}
          assistant={this.assistant}
          initialGame={this.state.selectedGame}
        />
      );
    }

    return null;
  }
}