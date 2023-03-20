import React from 'react';
import "./Waiting_for_players.css";



const Waiting_for_players = (props) => {
    function leaveGame() {
        fetch(`/api/leaveSession?sessionID=${ props.sessionID }`).then(res => res.json()).then(res => {
            console.log(res.status);
            window.location = "/#/Home";
        })
    }

    return(<>
            <p className="waiting">Waiting for players</p>
            <button className="wfpstyledbutton" onClick={ leaveGame }> Leave </button>
        </>);}

export default Waiting_for_players;