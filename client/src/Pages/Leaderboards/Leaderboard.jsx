import React from 'react';
import './Leaderboard.css';
import { useState, useEffect } from 'react';



function LeaderBoard() {

  const [Leaderboard, setLeaderboard] = useState([]);
  const [modeValue, setModeValue] = useState("")
  

  
    const modes = [
                        {value: "0", text: "Wins"}, 
                        {value: "1", text: "Game Played"}, 
                        {value: "2", text: "Winrate"}                      
                      ]
    const options = modes.map((option) => {
    return <option value={option.value}>{option.text}</option>
      })
  

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
    
       <div className='all'>
        <div className='box'>
        <label className='modes'></label>
      
        <select name="modes" value = "modeValue" onChange={(e) => setModeValue(e.target.value)} >
          {options}
        </select>
        </div>
        {/* <option className='option' value="wins">Wins</option> */}
        <div className='opFunc'>
        <option onClick={() => {setModeValue("1");
      console.log(modeValue)}}>Wins</option>
		      <option onClick={() => {setModeValue("2");
        console.log(modeValue)}}>Gameplayed</option>
		      <option onClick={() => setModeValue("3")}>Win rate</option>
		      
        </div>
    

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
