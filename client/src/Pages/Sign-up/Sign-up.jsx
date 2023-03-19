import React, { useState, useEffect } from 'react';
import './Signup.css';
import LoginPage from './LoginPage';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [isInvalidUsername, setIsInvalidUsername] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);


  const checkIsValidUsername = () => {
    if (isInvalidUsername) {
      return(<div style={{color: "#f85956" }}>USERNAME <i id={"invalidMessage"}>- Username must be at least 5 characters long</i></div>);
    } else {
      return(<div>USERNAME</div>);
    }
  }

  const checkIsValidPassword = () => {
    if (isInvalidPassword) {
      return(<div style={{color: "#f85956"}}>PASSWORD <i id={"invalidMessage"}>- *password must be at least 8 characters long</i></div>);
    } else {
      return(<div>PASSWORD</div>);
    }
  }

  const checkIsValidEmail = () => {
    if (isInvalidEmail) {
      return(<div style={{color: "#f85956"}}>EMAIL <i id={"invalidMessage"}>- Email address is invalid</i></div>);
    } else {
      return(<div style={{size: 8}}>PASSWORD</div>);
    }
  }


  // ======================= FUNCTIONS =========================
  // USERNAME VALIDATION METHOD
  function validateUsername() {
    // checking if username is of a valid length (USERNAME CANNOT BE SHORTER THAN 5 AND LONGER THAN 32 CHARACTERS LONG)
    if(name.length < 5 || name.length > 32) {
    return false;
    }

    // checking if username only contains valid characters (alphanumeric and special characters)
    for(let i=0; i<name.length; i++) {
        let ASCIICode = name.charCodeAt(i);
        
        if (!(ASCIICode >= 33 && ASCIICode <= 126)) {
            return false;
        }
    }

    return true;
  }

  // PASSWORD VALIDATION METHOD
  function validatePassword() {
    // checking if password is of valid length (PASSWORD CANNOT BE LONGER SHORTER THAN 8 AND LONGER THAN 64 CHARACTERS)
    if(password.length < 8 || password.length > 64) {
        // password length of invalid size
        return false;
    }

    // checking if password only contains valid characters (alphanumeric and special characters)
    for(let i=0; i<password.length; i++) {
        let ASCIICode = password.charCodeAt(i);
        
        if (!(ASCIICode >= 33 && ASCIICode <= 126)) {
            console.log("char not valid: " + ASCIICode);
            return false;
        }
    }

    return true;  // password valid
  }


  // EMAIL VALIDATION METHOD
  function validateEmail() {
      // Checking if email matches regular expression
      return (email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ));
  }


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
    let valid = true;

    if (!validateUsername()) {
      // username not valid
      console.log("username invalid");
      setIsInvalidUsername(true);
      valid = false;
    } else {
      setIsInvalidUsername(false);
    }

    if (!validatePassword()) {
      // password not valid
      console.log("password invalid");
      setIsInvalidPassword(true);
      valid = false;
    } else {
      setIsInvalidUsername(false);
    }

    if (!validateEmail()) {
      // email not valid
      console.log("email invalid");
      setIsInvalidEmail(true);
    } else {
      setIsInvalidUsername(false);
    }

    if (termsAccepted) {
      if (valid) {
        // API Call to create account
        fetch(`/api/createAccount?username=${ name }&password=${ password }&email=${ email }&privacy_policy=1&terms_conditions=1`)
          .then(res => res.json())
          .then(status => {
            console.log(status);
            window.location.href = "/#/AccountPage";
          });
      }
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

    return(
    <>
    <div className="Signup">
      <div className="container">
        <form onSubmit={handleSubmit} className="forme" id="signup-form">
          <h1>SIGN UP</h1>
          <div className="input-group">
            <label htmlFor="name">{ checkIsValidUsername() }</label>
            <input  
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">{ checkIsValidEmail() }</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
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

            <label htmlFor="termsAccepted">
              I accept the &nbsp;<a href="/#/TermsandConditions">Terms and Conditions</a> &nbsp;and&nbsp; <a href="/#/PrivacyPolicy">Privacy Policy</a>.
            </label>
            <div className="input-group">
            <input
              type="checkbox"
              id="termsAccepted"
              checked={termsAccepted}
              onChange={handleTermsAccepted}
            />
          </div>
          <button type="submit">Sign Up</button>
          <p>Already have an account <a href="/#/Log-in"> <button type="button" onClick={handleLoginClick}>Log In</button> </a></p>
          
        </form>

      </div>  
    </div>
  </>
  )
}

export default SignUpPage;
