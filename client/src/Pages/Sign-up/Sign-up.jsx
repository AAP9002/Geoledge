import React, { useState } from 'react';
import './Signup.css';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log('Name:', name, 'Email:', email, 'Password:', password);

    // API Call to create accuount
    fetch(`/api/createAccount?username=${ name }&password=${ password }&email=${ email }&privacy_policy=1&terms_conditions=1`).then(res => res.json()).then(status => {
      console.log(status);
    });
  };

  return (
    <div className= "Signup">
    <div className="container">
      <form onSubmit={handleSubmit} className="form" id="signup-form">
        <h1>Sign Up</h1>
        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">Sign Up</button>
        <p>Already have an account? <a href="Sign_up">Log In</a></p>
      </form>
    </div>
    </div>
  );
};

export default SignUpPage;
