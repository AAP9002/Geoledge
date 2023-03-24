import React from 'react';
import "./Reveal_answer.css";

import { useState, useEffect } from 'react';

const Reveal_answer = (props) => {

    const sessionID = props.sessionID;
    const [userIsHost, setUserIsHost] = useState(false)
    const [correctAnswer, setCorrectAnswer] = useState("HERE")
    const [loading, setloading] = useState(true)
    useEffect(() => {
        //check if current user is host
        //check correct answer
        fetch('/api/isHost?sessionID='+sessionID).then(res => res.json()).then(stateJson => {
            setUserIsHost(stateJson.is_host)
            fetch('/api/revealAnswer?sessionID='+sessionID).then(res => res.json()).then(stateJson => {
                setCorrectAnswer(stateJson.country_name)
                setloading(false)
            })
        })

        fetch('/api/revealAnswer?sessionID='+sessionID).then(res => res.json()).then(stateJson => {
            setCorrectAnswer(stateJson.country_name)
            setloading(false)
        })
        setloading(false)
    }, []);

    function Change_State_Current_Score() {
        setloading(true)
        fetch("/api/scoreState?sessionID="+sessionID,{method: "POST"}).then(res => res.json()).then(stateJson => {
            setloading(false)
        })
    }



    if (!loading) {
        console.log("host?", userIsHost)
        if (userIsHost == 1)
            return (<div className='reveal_answer_container'>
                <h1>Answer: {correctAnswer}</h1>
                <btn className='btn btn-success' onClick={Change_State_Current_Score}>Next</btn>
            </div>);
        else
            return (<div className='reveal_answer_container'>
                <h1>Answer: {correctAnswer}</h1>
            </div>);
    }
    else{
        return (<div className='reveal_answer_container'>
                <h1>Loading...</h1>
            </div>);
    }
}
export default Reveal_answer;