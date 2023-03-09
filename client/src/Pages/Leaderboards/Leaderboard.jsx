import React from 'react';
import './Leaderboard.css';
import { useState, useEffect } from 'react';



function LeaderBoard() {
  

  const [Leaderboard, setLeaderboard] = useState(['test']);
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
      setLeaderboard(fetchedData.leaderboards);
    });
    }, []);

  return (
    
    
   
    <div className='wrapper'>
      <table className='board' align='center'>
        <tr>
          <th className='columns'>Player</th>
          <th className='columns'>Wins</th>
        </tr>
        


        <tbody className='myTable'>
        {Leaderboard.map((row)=> <tr><td align='center'>{row.username}</td><td align='center'>{row.wins}</td></tr>)}
        </tbody>
        </table>
        
        
        
        </div>

        


      
   
      
      
  )
}

const About = () => {
  return (
    <div>
          <div>
            
            <LeaderBoard/>
          
          </div>
    </div>
 
  );
};


export default About;
