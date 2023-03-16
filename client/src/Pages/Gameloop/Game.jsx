import React, { useEffect, useState } from 'react';

import "./Game.css";
import Question from './Question/Question';
import WaitingForPlayers from './Waiting_for_players/Waiting_for_players';
import StartingGame from './Starting_Game/Starting_game';
import RevealAnswer from './Reveal_answer/Reveal_answer';
import CurrentScores from './Current_scores/Current_scores';
import EndGame from './End_game/End_game'
import StartingQuestion from './Starting_Question/Starting_Question';

const Game = () => {

    const [status, setStatus] = useState("Loading")
    const [loading, setloading] = useState(true);
    const [sessionID, setSessionID] = useState();
    const [gameTimeLimit, setGameTimeLimit] = useState();

    const [previousState, setPreviousState] = useState();
    const [maxGuesses, setMaxGuesses] = useState();






    useEffect(() => {
        setloading(true);

        let timer;

        setTimeout(() => {
            timer = setInterval(() => {
                fetch('/api/getSessionID').then(res => res.json()).then(stateJson => {
                    if (previousState !== stateJson.game_state) {
                        setPreviousState(stateJson.game_state)
                        setStatus(stateJson.game_state);
                        setSessionID(stateJson.session_id);
                        setGameTimeLimit(stateJson.time_limit);
                        setMaxGuesses(stateJson.max_guesses);
                        setloading(false);


                        if (stateJson.game_state === "showing final scores") {
                            clearInterval(timer);
                        }


                        if(!window.location.endsWith("/#/Game")){
                            clearInterval(timer);
                        }

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
        return <><p className="waiting">Connecting...</p></>;

    switch (status) {
        case "waiting for players":
            return (
                <WaitingForPlayers sessionID={ sessionID }/>
            );
        case "starting game":
            return (
                <StartingGame />
            );
        case "displaying question":
            return (
                <Question timeLeft={gameTimeLimit} maxGuesses={maxGuesses}/>
            );
        case "starting next question":
            return(<StartingQuestion/>);
        case "revealing answer":
            return (
                <RevealAnswer sessionID={sessionID} />
            );

        case "showing current scores":
            return (
                <CurrentScores sessionID={sessionID} />
            );
        case "showing final scores":
            return (
                <EndGame />
            );
        case "Loading":
            return (
                <p className="waiting">Loading Game...</p>
            );
        default:
            return (
                <p className="waiting">Not in recognized state😔, Login or not in game</p>
            );
    }
};

export default Game;