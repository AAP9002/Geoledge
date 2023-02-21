import React from 'react';
import "./Home.css";
import { Link } from 'react-router-dom';


const About = () => {
  return (
    <div>
          <div>
            <p class='home'>
              WELCOME TO THE HOMEPAGE
              <li className='play'>
                <Link to='/Play' className='links'>
                Play
                </Link>
              </li>
            </p>
          </div>
    </div>
 
  );
};

export default About;