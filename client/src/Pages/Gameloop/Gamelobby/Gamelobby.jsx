import React from 'react';
import "./Gamelobby.css";

import { useState, useEffect } from 'react';



function PlayerBoard(props) {

    const sessionID = props.sessionID;
    const [loading, setloading] = useState(true)
    const [Finishboard, setFinishboard] = useState([]);

    useEffect(() => {
        fetch('/api/getScores?sessionID='+sessionID).then(res => res.json()).then(stateJson => {
            setFinishboard(stateJson.scores)
            setloading(false)
        })
        setloading(false)
    }, []);


    function returnToHome() {
        window.location.href = "/#/Home";
    }


    return (



        <div className='wrapper'>
            <h1> <p className='header1'> Gameset!!</p></h1>
            <div className='alltable'>
            <table className='Ranking'>
                <thead>
                    <tr>
                        <th className='columns'>No</th>
                        <th className='columns'>Player(Username)</th>
                        
                    </tr>
                </thead>
         



                <tbody className='RankingTable'>
                    {Finishboard.map((row, index) => <tr><td className='data'>{index + 1}</td><td className='data'>{row.username}</td></tr>)}
                </tbody>
            </table>
            </div>
            <div className='button'>
            <button className='rtn' onClick={returnToHome}> <p className='fcolor'> Back to Home</p></button>
            </div>



        </div>


    )
}

const EndGame = (props) => {
    return (
        <div>
            <div>

                <PlayerBoard sessionID={props.sessionID} />

            </div>
        </div>

    );
};


export default EndGame;