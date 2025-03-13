import './App.css';
import TaskManager from './components/card';
import { useSelector, useDispatch } from "react-redux";
function App() {
  const todos = useSelector((state) => state.todos.todos);
  console.log(todos,"todos")
    return (
 <div><TaskManager data={todos}/></div>
  );
}

export default App;
