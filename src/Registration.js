import React, { useState } from 'react';

const Registration = ({ register })=> {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

      const _register = async (ev) => {
        ev.preventDefault();

        const user = {
            username,
            email,
            password,
            is_admin: false
        };
      
        try {
          await register(user);
          setRegistrationSuccess(true);
        } catch (error) {
          console.log('Registration failed:', error);
        }
        setUsername('');
        setEmail('');
        setPassword('');
      };

    return(
      <div>
        <h2>Create Account</h2>
        { registrationSuccess ? (
          <div>
            <p>Registration successful! Please log in.</p> 
          </div>
        ) : (
        <form onSubmit={ _register }>
            <input
                type='text'
                placeholder='username'
                value={ username }
                onChange={ ev => setUsername(ev.target.value)}
            />
            <input
                type='email'
                placeholder='email'
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
            />
            <input
                type='password'
                placeholder='password'
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
            />
            <button type='submit' disabled={!username || !email || !password}>Create Account</button>
        </form>
        )}
      </div>   
    );
};

export default Registration;