import React from 'react';
import './JoinLobby.css';
import { Link } from 'react-router-dom';
import { useState } from "react";

function JoinLobby() {
    const inputHandler = function (e) {
        setLobbyCode(e.target.value);
    }
    const [lobby_code, setLobbyCode] = useState("");
    function submitJoinCode() {
        fetch('/api/checkLoggedIn', { method: "GET" }).then((res) => res.json).then(res => {
            if (res.status === 401) {
                window.location.href = "/#/Log-in";
            } else {
                // -------- what if joining fails  ---------
                fetch(`/api/joinLobby?session_id=${lobby_code}`, { method: "POST" }).then(res => {
                    console.log(res)
                });window.location.href = "/#/Game";
                
            }
        })
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
                        <div className="join-lobby-input-group">
                            <label htmlFor="name" style={{ color: "#fff" }}>NAME:</label>
                            <input type="text" id="name" />
                        </div>
                        <div className="join-lobby-button-group">
                            <button className="join-lobby-button" onClick={submitJoinCode}>Join Lobby</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default JoinLobby;
