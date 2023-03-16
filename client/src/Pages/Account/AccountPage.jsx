import React, { useEffect } from 'react';

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
      <h1>Credentials</h1> <br />
    
      <h2>Username</h2> <br />
      <div className='Container'><p>Username</p></div> <br />
      <h2>Password</h2> <br />
      <button onclicked>Change Password</button>




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