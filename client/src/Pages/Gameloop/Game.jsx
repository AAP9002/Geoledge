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

    useEffect(() => {

        let timer;
        setTimeout(() => {
            timer = setInterval(() => {
                fetch('/api/CurrentGameState').then(res => res.json()).then(stateJson => {
                    setStatus(stateJson.status);
                })
            }, 3000);
        }, 4000);
        return () => clearInterval(timer);
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
                <Reveal_answer />
            );

        case "showing current scores":
            return (
                <Current_scores />
            );
        case "Showing final scores":
            return (
                <End_game />
            );
        case "Loading":
            return (
                <p>Loading innit</p>
            );
        default:
            return (
                <p>Not in recognized state😔, Login or not in game</p>
            );
    }
};

export default Game;