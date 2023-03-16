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

    <div className='wrapper w-100'>
      
      <table className='board w-100'>
        <thead>
        <tr>
          <th className='columns'>Player(Username)</th>
          <th className='columns'>Number of Wins</th>
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
