import React from 'react';
import "./Game.css";
import Question from './Question/Question';


const Game = () => {
    let status = "question";

    switch(status){
        case "question":
            return (
                <Question/>
            );
        default:
                return (
                    <p>Not in recognized state😔</p>
                );
    }
};

export default Game;