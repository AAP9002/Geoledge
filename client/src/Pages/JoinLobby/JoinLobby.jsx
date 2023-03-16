import React from 'react';
import './JoinLobby.css';
import { Link } from 'react-router-dom';
import { useState } from "react";

function JoinLobby() {
<<<<<<< HEAD
  const inputHandler = function(e) {
    setLobbyCode(e.target.value);
  }
  const [lobby_code, setLobbyCode] = useState("");
  function submitJoinCode() {
    fetch(`/api/joinLobby?session_id=${lobby_code}`,{method: "POST"}).then(res=>{
    console.log(res)});
    window.location.href = "/#/Game";
  }
  return (
    <div className="join-lobby-wrapper">
 
      <div className="join-lobby-container"> 
        <div className="join-lobby-content">
          <div className="join-lobby-header">
            <h1 style={{ color: "#000" }}>Join Lobby</h1>
            <h2 style={{ color: "#000" }}>Enter Lobby Code:</h2>
          </div>
          <form className="join-lobby-form">
            <div className="join-lobby-input-group">
              <label htmlFor="code" style={{ color: "#8A2BE2" }}>Code:</label>
              <input type="text" id="code" onInput={inputHandler}/>
=======
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
            <h1 style={{ color: "#fff" }}>Join Lobby</h1>
            <div className="join-lobby-container">
                <div className="join-lobby-content">
                    <div className="join-lobby-header">
                        <h2 style={{ color: "#fff" }}>Enter Lobby Code:</h2>
                    </div>
                    <form className="join-lobby-form">
                        <div className="join-lobby-input-group">
                            <label htmlFor="code" style={{ color: "#8A2BE2" }}>Code:</label>
                            <input type="text" id="code" onInput={inputHandler} />
                        </div>
                        <div className="join-lobby-input-group">
                            <label htmlFor="name" style={{ color: "#8A2BE2" }}>Name:</label>
                            <input type="text" id="name" />
                        </div>
                        <div className="join-lobby-button-group">
                            <button className="join-lobby-button" onClick={submitJoinCode}>Join Lobby</button>
                            <Link to="/Home"> <button className="return-home-button">Return to Home</button></Link>
                        </div>
                    </form>
                </div>
>>>>>>> 9dfd9686f9e1a362b997aa1b50d5275822d749e4
            </div>
        </div>
    );
}

export default JoinLobby;
