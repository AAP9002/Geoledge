import React from 'react';
import "./Starting_Question.css";

import { useState, useEffect } from 'react';


const Starting_Question = () => {
    const [timeNumber, setTimeNumber] = useState(5);

    useEffect(() => {
        if(timeNumber > 0)
        {
            setTimeout(() => setTimeNumber(timeNumber - 1), 1000)
        }
      }, [timeNumber]);
    return(
    <>
        <p className="waiting">Start Guessing in {timeNumber}s</p>
    </>
    );}

export default Starting_Question;