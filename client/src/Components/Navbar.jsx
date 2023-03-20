import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Button } from './signupButton';
import './Navbar.css'


function Navbar() {
  const [click, setClick] = useState(false)

  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);

  const closeMobileMenu = () => setClick(false)

  const [isLoggedIn, setIsLoggedIn] = useState(button && <Button buttonStyle='btn--outline'>SIGN UP / LOG IN</Button>);

  const showButton = () => {
    if(window.innerWidth <= 960){
      setButton(false);

    } else {
      setButton(true);
    }
  };


  useEffect(() => {
    fetch('/api/checkLoggedIn').then(res => res.json()).then(res => {
      console.log(res);
      if (res.status == "User is logged in.") {
        // Displaying the username and logout button
        setIsLoggedIn(button && <Button buttonStyle='btn--outline'>LOG OUT</Button>);
      } else {
        // Displaying sign up/log in button
        setIsLoggedIn(button && <Button buttonStyle='btn--outline'>SIGN UP / LOG IN</Button>);
      }
    });
  }, []);


  window.addEventListener('resize', showButton);
  return (
    <>
        <nav className='navbar'>
          <div className='navbar-container'>
            <div className="menu-icon" onClick={handleClick}>
              <i className={click ? 'fa-solid fa-xmark' : 'fas fa-bars'}></i>
            </div>
            <ul className={click ? 'nav-menu active' : 'nav-menu'}>
              <li className='nav-item'>
                <Link to='/Home' className='nav-links' onClick={closeMobileMenu}>
                  Home
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/Leaderboard' className='nav-links' onClick={closeMobileMenu}>
                  Leaderboards
                </Link>
              </li> 
              <li className='nav-item'>
                <Link to='/AccountPage' className='nav-links' onClick={closeMobileMenu}>
                  Account
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/join-lobby' className='nav-links' onClick={closeMobileMenu}>
                  Join Lobby
                </Link>
              </li>              
              <li className='nav-item'>
                <Link to='/Sign-up' className='nav-links-mobile' onClick={closeMobileMenu}>
                  Sign Up
                </Link>
              </li>
              <div className='nav-item'>
            { isLoggedIn };
            </div>
            </ul>
            
          </div>  
        </nav>
    </>
  )
}

export default Navbar