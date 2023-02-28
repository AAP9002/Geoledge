import React, { useState } from 'react';
import './Signup.css';
import LoginPage from './LoginPage';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false); 

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleTermsAccepted = (event) => {
    setTermsAccepted(event.target.checked);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log('Name:', name, 'Email:', email, 'Password:', password, 'Terms Accepted:', termsAccepted);

    if (termsAccepted) {
      // API Call to create account
      fetch(`/api/createAccount?username=${ name }&password=${ password }&email=${ email }&privacy_policy=1&terms_conditions=1`)
        .then(res => res.json())
        .then(status => {
          console.log(status);
        });
    } else {
      alert('Please accept the terms and conditions to continue.');
    }
  };

  const handleLoginClick = () => {
    setShowLoginPage(true);
  };

  if (showLoginPage) {
    return <LoginPage />;
  }

  return (
    <div className="Signup">
      <div className="container">
        <form onSubmit={handleSubmit} className="form" id="signup-form">
          <h1>SIGN UP</h1>
          <div className="input-group">
            <label htmlFor="name">USERNAME</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
            />
          </div>
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
          <div className="input-group">
            <input
              type="checkbox"
              id="termsAccepted"
              checked={termsAccepted}
              onChange={handleTermsAccepted}
            />
            <label htmlFor="termsAccepted">
              I accept the <a href="TermsandConditions">Terms and Conditions</a> and <a href="PrivacyPolicy">Privacy Policy</a>.
            </label>
          </div>
          <button type="submit">Sign Up</button>
          <p>Already have an account <a href="Log-in"> <button type="button" onClick={handleLoginClick}>Log In</button> </a></p>
        </form>
      </div>  
    </div>
  );
};

export default SignUpPage;
