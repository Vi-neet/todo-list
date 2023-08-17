import axios from "axios";
import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import './App.css';
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import UserContext from "./UserContext";

function App() {
  const [email,setEmail] = useState('');

  useEffect(() => {
    axios.get('http://localhost:4000/user', {withCredentials:true})
      .then(response => {
        setEmail(response.data.email);
      });
  }, []);

  function logout() {
    axios.post('http://localhost:4000/logout', {}, {withCredentials:true})
      .then(() => setEmail(''));
  }

  return (
    <UserContext.Provider value={{email,setEmail}}>
      <BrowserRouter>
        <nav className="navbar">
          <Link to={'/'} className="home">Home</Link>
          {!email && (
            <>
              <Link to={'/login'} className="login">Login</Link>
              <Link to={'/register'} className="register">Register</Link>
            </>
          )}
          {!!email && (
            <a className="logout" onClick={e => {e.preventDefault();logout();}}>Logout</a>
          )}
        </nav>
        <main>
          <Routes>
            <Route path={'/'} Component={Home} />
            <Route path={'/register'} Component={Register} />
            <Route path={'/login'} Component={Login} />
          </Routes>
        </main>

      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
