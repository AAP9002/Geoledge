import React from 'react';
import "./Current_scores.css";

import { useState, useEffect } from 'react';

const Current_scores = (props) => {

    const sessionID = props.sessionID;
    const [userIsHost, setUserIsHost] = useState(false)
    const [loading, setloading] = useState(true)
    const [Scoreboard, setScoreboard] = useState([]);
    
    useEffect(() => {
        fetch('/api/isHost?sessionID='+sessionID).then(res => res.json()).then(stateJson => {
            setUserIsHost(stateJson.is_host)
            fetch('/api/getScores?sessionID='+sessionID).then(res => res.json()).then(stateJson => {
                setScoreboard(stateJson.scores)
                setloading(false)
            })
        })
        // porbs can remove this but meh
        fetch('/api/getScores?sessionID='+sessionID).then(res => res.json()).then(stateJson => {
            setScoreboard(stateJson.scores)
            setloading(false)
        })
        setloading(false)
    }, []);

    function Change_State_to_next_question() {
        setloading(true)
        fetch("api/nextQuestion?sessionID="+sessionID).then(res => res.json()).then(stateJson => {
            setloading(false)
        })
    }



    if (!loading) {
        if (userIsHost == 1)
            return (
                <div className='reveal_answer_container'>
                    <h1> Scores</h1>
                    <div className='alltable2'>
                        <table className='Rankings'>
                            <thead>
                                <tr>
                                    <th className='columns2'>No</th>
                                    <th className='columns2'>Player(Username)</th>
                                    <th className='columns2'>Points</th>
                                </tr>
                            </thead>
                    
                            <tbody className='RankingTable'>
                                {Scoreboard.map((row, index) => <tr><td className='data'>{index + 1}</td><td className='data'>{row.username}</td><td className='data'>{row.player_score}</td></tr>)}
                            </tbody>
                        </table>
                    </div>
                    <div className='buttonp1'>
                        <btn className='styledbutton7' onClick={Change_State_to_next_question}> <p className='btntext'>Next Question</p></btn>
                    </div>
                </div>
                
            );
        else
            return (<div className='reveal_answer_container'>
                <h1> Scores</h1>
                <div className='alltable2'>
                    <table className='Rankings'>
                        <thead>
                            <tr>
                                <th className='columns2'>No</th>
                                <th className='columns2'>Player(Username)</th>
                                <th className='columns2'>Points</th>
                            </tr>
                        </thead>
                
                        <tbody className='RankingTable'>
                            {Scoreboard.map((row, index) => <tr><td className='data'>{index + 1}</td><td className='data'>{row.username}</td><td className='data'>{row.player_score}</td></tr>)}
                        </tbody>
                    </table>
                </div>
            </div>);
    }
    else{
        return (<div className='reveal_answer_container'>
                <h1>Loading...</h1>
            </div>);
    }
}
export default Current_scores;