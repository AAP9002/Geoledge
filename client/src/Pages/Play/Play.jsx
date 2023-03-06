import React from 'react';
import { useState } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import "./Play.css";
import { Link, redirect } from 'react-router-dom';


function Play(){
  const[NumberOfRounds, setNOR] = useState(0)
  const[TimePerRound, setTPR] = useState(0)
  const[Players, setPlayers] = useState([]);
  const [No, setNo] = useState(0)

  const changeNOR = (event) => {
    setNOR(event.target.id);
  };

  const changeTPR = (event) => {
    setTPR(event.target.id);
  }
  
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Number of Rounds:', NumberOfRounds, 'Time per Round', TimePerRound);

    fetch(`/api/startGame?num_of_questions=${ NumberOfRounds }&time_limit=${ TimePerRound }`)
  };


  return (
  <div >
  <div className="lob">
  <h1>LOBBY</h1>
  </div>
  <div className="row">
    <div className="col-md-8">
    <table className = "table">
        <thead> <tr> <th>no:</th><th>Player</th></tr></thead>
        <tbody>
          <tr><td>{No}</td></tr>
        </tbody>

      </table>
    </div>
    <div className="col-md-4">
      <div className="settingscontainer">

        <div className="settings">
          <h2 className="h2"> Settings </h2>
          <div>
            
              <h3>Number Of Rounds</h3>
              <ButtonGroup> 
                <button className="styledbutton2" id="1" onClick={changeNOR}>1</button><button className="styledbutton2" id="2" onClick={changeNOR}>2</button><button className="styledbutton2" id="3" onClick={changeNOR}>3</button>
                <button className="styledbutton2" id="4" onClick={changeNOR}>4</button><button className="styledbutton2" id="5" onClick={changeNOR}>5</button><button className="styledbutton2" id="6" onClick={changeNOR}>6</button>
                <button className="styledbutton2" id="7" onClick={changeNOR}>7</button><button className="styledbutton2" id="8" onClick={changeNOR}>8</button><button className="styledbutton2" id="9" onClick={changeNOR}>9</button>
                <button className="styledbutton2" id="10" onClick={changeNOR}>10</button>
              </ButtonGroup>

              <h3>Time Per Round </h3>
              <ButtonGroup className="me-2" aria-label="Second group">
                
                
                <button className="styledbutton2" id="15" onClick={changeTPR}>15s</button><button className="styledbutton2" id="30" onClick={changeTPR}>30s</button><button className="styledbutton2" id="45" onClick={changeTPR}>45s</button>
                <button className="styledbutton2" id="60" onClick={changeTPR}>60s</button>
              </ButtonGroup>
 
          </div>   
          <form onSubmit={handleSubmit}>
         
          <button className='styledbutton3'>Play</button>  
          
          </form>
        </div>
    
      </div>
    </div>
  </div>
  </div>
  );
};

export default Play;

