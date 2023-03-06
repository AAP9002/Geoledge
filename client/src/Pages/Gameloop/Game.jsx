import React, { useEffect } from 'react';
import "./Game.css";
import Question from './Question/Question';
import { useEffect } from 'react';


const Game = () => {
    useEffect(() => {
        fetch('/api/countryNames').then(res => res.json()).then(names =>{
            setCountryNames(names);
        });
    }, []);


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