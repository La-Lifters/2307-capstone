import React, { useState, } from 'react';
import Registration from './Registration';
import { useNavigate } from 'react-router-dom';

const Login = ({ login })=> {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate=useNavigate();

  const _login = async(ev)=> {
    ev.preventDefault();
    setError('');
    try {
      await login({ username, password });
      navigate('/products');
     
    }
    catch(ex){
      console.log(ex.response.data.message);
      setError('Invalid Username or Password');
    }
  }
  return (
    <div className='login-form'>
      <h2>Login</h2>
      <h2>{ error ? error : ''}</h2>
      <form onSubmit={ _login }>
        <input
          placeholder='username'
          value={ username }
          onChange={ ev => setUsername(ev.target.value)}
        />
        <input
          type='password'
          placeholder='password'
          value={ password }
          onChange={ ev => setPassword(ev.target.value)}
        />
        <button disabled={!username || !password}>Login</button>
      </form>
      <br/>
      <br/>
      <Registration/>
    </div>
  );
}

export default Login;
