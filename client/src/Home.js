import axios from "axios";
import { useContext, useEffect, useState } from "react";
import UserContext from "./UserContext";

function Home() {
  const userInfo= useContext(UserContext);
  const [inputVal, setInputVal] = useState('');
  const [todos,setTodos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/todos', {withCredentials:true})
      .then(response => {
        setTodos(response.data);
      })
  }, []);

  if(!userInfo.email){
    return `MARIO TODO.`;
  }

  function addTodo(e) {
    e.preventDefault();
    axios.put('http://localhost:4000/todos', {text:inputVal}, {withCredentials:true})
    .then(response => {
      setTodos([...todos, response.data]);
      setInputVal('');
    })

}

  function updateTodo(todo){
    const data = {id:todo._id,done:!todo.done};
    axios.post('http://localhost:4000/todos', data, {withCredentials:true})
    .then(() => {
      const newTodos = todos.map(t => {
        if (t._id === todo._id) {
          t.done = !t.done;
        }
        return t;
      });
      setTodos([...newTodos]);
    });
}



function deleteTodo(todoId) {
  axios.delete(`http://localhost:4000/todos/${todoId}`, { withCredentials: true })
    .then(() => {
      const updatedTodos = todos.filter(todo => todo._id !== todoId);
      setTodos(updatedTodos);
    })
    .catch(error => {
      console.error(error);
    });
}



  return <div>
    <form onSubmit={e => addTodo(e)}>
    <input placeholder={'What do you want to do?'}
            className="text-field" 
             value={inputVal}
             onChange={e => setInputVal(e.target.value)}/>
    </form>

    <ul className="todo-field">
      <li className="todos">
      {todos.map(todo => (
          <li key={todo._id}>
            <input
              type="checkbox"
              checked={todo.done}
              onClick={() => updateTodo(todo)}
            />

            {todo.done ? <del>{todo.text}</del> : todo.text}
            <button className="delete-btn" onClick={() => deleteTodo(todo._id)}>
            <svg className="delete" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
              <path  d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
              </svg>
            </button>
            
        </li>
      ))}

      </li>
    </ul>
  </div>
}

export default Home;