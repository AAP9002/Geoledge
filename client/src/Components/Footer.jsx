import React from 'react';
import './Footer.css';
/*import { Button } from './signupButton';*/
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='big'>
    <div className='footer-container'>
      <div class='footer-links'>
        <div className='footer-link-wrapper '>
          <div class='footer-link-items'>
            <Link to='/TermsandConditions'>Terms & Conditions</Link>
          <div class='footer-link-items'>
            <Link to='/PrivacyPolicy'>Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}

export default Footer;