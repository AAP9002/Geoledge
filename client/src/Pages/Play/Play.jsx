import React, { useEffect } from 'react';
import { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import "./Play.css";
import { Routes, Route, useParams } from 'react-router-dom';


function Play() {
    let { sessionID } = useParams();
    const [creating_game_Session, setSessionCreationState] = useState(true);
    const [game_Session_ID, setGame_Session_ID] = useState(true);
    const [Players, setPlayers] = useState([]);
    
    useEffect(() => {
        fetch('/api/checkLoggedIn', { method: "GET" }).then((res) => {
            console.log(res.status, "1")
            if (res.status === 401) {
                window.location.href = "/#/Log-in";
            } else {
                fetch('/api/LobbyValidation?sessionID='+sessionID, { method: "GET" }).then((res) => res.json()).then(stateJson => {
                    console.log(stateJson.status, "2")
                    if (stateJson.status != "Lobby Verification Successful") {
                        console.log(stateJson.status)
                        window.location.href = "/#/Home";
                    } else {
                        console.log("$%^&*")
                        setGame_Session_ID(sessionID)
                        setSessionCreationState(false)
                    }
                })
            }
        })

        let timer;

        setTimeout(() => {
            timer = setInterval(() => {
                fetch('/api/getLobbyPlayers?sessionID='+sessionID, { method: "GET" }).then(res => res.json()).then(stateJson => {
                    setPlayers(stateJson.players);
                    console.log("Players will be blank, but not when you use players.map in return", Players)
                })
            }, 1000);
        }, 3000);
        return () => clearInterval(timer);
        
    }, []);
    
    const [NumberOfRounds, setNOR] = useState(5)
    const [TimePerRound, setTPR] = useState(60)

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
        fetch(`/api/SubmitGameSettings?sessionID=${game_Session_ID}&num_of_questions=${NumberOfRounds}&max_guesses=${10}&time_limit=${TimePerRound}`, { method: "POST" }).then(res => {
        });

        fetch(`/api/startGame?sessionID=${game_Session_ID}`, { method: "GET" });
        window.location.href = "/#/Game";
    };


    if(creating_game_Session){
        return(<p className='waiting'>Loading... (Hosting Game)</p>)
    }

    return (
        <div >
            <Container className='back'>
                <Row>
                    <Row>
                        <div className="lob">
                            <h1>LOBBY CODE:{game_Session_ID}</h1>
                        </div>
                    </Row>
                    <Col>
                        <table className="table">
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


                                                <button className="styledbutton3" id="60" onClick={changeTPR}>60s</button>
                                                <button className="styledbutton3" id="90" onClick={changeTPR}>90s</button>
                                                <button className="styledbutton3" id="120" onClick={changeTPR}>120s</button>
                                                <button className="styledbutton3" id="150" onClick={changeTPR}>150s</button>
                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </Row>
                <div>
                    <div className='formf'>
                        <h2>Number of rounds</h2>
                        <h1>{NumberOfRounds}</h1>
                        <h2>Time Limit</h2>
                        <h1> {TimePerRound}</h1>

                        <form onSubmit={handleSubmit}>

                            <button className='styledbutton4'>Play</button>

                        </form>
                    </div>
                </div>
            </Container>
        </div>

    );
};

export default Play;

