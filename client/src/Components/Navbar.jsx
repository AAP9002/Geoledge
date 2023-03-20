import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Button } from './signupButton';
import { LogoutButton } from './logoutButton';

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
        setIsLoggedIn(<LogoutButton buttonStyle='btn--outline' onClick={logout_of_account}>LOG OUT</LogoutButton>);
      } else {
        // Displaying sign up/log in button
        setIsLoggedIn(<Button buttonStyle='btn--outline'>SIGN UP / LOG IN</Button>);
      }
    });
  }, []);

  function logout_of_account() {
    document.cookie = "JWT"+'=; Max-Age=-99999999;';
    window.location.reload();
  }


  window.addEventListener('resize', showButton);
  return (
    <>
        <nav className='navbar'>
          <div className='navbar-container'>
            <div className="menu-icon" onClick={handleClick}>
              <i style={{color:"white"}} className={click ? 'fa-solid fa-xmark' : 'fas fa-bars'}></i>
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
              <div className='nav-item'>
                { isLoggedIn };
              </div>
            </ul>
            
          </div>  
        </nav>
        {/* <audio autoplay src="https://ld47.fds.im/42fa232a71ad99a4b312d746d656c54c.mp3" type="audio/mpeg" loop="loop"></audio> */}
    </>
  )
}

export default Navbar