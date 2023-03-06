import React, { useEffect, useState } from 'react';

import "./Game.css";
import Question from './Question/Question';

const Game = () => {

    const [status, setStatus] = useState("Loading")

    useEffect(() => {
        fetch('/api/CurrentGameState').then(res => res.json()).then(stateJson => {
            setStatus(stateJson.status);
        });
    });

    /* ==============  INFORMATION ON GAME_STATE  ==============
       Game states held by game_state:
            1. "waiting for players"
            2. "starting game"
            3. "displaying question"
            4. "revealing answer"
            5. "showing current scores"
            6. "starting next question"
            7. "Showing final scores"
    */


    switch (status) {
        case "waiting for players":
            return (
                <p>waiting for players</p>
            );
        case "starting game":
            return (
                <p>starting game</p>
            );
        case "displaying question":
            return (
                <Question />
            );
        case "revealing answer":
            return (
                <p>revealing answer</p>
            );

        case "showing current scores":
            return (
                <p>showing current scores</p>
            );
        case "starting next question":
            return (
                <p>starting next question</p>
            );
        case "showing current scores":
            return (
                <p>showing current scores</p>
            );
        case "Loading":
            return (
                <p>Loading innit</p>
            );
        default:
            return (
                <p>Not in recognized state😔</p>
            );
    }
};

export default Game;