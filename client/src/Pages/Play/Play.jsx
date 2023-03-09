import React, { useEffect } from 'react';
import { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import "./Play.css";



function Play(){
  // on load create new game session
  const [creating_game_Session, setSessionCreationState] = useState(true);
  const [game_Session_ID, setGame_Session_ID] = useState(true);

  useEffect(() => {
    fetch('/api/createLobby',{method: "POST"}).then(res => res.json()).then(stateJson => {
      setGame_Session_ID(stateJson.id);
      setSessionCreationState(false);
    })
  },[]);
  //

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
    fetch(`/api/SubmitGameSettings?session_id=${game_Session_ID}&num_of_questions=${ NumberOfRounds }&max_guesses=${10}&time_limit=${ TimePerRound }`,{method: "POST"}).then(res=>{
    });
    window.location.href = "/#/Game";
  };

  
//if(creating_game_Session){
 // return(<p>Loading</p>)
//}

  return (
  <div >
  <div className="lob">
  <h1>LOBBY CODE:{game_Session_ID}</h1>
  </div>
  <Container className='back'>
  <Row>
    <Col>

    <table className = "table">
        <thead> <tc> <th>no:</th><th>Player</th></tc></thead>
        <tbody>
          <tr><td>{No}</td></tr>
        </tbody>
      </table>
    </Col>
    <div className='col'>
    <div className="settingscontainer">
    <div className="row-md-4">
      <div >

        <div className="settings">
          <h2 className="h2"> Settings </h2>
          <div>
            
              <h3>Number Of Rounds</h3>
              <div> 
                <button className="styledbutton2" id="1" onClick={changeNOR}>1</button><button className="styledbutton2" id="2" onClick={changeNOR}>2</button><button className="styledbutton2" id="3" onClick={changeNOR}>3</button>
                <button className="styledbutton2" id="4" onClick={changeNOR}>4</button><button className="styledbutton2" id="5" onClick={changeNOR}>5</button><button className="styledbutton2" id="6" onClick={changeNOR}>6</button>
                <button className="styledbutton2" id="7" onClick={changeNOR}>7</button><button className="styledbutton2" id="8" onClick={changeNOR}>8</button><button className="styledbutton2" id="9" onClick={changeNOR}>9</button>
                <button className="styledbutton2" id="10" onClick={changeNOR}>10</button>
              </div>

              <h3>Time Per Round </h3>
              <div className="me-2" aria-label="Second group">
                
                
                <button className="styledbutton2" id="15" onClick={changeTPR}>15s</button><button className="styledbutton2" id="30" onClick={changeTPR}>30s</button><button className="styledbutton2" id="45" onClick={changeTPR}>45s</button>
                <button className="styledbutton2" id="60" onClick={changeTPR}>60s</button>
              </div>
 
          </div>   

        </div>
    
      </div>          
    </div>
    </div>
    </div>
    </Row>
    <div>
    <div>
    <form  onSubmit={handleSubmit}>
         
    <button className='styledbutton3'>Play</button>  
          
    </form>
    </div>
    </div>
    </Container>
  </div>
  
  );
};

export default Play;

