import React, { useEffect, useState } from 'react';
import './TaskManager.css';
import PopUp from './popUp';
import { Draggable } from 'react-draggable';
import { useDispatch } from 'react-redux';
import { removeTodo } from '../redux/todoSlice';


function TaskManager({data}) {
    console.log(data,"test")
  const [showModal, setShowModal] = useState(false);

useEffect=(()=>{
},[data])



  const todoTasks = data.filter(task => task?.text?.status === 'todo');
  const inProgressTasks = data.filter(task => task?.text?.status === 'inprogress');
  const completedTasks = data.filter(task => task?.text?.status === 'completed');
  const openModal = () => setShowModal(true);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Manager</h1>
        <button className="create-task-btn" onClick={openModal}>Create Task</button>
      </header>
      
      <div className="dashboard">
        <div className="column">
          <h2 className="column-title">To-Do</h2>
          <div className="task-list">
            {todoTasks.map(task => (
              <TaskCard key={task.id} task={task} onDelete={()=>console.log("delete")} />
            ))}
          </div>
        </div>
        
        <div className="column">
          <h2 className="column-title">In Progress</h2>
          <div className="task-list">
            {inProgressTasks.map(task => (
              <TaskCard key={task.id} task={task} onDelete={()=>console.log("delete")} />
            ))}
          </div>
        </div>
        
        <div className="column">
          <h2 className="column-title">Completed</h2>
          <div className="task-list">
            {completedTasks.map(task => (
              <TaskCard key={task.id} task={task} onDelete={()=>console.log("delete")} />
            ))}
          </div>
        </div>
      </div>

    <PopUp setShowModal={setShowModal} showModal={showModal}/>
    </div>
  );
}

function TaskCard({ task, onDelete }) {
  const { id, title, description, dueDate, priority } = task?.text;
  const dispatch = useDispatch();
  console.log(id,task?.id)
  return (
    
    <div className={`task-card priority-${priority}`}>
      <h3>{title}</h3>
      <p className="task-description">{description}</p>
      {dueDate && <div className="task-due-date">Due: {dueDate}</div>}
      <div className="task-footer">
        <div className={`priority-tag priority-${priority}`}>{priority}</div>
        <button className="delete-btn" onClick={() => dispatch(removeTodo(task?.id))}>Delete</button>
      </div>
    </div>
  );
}

  

export default TaskManager;
