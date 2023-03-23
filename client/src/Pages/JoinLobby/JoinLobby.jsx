import React from 'react';
import './JoinLobby.css';
import { Link } from 'react-router-dom';
import { useState } from "react";

function JoinLobby() {
    const inputHandler = function (e) {
        setLobbyCode(e.target.value);
    }

    const [lobby_code, setLobbyCode] = useState("");
    const [gameNotExistMessage, setGameNotExistMessage] = useState();

    function submitJoinCode(event) {
                // -------- what if joining fails  ---------
                event.preventDefault();

                fetch(`/api/joinLobby?sessionID=${lobby_code}`, { method: "GET" }).then(res => res.json()).then(joinres => {
                    if (joinres.status === 401) {
                        window.location.href = "/#/Log-in";
                    } else {
                        console.log(joinres)
                    if (joinres.status!=="participent added")
                    {
                        setGameNotExistMessage("Invalid Code: "+joinres.status)
                    }
                    else
                    {
                        window.location.href = "/#/Game";
                    }
                }
                });

    }
    return (
        <div className="join-lobby-wrapper">

            <div className="join-lobby-container">
                <div className="join-lobby-content">
                    <div className="join-lobby-header">
                        <h2 style={{ color: "#fff" }}>JOIN LOBBY:</h2>
                    </div>
                    <form className="join-lobby-form">
                        <div className="join-lobby-input-group">
                            <label htmlFor="code" style={{ color: "#fff" }}>LOBBY CODE:</label>
                            <input type="text" id="code" onInput={inputHandler} />
                        </div>
                        <div className="join-lobby-button-group">
                            <button className="join-lobby-button" onClick={submitJoinCode}>Join Lobby</button>
                        </div>
                        <div className='nonExistMessage'>{gameNotExistMessage}</div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default JoinLobby;
