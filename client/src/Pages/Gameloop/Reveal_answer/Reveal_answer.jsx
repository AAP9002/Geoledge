import React from 'react';
import "./Reveal_answer.css";

import { useState, useEffect } from 'react';

const Reveal_answer = (props) => {

    const sessionID = props.sessionID;
    const [userIsHost, setUserIsHost] = useState(true)
    const [correctAnswer, setCorrectAnswer] = useState("HERE")
    const [loading, setloading] = useState(true)
    useEffect(() => {
        //check if current user is host
        //check correct answer
        fetch('/api/').then(res => res.json()).then(stateJson => {
            fetch('/api/').then(res => res.json()).then(stateJson => {
                setloading(false)
            })
        })
        setloading(false)
    }, []);

    function Change_State_Current_Score() {
        setloading(true)
        fetch("api/nextQuestion?sessionID="+sessionID).then(res => res.json()).then(stateJson => {
            setloading(false)
        })
    }



    if (!loading) {
        if (userIsHost)
            return (<div className='reveal_answer_container'>
                <h1>Answer: {correctAnswer}</h1>
                <a className='btn btn-success' onClick={Change_State_Current_Score}>Next Question</a>
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


};

export default Reveal_answer;