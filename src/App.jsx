import React from 'react';
import { createAssistant, createSmartappDebugger } from '@salutejs/client';

import './App.css';
import { TaskList } from './pages/TaskList';
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
    
    switch (action.type) {
      case 'add_note':
        return this.add_note(action);
        
      case 'done_note':
        return this.done_note(action);
        
      case 'delete_note':
        return this.delete_note(action);
        
      case 'delete_all_notes':
        return this.delete_all_notes(action);
        
      case 'select_section':
        return this.select_section(action);
        
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

  add_note(action) {
    let noteText = action.note;
    
    if (Array.isArray(noteText) && noteText.length > 0) {
      const firstItem = noteText[0];
      if (firstItem && firstItem.text) {
        noteText = firstItem.text;
      } else if (typeof firstItem === 'string') {
        noteText = firstItem;
      } else {
        noteText = String(firstItem);
      }
    }
    
    if (noteText && typeof noteText === 'object' && !Array.isArray(noteText)) {
      if (noteText.text) {
        noteText = noteText.text;
      } else if (noteText.value) {
        noteText = noteText.value;
      } else {
        noteText = JSON.stringify(noteText);
      }
    }
    
    noteText = String(noteText || '');
    
    noteText = noteText
      .replace(/^(добавь|запиши|поставь|закинь|напомнить)\s*/i, '')
      .replace(/\s+(заметку|задачу|задание|напоминание)$/i, '')
      .trim();
    
    if (!noteText || noteText === 'undefined' || noteText === 'null') {
      return;
    }
    
    const newNote = {
      id: Math.random().toString(36).substring(7),
      title: noteText,
      completed: false,
    };
    
    this.setState({
      notes: [...this.state.notes, newNote],
    });
  }
  
  done_note(action) {
    this.setState({
      notes: this.state.notes.map((note) =>
        note.id === action.id ? { ...note, completed: !note.completed } : note
      ),
    });
  }

  delete_all_notes(action) {
    this.setState({
      notes: [],
    });
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

  play_done_note(id) {
    const completed = this.state.notes.find(({ id }) => id)?.completed;
    if (!completed) {
      const texts = ['Молодец!', 'Красавчик!', 'Супер!'];
      const idx = (Math.random() * texts.length) | 0;
      this._send_action_value('done', texts[idx]);
    }
  }

  delete_note(action) {
    this.setState({
      notes: this.state.notes.filter(({ id }) => id !== action.id),
    });
  }

  select_section(action) {
    if (action.section === 'trainer') {
      this.setState({ currentPage: 'trainer' }, () => {
        if (this.pendingAction && this.pendingAction.type === 'start_training') {
          if (this.trainerPageRef && this.trainerPageRef.current) {
            this.trainerPageRef.current.startTraining();
          }
          this.pendingAction = null;
        }
      });
    } else if (action.section === 'notes') {
      this.setState({ currentPage: 'notes' });
    } else if (action.section === 'main') {
      this.setState({ currentPage: 'main' });
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
          <TaskList
            items={this.state.notes}
            onAdd={(note) => {
              this.add_note({ type: 'add_note', note });
            }}
            onDone={(note) => {
              this.play_done_note(note.id);
              this.done_note({ type: 'done_note', id: note.id });
            }}
            onDeleteAll={() => {
              this.delete_all_notes({type: 'delete_all_notes'});
            }}
          />
        </>
      );
    }
    
    return null;
  }
}