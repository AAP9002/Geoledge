import React from 'react';
import "./End_game.css";

import { useState, useEffect } from 'react';



function FinishBoard(props) {

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
        window.location.reload();
    }


    return (



        <div className='wrapper d-flex flex-column justify-content-center'>
            <div className='header1-div'>
            <p>Final Scores!</p>
            </div>
            {/* <div className='button d-flex justify-content-end' style={{ padding:"20px"}}>
            <button className='rtn' onClick={returnToHome}> <p style={{color:"White"}}>Back to Home</p></button>
            </div> */}

            <div className='w-100 d-flex justify-content-center'>
            <table className='Ranking'>
                <thead>
                    <tr>
                        <th className='columns'>No</th>
                        <th className='columns'>Player(Username)</th>
                        <th className='columns'>Points</th>
                    </tr>
                </thead>
         



                <tbody className='RankingTable'>
                    {Finishboard.map((row, index) => <tr><td className='data'>{index + 1}</td><td className='data'>{row.username}</td><td className='data'>{row.player_score}</td></tr>)}
                </tbody>
            </table>
            </div>

            <div className='w-100 d-flex justify-content-center'>
                <div className='styledbutton7 w-50'>
                            <btn className='buttonp1' onClick={returnToHome}> <p style={{color:"White"}}>Back to Home</p></btn>
                </div>
            </div>



        </div>


    )
}

const EndGame = (props) => {
    return (
        <div>
            <div>

                <FinishBoard sessionID={props.sessionID} />

            </div>
        </div>

    );
};


export default EndGame;