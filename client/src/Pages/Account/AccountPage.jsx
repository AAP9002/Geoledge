import React, { useEffect } from 'react';
import './AccountPage.css'
import { useState } from 'react';


function ScoreBoard() {
  const [wins, setWins] = useState(0)
  const [GamePlayed, setGamePlayed] = useState(0)
  const [WinRate, SetWinrate] = useState(0)
  const [Username, SetUsername] = useState("Username")


  useEffect(() => {
    fetch('/api/viewAccount').then(res => res.json()).then(Account => {
      if (Account.status === "client not logged") {
        // Redirecting client to login page
        console.log("reached");
        window.location = "/#/Log-in";
      }

      SetUsername(Account.username)
      setWins(Account.wins)
      setGamePlayed(Account.games_played)
      if (Number(Account.games_played) === 0) {
        SetWinrate(1)
      }
      else {
        SetWinrate(Number(Account.wins) / Number(Account.games_played))
      }
    });
  }, []);

  return (
    <div className='Credentials'>
      <div className='b1'>
      <h1>Credentials</h1> 
    
      <h2>Username</h2> 
      <div className='Container'><p className='username'>Username</p></div> 
      <h2>Password</h2> 
      <button className='button1'> <p className='cpw'>Change Password</p></button>
      </div>




    </div>







  )
}

const About = () => {
  return (
    <div>
      <div>

        <ScoreBoard />

      </div>
    </div>

  );
};

export default About;