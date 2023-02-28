import React, { useState } from 'react';
import './Login.css';
import SignUpPage from './Sign-up';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignUpPage, setShowSignUpPage] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log('Email:', email, 'Password:', password);
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
        <form onSubmit={handleSubmit} className="form" id="login-form">
          <h1>LOGIN</h1>
          <div className="input-group">
            <label htmlFor="email">EMAIL</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
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
          <p>Don't have an account? <button type="button" onClick={handleSignUpClick}>Sign up</button></p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
