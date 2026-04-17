import React from 'react';
import {AddTask} from '../components/AddTask';
import {TaskItemList} from '../components/TaskItemList';


export const TaskList = (props) => {
  const { items, onAdd, onDone, onDeleteAll } = props;
  return (
    <main className="container">
      <AddTask
        onAdd = { onAdd }
      />

      {items.length > 0 && (
        <button 
          onClick={onDeleteAll}
          className="delete-all-btn"
        >
          Удалить все задачи
        </button>
      )}


      <TaskItemList
        items  = { items }
        onDone = { onDone }
      />
    </main>
  )
}
