import React from 'react';
import './JoinLobby.css';
import { Link } from 'react-router-dom';

function JoinLobby() {
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
              <input type="text" id="code" />
            </div>
            <div className="join-lobby-input-group">
              <label htmlFor="name" style={{ color: "#8A2BE2" }}>Name:</label>
              <input type="text" id="name" />
            </div>
            <div className="join-lobby-button-group">
              <button className="join-lobby-button">Join Lobby</button>
              <Link to="/Home"> <button className="return-home-button">Return to Home</button></Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default JoinLobby;
