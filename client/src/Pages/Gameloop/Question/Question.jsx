import React from 'react';
import "./Question.css";
import arrow from '../GameloopImages/arrow.png'

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

    const [display_searchbox_mobile, set_display_searchbox_mobile] = useState(false);
    const [display_mapbox, set_display_mapbox] = useState(false);

    const [myScore, setMyScore] = useState(0);



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
            fetch('/api/getScores?sessionID='+props.sessionID).then(res => res.json()).then(stateJson => {
                setMyScore(stateJson.myScore);
            });
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
            setlocationDirection("rotate("+resp.actual_country.proximity.direction+"deg)");
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
            set_display_searchbox_mobile(false)

        });
    }

    function toggle_mobile_search(){
        set_display_searchbox_mobile(!display_searchbox_mobile)
    }

    function toggle_mapbox(){
        set_display_mapbox(!display_mapbox)
    }

    if (numberOfGuessesUsed > MAX_GUESS) {
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
                Round Score: {Score}<br/>
                Total Score: {myScore}
                </p>
            </div>
            <div style={(lastGuess!==undefined)?null:{visibility:"hidden",maxHeight:"0px"}}>
            <h2 style={{textAlign:'center'}}>{lastGuess}</h2>
            <a className='w-100' onClick={toggle_mapbox}>Show Map</a>
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
                        <img style={{transform:locationDirection}} className="w-75" src={arrow}></img>
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
            <div id="country_other_stats">
                {Object.keys(otherCountryData).map(key => (<div style={otherCountryData[key]==true?{backgroundColor:"green"}:{backgroundColor:"red"}} className='other_box'>{key}</div>))}
            </div>
            </div>
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
            <br/>
            <btn className="mobile_guess_btn btn btn-secondary w-100" onClick={toggle_mobile_search}>Make A Guess</btn>
            <div className='mobile-search-container' style={display_searchbox_mobile==true?{display:"block"}:{display:"none"}}>
                <a className='w-100' onClick={toggle_mobile_search}>X CLOSE</a>
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
            <div className='map_box' style={display_mapbox==true?{display:"block"}:{display:"none"}}>
                <a className='w-100' onClick={toggle_mapbox}>X CLOSE</a>
                <iframe className='w-100 h-100' title="map" id="googlemap" src={"https://maps.google.com/maps?q="+lastGuess+"country&t=&z=5&ie=UTF8&iwloc=&output=embed"} frameborder="0" marginheight="0" marginwidth="0"></iframe>
            </div>
        </div>
    );
};

export default Question;