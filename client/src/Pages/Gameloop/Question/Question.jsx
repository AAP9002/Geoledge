import React from 'react';
import "./Question.css";

import { useState, useEffect } from 'react';


const Question = (props) => {
    const [loading, setloading] = useState(false);
    const [otherCountryData, setOtherCountryData] = useState("");
    const [correctStatus, setcorrectStatus] = useState(false);
    const [lastGuess, setLastGuess] = useState();



    const [populationUPDOWN, setPopulationUPDOWN] = useState();
    const [populationColour, setPopulationColour] = useState();
    const [saUPDOWN, setSaUPDOWN] = useState();
    const [saColour, setSaColour] = useState();
    const [timeUPDOWN, setTimeUPDOWN] = useState();
    const [locationDirection, setlocationDirection] = useState();
    const [locationDistance, setlocationDistance] = useState();

    const [countryNames, setCountryNames] = useState([]);
    const [timeNumber, setTimeNumber] = useState(props.timeLeft);
    
    // scoring
    const MAX_TIME = props.timeLeft;
    const MAX_GUESS = props.maxGuesses;
    const [numberOfGuessesUsed, setNumberOfGuessesUsed] = useState(0);
    const [Score, setScore] = useState(10000);



    useEffect(() => {
        if(timeNumber > 0)
        {
            setTimeout(() => setTimeNumber(timeNumber - 1), 1000)
            if(!correctStatus){
                setScore(Math.floor(10000-((5000*((MAX_TIME-timeNumber)/MAX_TIME))+(5000*(numberOfGuessesUsed/MAX_GUESS)))))
            }
        }
      }, [timeNumber]);

    useEffect(() => {
        fetch('/api/countryNames').then(res => res.json()).then(names => {
            setCountryNames(names);
        });
        setloading(false);
    }, []);

    const [value, setValue] = useState('');

    const onChange = (event) => {
        setValue(event.target.value);
    }

    const check_guess = (country_code,countryName) => {
        setloading(true);
        setLastGuess(countryName+"❌")
        fetch('/api/make_a_guess?answer_submitted=' + country_code).then(res => res.json()).then(resp => {
            setcorrectStatus(resp.correct_status);
            setPopulationUPDOWN(resp.actual_country.population.directionupdown);
            setPopulationColour(resp.actual_country.population.howClose);
            setSaUPDOWN(resp.actual_country.surface_area.directionupdown);
            setSaColour(resp.actual_country.surface_area.howClose);
            setTimeUPDOWN(resp.actual_country.time_diff_hours_off);
            setlocationDirection("rotate("+resp.actual_country.proximity.direction* (180/Math.PI)+"deg)");
            console.log(resp.actual_country.proximity.direction* (180/Math.PI))
            setlocationDistance(resp.actual_country.proximity.distanceKM* (180/Math.PI));

            let others = resp.actual_country;
            delete others['population'];
            delete others['surface_area'];
            delete others['time_diff_hours_off'];
            delete others['proximity'];
            setOtherCountryData(others);
            setValue("");
            setloading(false);

            if(!correctStatus)
            {
                setNumberOfGuessesUsed(numberOfGuessesUsed+1)
                setScore(Math.floor(10000-((5000*((MAX_TIME-timeNumber)/MAX_TIME))+(5000*(numberOfGuessesUsed/MAX_GUESS)))))
            }
            
        });
    }

    if (numberOfGuessesUsed == MAX_GUESS) {
        return (<> <div><p style={{color: 'black',position:"relative",top:"-22px"}}>Time Left: {timeNumber}s</p></div>
        <p className='waiting'>Out Of Guesses</p>
        </>);
    }

    if (loading) {
        return (<p className='waiting'>Loading...</p>);
    }

    if (correctStatus) {
        return (<> <div><p style={{color: 'black',position:"relative",top:"-22px"}}>Time Left: {timeNumber}s</p></div>
        <p className='waiting'>Correct!</p>
        </>);
    }


    return (
        <div className="question-container" style={{ padding: '30px', color: "white" }}>
            <div>
                <p style={{ textAlign: 'right' , color: 'black'}}>
                Time Left: {timeNumber}s<br/>
                Guesses Left: {MAX_GUESS-numberOfGuessesUsed}<br/>
                Score: {Score}
                </p>
            </div>
            <h2 style={{textAlign:'center'}}>{lastGuess}</h2>
            <div id="country_stats" style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div className='d-flex flex-sm-column justify-content-center'>
                    <b>Population</b>
                    <bubble style={{ backgroundColor: populationColour }}>{populationUPDOWN}</bubble>
                </div>
                <div className='d-flex flex-sm-column justify-content-center'>
                    <b>SA</b>
                    <bubble style={{ backgroundColor: saColour }}>{saUPDOWN}</bubble>
                </div>
                <div className='d-flex flex-sm-column justify-content-center'>
                    <b>Direction</b>
                    <bubble>
                        <p style={{transform:locationDirection, fontSize:"40px"}}>⬆️</p>
                    </bubble>
                </div>
                <div className='d-flex flex-sm-column justify-content-center'>
                    <b>Distance</b>
                    <bubble>
                        {Math.ceil(locationDistance)} Km
                    </bubble>
                </div>
                <div className='d-flex flex-sm-column justify-content-center'>
                    <b>Time</b>
                    <bubble>{timeUPDOWN} Hrs</bubble>
                </div>
            </div>
            <br />
            <br />
            <div className='search-container'>
                <div className='search-inner'>
                    <input type='text' placeholder='Start Typing a Country' value={value} onChange={onChange} />
                </div>
                <div className='dropdown'>
                    {countryNames.filter((item) => {
                        const searchTerm = value.toLowerCase();
                        const country = item.country_name.toLowerCase();
                        return (searchTerm && country.startsWith(searchTerm));
                    })
                        .slice(0, 10)
                        .map((item) => (
                            <button
                                onClick={() => check_guess(item.country_id,item.country_name)}
                                value={item.country_id}
                                className='btn btn-secondary btn-sm w-100'
                                key={item.country_id}
                                style={{ padding: "5px" }}
                            >
                                {item.country_name}
                            </button>
                        ))}
                </div>
            </div>
            <br />
            <b>Other</b>
            <div id="country_other_stats" style={{ display: 'flex', justifyContent: 'space-around' }}>
                {Object.keys(otherCountryData).map(key => (<small>{key} : {String(otherCountryData[key])}</small>))}
            </div>
        </div>
    );
};

export default Question;