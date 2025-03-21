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
function TaskManager({ data }) {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState(data);
  useEffect(() => {
    setTasks(data);
    console.log(data, "data55845")
  }, [data]);

  const moveTask = async(id, newStatus, newIndex) => {
    console.log(id,newStatus,newIndex,"id,newStatus,newIndex")
     fetch(
      `https://dnlpdmakrjidsefocpba.supabase.co/rest/v1/Todo?id=eq.${id}
`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRubHBkbWFrcmppZHNlZm9jcGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NDMwNzgsImV4cCI6MjA1ODAxOTA3OH0.ArP_L3QsC3dIOyioxVk16gc-OuXEN7-V0l6787fxt9s"



        },
        body: JSON.stringify({

          "status":newStatus
        })
        
  });
    setTasks(prevTasks => {
      let taskToMove = prevTasks.find(task => task.id === id);
      if (!taskToMove) return prevTasks;
      let updatedTasks = prevTasks.filter(task => task.id !== id);
      if (taskToMove.text.status !== newStatus) {
        taskToMove = { ...taskToMove, text: { ...taskToMove.text, status: newStatus } };
      }
      updatedTasks.splice(newIndex, 0, taskToMove);
      return updatedTasks;
    });
  };

  // const onTaskMove = (id, status) => {
  //   console.log(`Task ${id} moved to ${status}`);
  // };

  const todoTasks = tasks.filter(task => task?.text?.status === 'Todo');
  const inProgressTasks = tasks.filter(task => task?.text?.status === 'In Progress');
  const completedTasks = tasks.filter(task => task?.text?.status === 'Completed');
  const openModal = () => setShowModal(true);


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <header className="app-header">
          <h1>Task Manager</h1>
          <button className="create-task-btn" onClick={openModal}>Create Task</button>
        </header>

        <div className="dashboard">
          <Column title="To-Do" tasks={todoTasks} moveTask={moveTask} status="Todo" />
          <Column title="In Progress" tasks={inProgressTasks} moveTask={moveTask} status="In Progress" />
          <Column title="Completed" tasks={completedTasks} moveTask={moveTask} status="Completed" />
        </div>

        <PopUp setShowModal={setShowModal} showModal={showModal} />
      </div>
    </DndProvider>
  );
}

function Column({ title, tasks, moveTask, status }) {
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover: (draggedItem, monitor) => {
      const dragIndex = draggedItem.index;
      const hoverIndex = tasks.findIndex(task => task.id === draggedItem.id);

      if (dragIndex === hoverIndex) return;

      moveTask(draggedItem.id, status, hoverIndex);
      draggedItem.index = hoverIndex; 
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
