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
    if (Account.status == "client not logged") {
      // Redirecting client to login page
      <meta http-equiv="refresh" content="delay_time; URL=new_website_url" />
      
    }

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
