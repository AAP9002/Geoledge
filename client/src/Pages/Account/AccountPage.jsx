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

      console.log(Account.wins);
      console.log(Account.games_played)
      if (Account.games_played == 0) {
        SetWinrate(0)
      }
      else {
        SetWinrate(Math.round((Account.wins / Account.games_played) * 1000) / 10)
      }
    });
  }, []);

  return (
    <div className='d-flex justify-content-center w-100'>
    <div className='row full_width_limit w-100'>
      <div className='Credentials col-lg-4'>
        <div className='b1'>
          <h1>Credentials</h1>

          <h2>Username</h2>
          <div className='Container'><p className='username'>{Username}</p></div>

          
          
         
        </div>
      </div>

      <div className='Statistics col-lg-8'>
        <div className='b2'>
          <h1 className='title2'>Statistics</h1>

          <div className='row'>
            <div className='col-lg-6 d-flex justify-content-center flex-column'>
              <h2 className='gpd'>Games Played</h2>
              <div className='d-flex justify-content-center'>
                <div className='Container2 d-flex align-items-center'><p className='Gameplayed'>{GamePlayed}</p></div>
              </div>
            </div>
            <div className='col-lg-6 d-flex justify-content-center flex-column'>
              <h2 className='wr'>Win Rate(%)</h2>
              <div className='d-flex justify-content-center'>
                <div className='Container3 d-flex align-items-center'><p className='rate'>{WinRate}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>




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