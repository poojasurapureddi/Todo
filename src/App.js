import { use, useEffect } from 'react';
import './App.css';
import TaskManager from './components/card';
import { useSelector, useDispatch } from "react-redux";
import TaskContainer from './components/taskcontainer';

function App() {

    return (
 <div><TaskContainer /></div>
  );
}

export default App;
