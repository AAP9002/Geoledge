import React, { useEffect } from 'react';
import "./AccountPage.css";
import { useState } from 'react';


function ScoreBoard(){
  const [wins, setWins] = useState(0)
  const [GamePlayed,setGamePlayed ] =  useState(0)
  const [WinRate, SetWinrate] = useState(0)
  const [Account, SetAccount] = useState({})
  const[Username, SetUsername] = useState("Username")


  useEffect(() => {
    fetch('/api/viewAccount').then(res => res.json()).then(Account =>{
      console.log(Account);
      SetAccount(Account);

      if (Account.status == "client not logged") {
        // Redirecting client to login page
        
      }
    });
    }, []);


  return (<div className='wrapper'>
          <h1>My Account { Account.status }</h1>
          <table className='Wins'>
          <thead className='WinsHead'>
          <tr>
              <th>Wins</th>
              <th>Game Played</th>
              <th>Win rate</th>
          </tr>
      </thead>
          <tbody className='WinsBody'><tr><td align="center">{wins}</td><td align="center">{GamePlayed}</td><td align="center">{WinRate}</td></tr></tbody>
      </table>
        

        {/* table for userinfo basics */}
      <table className='Credentials'>
       <thead className='CredentialsHead'>
        <tr>
          <th className='Username'>{Username}</th>
        </tr>
       </thead>
       <tbody className='CredentialsBody'>
        <tr>Username</tr>
       </tbody>
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