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
        defaultText: 'начнем',
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
      notes: [{ id: Math.random().toString(36).substring(7), title: 'тест' }],
      currentPage: 'main',
    };
    
    this.trainerPageRef = React.createRef();
    this.pendingGameAction = null;
    this.assistant = initializeAssistant(() => this.getStateForAssistant());

    this.assistant.on('data', (event) => {
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

  componentDidMount() {}

  getStateForAssistant() {
    const state = {
      item_selector: {
        items: this.state.notes.map(({ id, title }, index) => ({
          number: index + 1,
          id,
          title,
        })),
        ignored_words: [
          'добавить','установить','запиши','поставь','закинь','напомнить',
          'удалить', 'удали',
          'выполни', 'выполнил', 'сделал'
        ],
      },
    };
    return state;
  }

  dispatchAssistantAction(action) {
    if (!action || !action.type) {
      return;
    }
    
    if (action.type === 'trainer_answer' && this.state.currentPage !== 'trainer') {
      console.log('Ignoring trainer_answer - not on trainer page');
      return;
    }
    
    if (action.type === 'trainer_answer' && this.trainerPageRef && this.trainerPageRef.current) {
      if (!this.trainerPageRef.current.state.isActive) {
        console.log('Ignoring trainer_answer - training not active');
        return;
      }
    }
    
    switch (action.type) {
      case 'select_section':
        return this.select_section(action);
        
      case 'select_game':
        console.log('select_game received:', action.game);
        if (this.trainerPageRef && this.trainerPageRef.current) {
          this.trainerPageRef.current.selectGame(action.game);
        } else {
          this.pendingGameAction = action;
        }
        return;
        
      case 'select_another_game':
        if (this.trainerPageRef && this.trainerPageRef.current) {
          this.trainerPageRef.current.selectAnotherGame();
        }
        return;
        
      case 'start_training':
        if (this.trainerPageRef && this.trainerPageRef.current) {
          this.trainerPageRef.current.startTraining();
        } else {
          this.pendingAction = action;
        }
        return;
        
      case 'trainer_answer':
        let answerValue = action.answer || action.value || action.text;
        
        if (action.parameters && action.parameters.value) {
          answerValue = action.parameters.value;
        }
        
        if (action.smart_app_data && action.smart_app_data.answer) {
          answerValue = action.smart_app_data.answer;
        }
        
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
        return null;
    }
  }

  _send_action_value(action_id, value) {
    const data = {
      action: {
        action_id: action_id,
        parameters: {
          value: value,
        },
      },
    };
    const unsubscribe = this.assistant.sendData(data, (data) => {
      unsubscribe();
    });
  }

  select_section(action) {
  if (action.section === 'trainer') {
    this.setState({ currentPage: 'trainer' }, () => {
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
      pendingAction: null,
      pendingGameAction: null
    });
  }
}

  render() {
    if (this.state.currentPage === 'main') {
      return (
        <MainMenu 
          onSelectTrainer={() => {
            this.setState({ currentPage: 'trainer' });
          }}
          onSelectNotes={() => {
            this.setState({ currentPage: 'notes' });
          }}
        />
      );
    }

    if (this.state.currentPage === 'trainer') {
      return (
        <TrainerPage 
          ref={this.trainerPageRef}
          onBack={() => {
            this.setState({ currentPage: 'main' });
          }}
          assistant={this.assistant}    
        />
      );
    }

    if (this.state.currentPage === 'notes') {
      return (
        <>
          <div style={{ textAlign: 'center', margin: '10px 0' }}>
            <button 
              onClick={() => {
                this.setState({ currentPage: 'main' });
              }}
              style={{ padding: '8px 16px', background: '#888', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              На главную
            </button>
          </div>
          
        </>
      );
    }
    
    return null;
  }
}