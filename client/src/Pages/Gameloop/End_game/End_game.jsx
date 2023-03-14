import React, { useEffect } from 'react';

import { useState } from 'react';
 


function ScoreBoard(){
  const [Points, SetPoints] = useState(0)
  const [Place, SetPlace] = useState(0)
  const[Username, SetUsername] = useState("Username")


  
  return (<div className='wrapper'>
          <h1>RankingList</h1>
          <table className='board'>
          <thead className='WinsHead'>
          <tr>
              <th>Place</th>
              <th>Player</th>
              <th>Points</th>
          </tr>
      </thead>
      {ScoreBoard.map((row)=> <tr><td className='data'>{row.Place}</td><td className='data' align='center'>{row.username}</td><td className='data' align='center'>{row.Points}</td></tr>)}
      </table>


       <button onClick={""}>back to current room</button>
       <button onClick={""}>Back to Home</button>














    </div>
    
    )

}

const About = () => {
  return (
    <div>
          <div>
            
            <ScoreBoard/>
          
          </div>
    </div>
 
  );
};

export default About;