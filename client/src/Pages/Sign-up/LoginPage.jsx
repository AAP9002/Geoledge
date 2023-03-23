import React, { useState } from 'react';
import './Login.css';
import SignUpPage from './Sign-up';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSignUpPage, setShowSignUpPage] = useState(false);
  const [isInvalidUsername, setIsInvalidUsername] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);

  const checkIsValidUsername = () => {
    if (isInvalidUsername) {
      return(<div style={{color: "#f85956" }}>USERNAME <i id={"invalidMessage"}>- Username or password was invalid</i></div>);
    } else {
      return(<div style={{size: 8}}>USERNAME</div>);
    }
  }

  const checkIsValidPassword = () => {
    if (isInvalidPassword) {
      return(<div style={{color: "#f85956"}}>PASSWORD <i id={"invalidMessage"}>- Username or password was invalid</i></div>);
    } else {
      return(<div style={{size: 8}}>PASSWORD</div>);
    }
  }

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
      setIsInvalidUsername(true);
      setIsInvalidPassword(true);

    } else if (password.length === 0) {
      // Password field is empty
      setIsInvalidUsername(true);
      setIsInvalidPassword(true);

    } else {
      // Username or password field are not empty. Sending login request to server
      fetch(`/api/login?username=${ username }&password=${ password }`)
        .then(res => res.json())
        .then(res => {
          if (res.status == "Successfully logged in") {
            window.location.href = "/#/Home";
            window.location.reload();
          } else {
            setIsInvalidUsername(true);
            setIsInvalidPassword(true);
          }
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
        <form onSubmit={ handleSubmit } className="formh" id="login-form">
          <h1>LOGIN</h1>
          <div className="input-group">
            <label htmlFor="username">{ checkIsValidUsername() }</label>
            <input
              type="text"
              id="username"
              value={ username }
              onChange={ handleUsernameChange }
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">{ checkIsValidPassword() }</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <button type="submit">Login</button>
          <div className='pe'>
          <p>Don't have an account? <a href="/#/Sign-up"><button type="button" onClick={handleSignUpClick}>Sign up</button></a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
