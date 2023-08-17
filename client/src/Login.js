import axios from 'axios';
import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from "./UserContext";

function Login() {

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [loginError,setLoginError] = useState(false);
  const [navigate,setNavigate] = useState(false);

  const user = useContext(UserContext);

  function loginUser(e) {
    e.preventDefault();

    const data = {email,password};
    axios.post('http://localhost:4000/login', data, {withCredentials:true})
      .then(response => {
        user.setEmail(response.data.email);
        setEmail('');
        setPassword('');
        setLoginError(false);
        setNavigate(true);
      })
      .catch(() => {
        setLoginError(true);
      });
  }
  if (navigate) {
    return <Navigate to={'/'} />
  }

  return (
      <form action="" onSubmit={e => loginUser(e)}>
      {loginError && (
        <div>LOGIN ERROR! WRONG EMAIL OR PASSWORD!</div>
      )}
      <input className="text-field" type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)}/><br />
      <input className="text-field" type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)}/><br />
      <button className='btn' type="submit">login</button>
    </form>

  );
}

export default Login;