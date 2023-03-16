import React from 'react';
import "./End_game.css";

import { useState, useEffect } from 'react';



function FinishBoard() {
  

  const [Finishboard, setFinishboard] = useState([]);



   function returnToHome() {
    window.location.href = "/#/Home";
   }
 

  return (
    
    
   
    <div className='wrapper'>
      <h1>Game set!!</h1>
      <table className='Ranking'>
        <thead>
        <tr>
            <th className='columns'>No</th>
          <th className='columns'>Player(Username)</th>
          <th className='columns'>Points</th>
        </tr>
        </thead>
        


        <tbody className='RankingTable'>
        {Finishboard.map((row)=> <tr><td className='data' align='center'>{row.No}</td><td className='data' align='center'>{row.username}</td><td className='data' align='center'>{row.wins}</td></tr>)}
        </tbody>
        </table>
        <button onClick={ returnToHome }>Back to Home</button>
        
        
        
        </div>
      

  )
}

const About = () => {
  return (
    <div>
          <div>
            
            <FinishBoard/>
          
          </div>
    </div>
 
  );
};


export default About;