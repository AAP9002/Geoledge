import React, { useEffect } from 'react';
import "./AccountPage.css";
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

  return (<div className='wrapper'>
    <h1 className='w-100'>My Account</h1>
    <div className='row p-2'>
    <div className='col-md-4 justify-content-center credentials-Wrapper'>
        {/* table for userinfo basics */}
        <table className='Credentials'>
          <thead className='CredentialsHead'>
            <tr>
              <th className='Username'>{Username}</th>
            </tr>
          </thead>
          <tbody className='CredentialsBody'>
            <tr></tr>
          </tbody>
        </table>
        <br/>
      </div>

      <div className='col-md-8 d-flex justify-content-center'>
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
      </div>
      
    </div>
  </div>)
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