import React, { useEffect, useState } from 'react';
import './TaskManager.css';
import PopUp from './popUp';
import { useDispatch } from 'react-redux';
import { removeTodo } from '../redux/todoSlice';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
  TASK: 'task',
};

function TaskManager({data}) {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState(data);

  useEffect(() => {
    setTasks(data);
  }, [data]);

  const moveTask = (id, status, index) => {
    try {
      setTasks(prevTasks => {
        const task = prevTasks.find(task => task.id === id);
        const updatedTasks = prevTasks.filter(task => task.id !== id);
        const updatedTask = { ...task, text: { ...task.text, status } };
        updatedTasks.splice(index, 0, updatedTask);
        return updatedTasks;
      });
      
      onTaskMove(id, status);
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };

  const onTaskMove = (id, status) => {
    console.log(`Task ${id} moved to ${status}`);
    // Add any additional logic here
  };

  const todoTasks = tasks.filter(task => task?.text?.status === 'todo');
  const inProgressTasks = tasks.filter(task => task?.text?.status === 'inprogress');
  const completedTasks = tasks.filter(task => task?.text?.status === 'completed'); 
  const openModal = () => setShowModal(true);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <header className="app-header">
          <h1>Task Manager</h1>
          <button className="create-task-btn" onClick={openModal}>Create Task</button>
        </header>
        
        <div className="dashboard">
          <Column title="To-Do" tasks={todoTasks} moveTask={moveTask} status="todo" />
          <Column title="In Progress" tasks={inProgressTasks} moveTask={moveTask} status="inprogress" />
          <Column title="Completed" tasks={completedTasks} moveTask={moveTask} status="completed" />
        </div>

        <PopUp setShowModal={setShowModal} showModal={showModal}/>
      </div>
    </DndProvider>
  );
}

function Column({ title, tasks, moveTask, status }) {
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover: (item, monitor) => {
      const dragIndex = item.index;
      const hoverIndex = tasks.findIndex(task => task.id === item.id);

      if (dragIndex === hoverIndex) {
        return;
      }

      moveTask(item.id, status, hoverIndex);
      item.index = hoverIndex;
    },
  });

  return (
    <div className="column" ref={drop}>
      <h2 className="column-title">{title}</h2>
      <div className="task-list">
        {tasks.map((task, index) => (
          <TaskCard key={task.id} task={task} index={index} moveTask={moveTask} status={status} />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, index, moveTask, status }) {
  const { id, title, description, dueDate, priority } = task?.text;
  const dispatch = useDispatch();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id: task.id, index, status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover: (item, monitor) => {
      if (item.id !== id) {
        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) {
          return;
        }

        moveTask(item.id, status, hoverIndex);
        item.index = hoverIndex;
      }
    },
  });

  return (
    <div ref={node => drag(drop(node))} className={`task-card priority-${priority}`} style={{ opacity: isDragging ? 0.5 : 1 }}>
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
