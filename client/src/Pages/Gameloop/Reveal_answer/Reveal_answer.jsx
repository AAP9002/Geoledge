import React from 'react';
import "./Reveal_answer.css";

import { useState, useEffect } from 'react';

const Reveal_answer = (props) => {

    const sessionID = props.sessionID;
    const [userIsHost, setUserIsHost] = useState(false)
    const [correctAnswer, setCorrectAnswer] = useState("HERE")
    const [loading, setloading] = useState(true)
    const [flag, setFlag] = useState("massive green button")
    
    useEffect(() => {
        //check if current user is host
        //check correct answer
        fetch('/api/isHost?sessionID='+sessionID).then(res => res.json()).then(stateJson => {
            setUserIsHost(stateJson.is_host)
            fetch('/api/revealAnswer?sessionID='+sessionID).then(res => res.json()).then(stateJson => {
                setCorrectAnswer(stateJson.country_name)
                setFlag(stateJson.flag)
                setloading(false)
            })
        })

        fetch('/api/revealAnswer?sessionID='+sessionID).then(res => res.json()).then(stateJson => {
            setCorrectAnswer(stateJson.country_name)
            setFlag(stateJson.flag)
            setloading(false)
        })

    }, []);

    function Change_State_Current_Score() {
        setloading(true)
        fetch("/api/scoreState?sessionID="+sessionID,{method: "POST"}).then(res => res.json()).then(stateJson => {
           setloading(false)
        })
    }

    if (!loading) {
        console.log("host?", userIsHost)
        if (userIsHost == 1) {
            return (
                <div className='reveal_answer_container'>
                    <div>
                        <h1>Answer: {correctAnswer}</h1>
                    </div>
                    <div>
                    <div class="row">
                        <div class="col-md-6"> <img src={flag} className="w-100 h-auto"/> </div>
                        <div class="col-md-6"> <iframe className='w-100 h-100' title="map" id="googlemap" src={"https://maps.google.com/maps?q="+correctAnswer+"country&t=&z=5&ie=UTF8&iwloc=&output=embed"} frameborder="0" marginheight="0" marginwidth="0"></iframe> </div>
                    </div>
                    </div>
                    <div>
                        <btn className='btn btn-success' onClick={Change_State_Current_Score}>Next</btn>
                    </div>
                </div>
            );
        } else
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