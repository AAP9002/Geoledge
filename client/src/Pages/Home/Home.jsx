import React from 'react';
import "./Home.css";


const About = () => {
  return (
  <div>
    <div>

    </div>
    <div className ="column">
      <div className ="top">
      <div className ="row-md-8">
        <div className='home-headers'>
        <h1>GEOLEDGE</h1>
        <h2>Prepared to test your geographical knowledge?</h2>
        </div>
        <div className = "btns">
        <a className ="styledbutton" href='./#/Play'> Host Game</a>
        <a className ="styledbutton" href='./#/Play'> Play Online</a>
        <a className ="styledbutton" href='./#/join-lobby'> Join Game</a>
        </div>
      </div>
      </div>
      <div className = "bottom">
      <div className ="row-md-12">
        <h1>What Is Geoledge?</h1>
        <p>Geoledge is an online quiz-type game.</p>
        <p>Each round you will be given a list of facts describing a mystery country.</p>
        <p>Will you be able to pinpoint the coutnry based on these facts?</p>
      </div>
      </div>
    </div>
  </div>
 
  );
};

export default About;