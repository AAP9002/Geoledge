import React, { useEffect, useState } from 'react';

import "./Game.css";
import Question from './Question/Question';
import Waiting_for_players from './Waiting_for_players/Waiting_for_players';
import Starting_game from './Starting_Game/Starting_game';
import Reveal_answer from './Reveal_answer/Reveal_answer';
import Current_scores from './Current_scores/Current_scores';
import End_game from './End_game/End_game'

const Game = () => {

    const [status, setStatus] = useState("Loading")
    const [loading, setloading] = useState(true);
    const [sessionID, setSessionID] = useState();



    useEffect(() => {
        setloading(true);
        fetch('/api/getSessionID').then(res => res.json()).then(idData => {
            console.log(idData.session_code)
            setSessionID(idData.session_code);
            setloading(false);
        });

        let timer;

        setTimeout(() => {
            timer = setInterval(() => {
                fetch('/api/CurrentGameState').then(res => res.json()).then(stateJson => {
                    setStatus(stateJson.status);
                    if (stateJson.status == "showing final scores") {
                        clearInterval(timer);
                    }
                })
            }, 1000);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

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
    if (loading)
        return <><h1>Loading...</h1></>;

    switch (status) {
        case "waiting for players":
            return (
                <Waiting_for_players />
            );
        case "starting game":
            return (
                <Starting_game />
            );
        case "displaying question":
        case "starting next question":
            return (
                <Question />
            );
        case "revealing answer":
            return (
                <Reveal_answer sessionID={sessionID} />
            );

        case "showing current scores":
            return (
                <Current_scores sessionID={sessionID} />
            );
        case "showing final scores":
            return (
                <End_game />
            );
        case "Loading":
            return (
                <p className="waiting">Loading Game...</p>
            );
        default:
            return (
                <h1>Not in recognized state😔, Login or not in game</h1>
            );
    }
};

export default Game;