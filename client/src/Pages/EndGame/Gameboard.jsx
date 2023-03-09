import React, { useEffect } from 'react';
import "./AccountPage.css";
import { useState } from 'react';

function Gameboard() {
  

    const [Leaderboard, setLeaderboard] = useState([]);
    const [tableRows, setTableRows] = useState([
      {name: "Player1", score: "430"},
      {name: "Player2", score: "580"},
      {name: "Player3", score: "310"},
      {name: "Player4", score: "640"},
      {name: "Player5", score: "495"}
    ]);
  
  
    // API Fetch to get all players
    useEffect(() => {
      fetch('/api/leaderboards?sort=wins').then(res => res.json()).then(fetchedData =>{
        console.log(fetchedData);
        setLeaderboard(fetchedData);
      });
      }, []);
  
    return (
      
      <div className='bks'>
        
        <table className='playerboard' align='center'>
          <tr className='title'>
            <th>Player</th>
            <th>Score</th>
          </tr>
  
  
          <tbody className='scoreTable'>
            {tableRows.map((row, index)=> <tr><td >{row.name}</td><td >{row.score}</td></tr>)}
          </tbody>
  
          
  
  
        </table>
      </div>
        
        
    )
  }
  
  const About = () => {
    return (
      <div>
            <div>
              
              <Gameboard/>
            
            </div>
      </div>
   
    );
  };
  
  
  export default LeaderBoard;
  