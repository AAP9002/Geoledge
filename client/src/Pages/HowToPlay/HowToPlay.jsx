import React from 'react';
import './HowToPlay.css';


function HowToPlay() {
  return (
    <div>
      <h1>How to play Geoledge</h1>
      <p style={{color: "white"}}>
        You will be given clues that help you pin point the mystery country.
      </p>
      <p style={{color: "white"}}>
        Use the search box to guess the mystery country. 
      </p>
      <p style={{color: "white"}}>
        You will be given hints about the country's population, surface area, time difference, direction, and distance. Use these hints to refine your guess.
      </p>
      <p style={{color: "white"}}>
        You have a limited number of guesses. Use them wisely!
      </p>
      <p style={{color: "white"}}>
        If you locate the country correctly, you win! If not, you can try again.
      </p>
      <p style={{color: "white"}}>
        Your score is calculated based on the time left on the clock and the number of guesses used.
      </p>
      <h2>Hints</h2>
      <div className="bubble">
        <h3>
          <span className="circle1">Population</span>
        </h3>
        <p className='population'> 
          <text style = {{maxwidth:1}}>
            The population hint will tell you if the country's population is higher or lower than the 
            guessed country.The hint will appear as the text "up" or "down", and the color of the circle
            indicates how close you are to the correct answer.
          </text>
        </p>
      </div>
      <div className="bubble2">
        <h3>
          <span className="circle">Surface Area</span>
        </h3>
        
        <p style={{width: 1050, color:"black" , fontSize: "1.5rem"}}>
          The surface area hint will tell you if the country's surface area is higher or lower than the guessed country. The hint will appear as the text "up" or "down", and the color of the circle indicates how close you are to the correct answer.
        </p>
      </div>
      <div className="bubble3">
        <h3>
          <span className="circle">Time Difference</span>
        </h3>
        <p style={{width: 1050, color:"black" , fontSize: "1.5rem"}}>
          The time difference hint will tell you how many hours ahead or behind the country is compared to the guessed country. The hint will be displayed as a number, with a negative number indicating that the country is behind in hours and positive number indicating that the country is ahead in hours.
        </p>
      </div>
      <div className="bubble4">
        <h3>
          <span className="circle1">Direction</span>
        </h3>
        <p style={{width: 1050, color:"black" , fontSize: "1.5rem"}}>
          The direction hint will tell you which direction the country is in relation to the guessed country . The hint will be displayed as an arrow pointing in the correct direction.
        </p>
      </div>
      <div className="bubble5">
        <h3>
          <span className="circle1">Distance</span>
        </h3>
        <p style={{width: 1050, color:"black" , fontSize: "1.5rem"}}>
          The distance hint will tell you how far away the mystery country is in kilometers to the guessed country. The hint will be displayed as a number.
        </p>
      </div>
      <h2>Scoring</h2>
      <p style={{color: "white"}}>
        Your score is calculated based on the time left on the clock and the number of guesses used. The maximum score is 10,000 points.
      </p>
      <h2>Conclusion</h2>
      <p style={{color: "white"}}>
        Congratulations! You now know how to play the Geoledge. Remember to use the hints wisely and try to locate the country as accurately as possible. Have fun and good luck!
      </p>
    </div>
    );
  }
  
  export default HowToPlay;
        
      
