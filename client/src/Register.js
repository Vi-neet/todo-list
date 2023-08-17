import axios from 'axios';
import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from "./UserContext";

function Register() {

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [navigate,setNavigate] = useState(false);

  const user = useContext(UserContext);

  function registerUser(e) {
    e.preventDefault();

    const data = {email,password};
    axios.post('http://localhost:4000/register', data, {withCredentials:true})
      .then(response => {
        user.setEmail(response.data.email);
        setEmail('');
        setPassword('');
        setNavigate(true);
      });
  }

  if (navigate) {
    return <Navigate to={'/'} />
  }

  return (
      <form action="" onSubmit={e => registerUser(e)}>
        <input className="text-field"  type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)}/><br />
        <input className="text-field"  type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)}/><br />
        <button className='btn' type="submit">register</button>
      </form>
  );
}

export default Register;