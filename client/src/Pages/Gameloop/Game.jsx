import React, { useEffect, useState } from 'react';

import "./Game.css";
import Question from './Question/Question';
import WaitingForPlayers from './Waiting_for_players/Waiting_for_players';
import StartingGame from './Starting_Game/Starting_game';
import RevealAnswer from './Reveal_answer/Reveal_answer';
import CurrentScores from './Current_scores/Current_scores';
import EndGame from './End_game/End_game'
import StartingQuestion from './Starting_Question/Starting_Question';
import ExpiredSession from './Expired_Session/Expired_Session';

const Game = () => {

    const [status, setStatus] = useState("Loading")
    const [loading, setloading] = useState(true);
    const [sessionID, setSessionID] = useState(-1);
    const [gameTimeLimit, setGameTimeLimit] = useState();

    const [previousState, setPreviousState] = useState();
    const [maxGuesses, setMaxGuesses] = useState();

    const [Players, setPlayers] = useState([]);




    useEffect(() => {

        setloading(true);

        let timer;

        setTimeout(() => {
            timer = setInterval(() => {
                fetch('/api/getSessionID').then(res => res.json()).then(stateJson => {
                    if (previousState !== stateJson.game_state) {
                        // console.log(stateJson);
                        setPreviousState(stateJson.game_state)
                        setStatus(stateJson.game_state);
                        setSessionID(stateJson.session_id);
                        setGameTimeLimit(stateJson.time_limit);
                        setMaxGuesses(stateJson.max_guesses);
                        setloading(false);
                        // console.log("sessionID: " + sessionID);


                        if (stateJson.game_state === "showing final scores") {
                            clearInterval(timer);
                        }



                        if (!window.location.endsWith("/#/Game")) {
                            clearInterval(timer);
                        }

                    }

                    if (sessionID !== -1) {
                        fetch(`/api/getLobbyPlayers?sessionID=${sessionID}`, { method: "GET" }).then(res => res.json()).then(stateJson => {
                            setPlayers(stateJson.players);
                            // console.log("Players will be blank, but not when you use players.map in return", Players)
                        })
                    }
                })
            }, 1000);
        }, 3000);



        return () => clearInterval(timer);
    }, []);

    if (sessionID !== -1 && status == "waiting for players") {
        fetch(`/api/getLobbyPlayers?sessionID=${sessionID}`, { method: "GET" }).then(res => res.json()).then(stateJson => {
            setPlayers(stateJson.players);
            // console.log("Players will be blank, but not when you use players.map in return", Players)

            // console.log(sessionID);
        })
    }

    function leaveGame() {
        fetch(`/api/leaveSession?sessionID=${sessionID}`).then(res => res.json()).then(res => {
            console.log(res.status);
            window.location.href = "/#/Home";
            window.location.reload();
        })
    }
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
            return (<>
                {/* <button className="wfpstyledbutton" onClick={ leaveGame }> Leave </button> */}
                <WaitingForPlayers sessionID={sessionID} Players={Players} />
            </>
            );
        case "starting game":
            return (
                <>
                    <StartingGame />
                </>
            );
        case "displaying question":
            return (
                <>
                    <div className='w-100 d-flex justify-content-end'>
                        <button className="wfpstyledbutton leavebtn" onClick={leaveGame}> Leave </button>
                    </div>                        <Question timeLeft={gameTimeLimit} maxGuesses={maxGuesses} sessionID={sessionID} />
                </>
            );
        case "starting next question":
            return (<>
                <div className='w-100 d-flex justify-content-end'>
                    <button className="wfpstyledbutton leavebtn" onClick={leaveGame}> Leave </button>
                </div>
                <StartingQuestion />
            </>
            );
        case "revealing answer":
            return (
                <>
                    <div className='w-100 d-flex justify-content-end'>
                        <button className="wfpstyledbutton leavebtn" onClick={leaveGame}> Leave </button>
                    </div>
                    <RevealAnswer sessionID={sessionID} />
                </>
            );

        case "showing current scores":
            return (
                <>
                    <div className='w-100 d-flex justify-content-end'>
                        <button className="wfpstyledbutton leavebtn" onClick={leaveGame}> Leave </button>
                    </div>                        
                    <CurrentScores sessionID={sessionID} />
                </>
            );
        case "showing final scores":
            return (
                <>
                    <EndGame sessionID={sessionID} />
                </>
            );
        case "expired session":
            return (
                <>
                    <ExpiredSession />
                </>
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