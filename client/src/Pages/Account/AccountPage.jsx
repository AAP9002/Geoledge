import React, { useEffect } from 'react';
import "./AccountPage.css";
import { useState } from 'react';


function ScoreBoard(){
  const [wins, setWins] = useState(0)
  const [GamePlayed,setGamePlayed ] =  useState(0)
  const [WinRate, SetWinrate] = useState(0)

    useEffect(() => {
      fetch('/api/viewAccount').then(res =>res.json()).then(account =>{
        console.log(account);


      });
     }, []);


  return (<div className='wrapper'>
          <h1 align="center" font-size="300">My Account</h1>
          <table align="center" border="0" cellpadding="60" cellspacing="0" >
          <thead>
          <tr>
              <th>Wins</th>
              <th>Game Played</th>
              <th>Win rate</th>
          </tr>
      </thead>
          <tbody><tr><td align="center">{wins}</td><td align="center">{GamePlayed}</td><td align="center">{WinRate}</td></tr></tbody>
      </table>

  </div>)
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