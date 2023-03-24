import React from 'react';
import "./Waiting_for_players.css";
import { useState } from 'react';




const Waiting_for_players = (props) => {
    function leaveGame() {
        fetch(`/api/leaveSession?sessionID=${ props.sessionID }`).then(res => res.json()).then(res => {
            console.log(res.status);
            window.location.href = "/#/Home";
            window.location.reload();
        })
    }
    console.log("players" + props.Players);


    if (props.sessionID != undefined) {
        return(<>
                {/* <p className="waiting">Waiting for players</p> */}

                <h1 className='w-100'>Waiting for players ({props.sessionID})</h1>
                <div className='button'>
            <button className='rtn' onClick={leaveGame}> <p className='' style={{color:"white"}}>Back to Home</p></button>
            </div>
                <div className='wrapper'>
                <table className='Ranking w-100'>
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



        </>);
    } else {
        return(<p className="waiting">Waiting for players</p>);
    }
}

export default Waiting_for_players;