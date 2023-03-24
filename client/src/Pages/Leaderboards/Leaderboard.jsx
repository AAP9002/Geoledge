import React from 'react';
import './Leaderboard.css';
import { useState, useEffect } from 'react';



function LeaderBoard() {

  const [Leaderboard, setLeaderboard] = useState([]);
  const [SortName, SetSort] = useState("Wins")
  

  // API Fetch to get all
   
  useEffect(() => {
    fetch(`/api/leaderboards?sort=wins`).then(res => res.json()).then(fetchedData =>{

      setLeaderboard(fetchedData.leaderboards);
      console.log(Leaderboard);
    });
    }, []);
  

  function getSort(sort) {

      if (sort == "wins") {
        SetSort("Wins");
      } else if (sort == "gamesPlayed") {
        SetSort("Games Played");
      } else if (sort == "winRate") {
        SetSort("Win Rate");
      }

      fetch(`/api/leaderboards?sort=${ sort }`).then(res => res.json()).then(fetchedData =>{
        setLeaderboard(fetchedData.leaderboards);
        console.log(Leaderboard);
      });

  }
  
  return (
    
    
   <>
    <h1 className='leaderboardH1'>Leaderboard</h1>
    
       <div className='all w-100 d-flex justify-content-center'>
        <div className='box'>
        <select name="modes" onChange={(e) => getSort(e.target.value)} >
          <option value="wins">Wins</option>
		      <option value="gamesPlayed">Games Played</option>
		      <option value="winRate">Win Rate</option>
        </select>
        </div>
      </div>
      

     <div className='wrapper'>
      
       <table className='board'>
         <thead>
         <tr>
           <th className='columns'>Player(Username)</th>
           <th className='columns'>{ SortName }</th>
         </tr>
         </thead>
        


         <tbody className='myTable'>
         {Leaderboard.map((row)=> <tr><td className='data' align='center'>{row.username}</td><td className='data' align='center'>{row.value}</td></tr>)}
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
