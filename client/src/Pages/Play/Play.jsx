import React from 'react';
import "./Play.css";
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';



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
  };
  return (
  <div >
  <div class="lob">
  <h1>LOBBY</h1>
  </div>
  <div class="row">
    <div class="col-md-8">
    <table class = "table">
        <thead> <tr> <th>no:</th><th>Player</th></tr></thead>
        <tbody>
          <tr><td>{No}</td></tr>
        </tbody>

      </table>
    </div>
    <div class="col-md-4">
      <div class="settingscontainer">
      <form onSubmit={handleSubmit}>
        <div class="settings">
          <h2 class="h2"> Settings </h2>
          <div>
            
              <h3>Number Of Rounds</h3>
              <ButtonGroup>
                <Button class="styledbutton" id="1" onClick={changeNOR}>1</Button><Button class="styledbutton" id="2" onClick={changeNOR}>2</Button><Button class="styledbutton" id="3" onClick={changeNOR}>3</Button>
                <Button class="styledbutton" id="4" onClick={changeNOR}>4</Button><Button class="styledbutton" id="5" onClick={changeNOR}>5</Button><Button class="styledbutton" id="6" onClick={changeNOR}>6</Button>
                <Button class="styledbutton" id="7" onClick={changeNOR}>7</Button><Button class="styledbutton" id="8" onClick={changeNOR}>8</Button><Button class="styledbutton" id="9" onClick={changeNOR}>9</Button>
                <Button class="styledbutton" id="10" onClick={changeNOR}>10</Button>
              </ButtonGroup>

              <h3>Time Per Round </h3>
              <ButtonGroup className="me-2" aria-label="Second group">
                
                
                <Button class="styledbutton2" id="15" onClick={changeTPR}>15s</Button><Button class="styledbutton2" id="30" onClick={changeTPR}>30s</Button><Button class="styledbutton2" id="45" onClick={changeTPR}>45s</Button>
                <Button class="styledbutton2" id="60" onClick={changeTPR}>60s</Button>
              </ButtonGroup>
 
          </div>
          <button class='styledbutton3'>Play</button>
        </div>
      </form>
      </div>
    </div>
  </div>
  </div>
  );
};

export default Play;

