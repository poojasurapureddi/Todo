import { use, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { setTodo } from '../redux/todoSlice';
import TaskManager from './card';

function TaskContainer() {
      const dispatch = useDispatch();
  
  const todos = useSelector((state) => state.todos.todos);
  console.log(todos,"todos")
  useEffect(() => {
    (async()=>{

      const response = await fetch(
        `https://dnlpdmakrjidsefocpba.supabase.co/rest/v1/Todo`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            apikey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRubHBkbWFrcmppZHNlZm9jcGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NDMwNzgsImV4cCI6MjA1ODAxOTA3OH0.ArP_L3QsC3dIOyioxVk16gc-OuXEN7-V0l6787fxt9s"
  
  
  
          },
    });
    const data = await response.json();
    console.log(data,"data");
    dispatch(setTodo(data));
    console.log(response,"response");
    })()
  }
  , []);
  useEffect(()=>{
console.log(todos,"todos44")
  },[todos])
    return (
 <div><TaskManager data={todos}/></div>
  );
}

export default TaskContainer;
