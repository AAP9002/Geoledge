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
            return (<>
                <h1 className='w-100'>Current Scores</h1>
                <div className='wrapper'>
                <table className='board w-100'>
                    <thead>
                        <tr>
                            <th className='columns'>No</th>
                            <th className='columns'>Player(Username)</th>
                            <th className='columns'>Score</th>
                        </tr>
                    </thead>
            
                <tbody className='RankingTable'>
                    {Scoreboard.map((row, index) => <tr><td className='data'>{index + 1}</td><td className='data'>{row.username}</td><td className='data'>{row.player_score}</td></tr>)}
                </tbody>
            </table>
            
            </div>
            <div className='buttonp1 w-25'>
                        <btn className='styledbutton7' onClick={Change_State_to_next_question}> <p className='btntext'>Next Question</p></btn>
            </div>
            </>
            );

        else
            return (<>
                <h1 className='w-100'>Current Scores</h1>
                <div className='wrapper'>
                <table className='board w-100'>
                    <thead>
                        <tr>
                            <th className='columns'>No</th>
                            <th className='columns'>Player(Username)</th>
                            <th className='columns'>Score</th>
                        </tr>
                    </thead>
            
                <tbody className='RankingTable'>
                    {Scoreboard.map((row, index) => <tr><td className='data'>{index + 1}</td><td className='data'>{row.username}</td><td className='data'>{row.player_score}</td></tr>)}
                </tbody>
            </table>
            
            </div>
            </>);
    }
    else{
        return (<div className='reveal_answer_container'>
                <h1>Loading...</h1>
            </div>);
    }
}
export default Current_scores;