import React from 'react';
import './Leaderboard.css';
import { useState, useEffect } from 'react';



function LeaderBoard() {
  

  const [Leaderboard, setLeaderboard] = useState([]);



  // API Fetch to get all
   
  useEffect(() => {
    fetch('/api/leaderboards?sort=wins').then(res => res.json()).then(fetchedData =>{

      setLeaderboard(fetchedData.leaderboards);
      console.log(Leaderboard);
    });
    }, []);
  

  return (
    
    
   <>
    <h1 className='leaderboardH1'>Leaderboard</h1>
    <label className='modes'></label>
      <div className='box'>
        <select name="modes" id="modes">
        <option className='option' value="wins">Wins</option>
        <option className='option' value="gameplayed">Game played</option>
        <option className='option' value="winratess">Winrate</option>        
        </select>
        </div>
        

    <div className='wrapper'>
      
      <table className='board'>
        <thead>
        <tr>
          <th className='columns'>Player(Username)</th>
          <th className='columns'>Score</th>
        </tr>
        </thead>
        


        <tbody className='myTable'>
        {Leaderboard.map((row)=> <tr><td className='data' align='center'>{row.username}</td><td className='data' align='center'>{row.wins}</td></tr>)}
        </tbody>
        </table>

        
        
        
        
        </div>
        </>      

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
