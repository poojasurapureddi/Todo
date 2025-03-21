import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: [],
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodo: (state, action) => {
      state.todos = action.payload.map(todo => ({
        id: todo.id,
        text: {
          title: todo.description, // Adjust this if there's a separate title
          description: todo.description,
          dueDate: todo.due_date,
          priority: todo.priority || 'Normal', // Default priority if not provided
          status: todo.status || 'Todo'
        },
        completed: todo.status === 'completed'
      }));
    },    
    addTodo: (state, action) => {
      state.todos.push({
        id: Date.now(),
        text: {
          title: action.payload.title,
          description: action.payload.description,
          dueDate: action.payload.dueDate,
          priority: action.payload.priority,
          status: action.payload.status || 'todo'
        },
        completed: false
      });
    },
    removeTodo: (state, action) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    toggleTodo: (state, action) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    updateTodoStatus: (state, action) => {
      const { id, status } = action.payload;
      const todo = state.todos.find(todo => todo.id === id);
      if (todo) {
        todo.text.status = status;
      }
    },
    

  },
});

export const { addTodo, removeTodo, toggleTodo,updateTodoStatus,setTodo } = todoSlice.actions;
export default todoSlice.reducer;
