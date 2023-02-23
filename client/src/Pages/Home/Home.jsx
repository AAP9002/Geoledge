import React from 'react';
import "./Home.css";
import { Link } from 'react-router-dom';


const About = () => {
  return (
  <div>
    <div>

    </div>
    <div class ="column">
      <div class ="top">
      <div class ="row-md-8">
        <h1>GEOLEDGE</h1>
        <h2>Prepared to test your geographical knowledge?</h2>
        <div class = "btns">
        <a class ="styledbutton" href='./Play'> Host Game</a>
        <a class ="styledbutton" href='./Play'> Play Online</a>
        <a class ="styledbutton" href='./Play'> Join Game</a>
        </div>
      </div>
      </div>
      <div class = "bottom">
      <div class ="row-md-12">
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