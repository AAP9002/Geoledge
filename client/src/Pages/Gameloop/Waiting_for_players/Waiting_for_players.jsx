import React from 'react';
import "./Waiting_for_players.css";
//import "./Gamelobby.css";
import { useState } from 'react';




const Waiting_for_players = (props) => {
    function leaveGame() {
        fetch(`/api/leaveSession?sessionID=${ props.sessionID }`).then(res => res.json()).then(res => {
            console.log(res.status);
            window.location = "/#/Home";
        })
    }
    console.log("players" + props.Players);

    function returnToHome() {


    }
    if (props.sessionID != undefined) {
        return(<>
                <p className="waiting">Waiting for players</p>
                <div className='wrapper'>
                <h1> <p className='header1'> Lobby</p></h1>
                <div className='alltable'>
                <table className='Ranking'>
                    <thead>
                        <tr>
                            <th className='columns'>No</th>
                            <th className='columns'>Player(Username)</th>
                            
                        </tr>
                    </thead>
            
                <tbody className='RankingTable'>
                    {props.Players.map((row, index) => <tr><td className='data'>{index + 1}</td><td className='data'>{row.username}</td></tr>)}
                </tbody>
            </table>
            </div>
            <div className='button'>
            <button className='rtn' onClick={returnToHome}> <p className='fcolor'> Back to Home</p></button>
            </div>


        </div>

        </>);
    } else {
        return(<p className="waiting">Waiting for players</p>);
    }
}

export default Waiting_for_players;