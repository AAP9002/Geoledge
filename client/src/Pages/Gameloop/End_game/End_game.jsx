import React from 'react';
import "./End_game.css";

import { useState, useEffect } from 'react';



function FinishBoard(props) {

    const sessionID = props.sessionID;
    const [loading, setloading] = useState(true)
    const [Finishboard, setFinishboard] = useState([{ no: "1", username: "fdfdf", scores: "200" }, { no: "1", username: "fdfdf", scores: "200" }, { no: "2", username: "asass", scores: "100" }
        , { no: "3", username: "jkjkj", scores: "50" }]);

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
                        <th className='columns'>Points</th>
                    </tr>
                </thead>
         



                <tbody className='RankingTable'>
                    {Finishboard.map((row) => <tr><td className='data'>{row.no}</td><td className='data'>{row.username}</td><td className='data'>{row.scores}</td></tr>)}
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

                <FinishBoard sessionID={props.sessionID} />

            </div>
        </div>

    );
};


export default EndGame;