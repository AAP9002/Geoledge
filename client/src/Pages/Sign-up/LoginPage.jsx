import React, { useState } from 'react';
import './Login.css';
import SignUpPage from './Sign-up';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSignUpPage, setShowSignUpPage] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Checking if username and password fields are empty
    if (username.length === 0) {
      // Username field is empty

    } else if (password.length === 0) {
      // Password field is empty

    } else {
      // Username or password field are not empty. Sending login request to server
      fetch(`/api/login?username=${ username }&password=${ password }`)
        .then(res => res.json())
        .then(status => {
          console.log(status);
          window.location.href = "/#/AccountPage";
        });
    }
  };

  const handleSignUpClick = () => {
    setShowSignUpPage(true);
  };

  if (showSignUpPage) {
    return <SignUpPage />;
  }

  return (
    <div className="Login">
      <div className="container">
        <form onSubmit={ handleSubmit } className="form" id="login-form">
          <h1>LOGIN</h1>
          <div className="input-group">
            <label htmlFor="username">USERNAME</label>
            <input
              type="text"
              id="username"
              value={ username }
              onChange={ handleUsernameChange }
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">PASSWORD</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <button type="submit">Login</button>
          <p>Don't have an account? <a href="/#/Sign-up"><button type="button" onClick={handleSignUpClick}>Sign up</button></a></p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
