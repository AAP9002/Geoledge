import React from 'react';
import './Leaderboard.css';
import { useState } from 'react';

function LeaderBoard() {
  const [No, setNo] = useState(0)
  const [Wins,setWins ] =  useState(0)
  const [Player, SetPlayer] = useState(0)
  const [Games, SetGameplayed] = useState(0)
  const [WP, SetWP] = useState(0)

  const [Players, setPlayers] = useState([]);

  // API Fetch to get all players
  

  // populate Players array with all the players fetched 
  let player = {no:"",username: "", wins: "",Games:"",WP:"",};

  return (
    <div className="leaderboard">
      <h1>Leader Board</h1>
      <table>
        <thead> <tr> <th>no:</th><th>Player</th><th>Wins</th><th>Games</th><th>WP%</th></tr></thead>
        <tbody>
          <tr><td>{No}</td><td>{Player}</td><td>{Wins}</td><td>{Games}</td><td>{WP}%</td></tr>
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
