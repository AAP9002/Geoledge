import React from 'react';
import "./Question.css";

import { useState, useEffect } from 'react';


const Question = () => {
    const [loading, setloading] = useState(true);
    const [countryNames, setCountryNames] = useState([]);
    const [guessTextbox, setGuessText] = useState("");
    const [otherCountryData, setOtherCountryData] = useState("");
    const [correctStatus, setcorrectStatus] = useState(false);



    const [populationUPDOWN, setPopulationUPDOWN] = useState();
    const [populationColour, setPopulationColour] = useState();
    const [saUPDOWN, setSaUPDOWN] = useState();
    const [saColour, setSaColour] = useState();
    const [timeUPDOWN, setTimeUPDOWN] = useState();
    const [locationDirection, setlocationDirection] = useState();
    const [locationDistance, setlocationDistance] = useState();



    useEffect(() => {
        fetch('/api/countryNames').then(res => res.json()).then(names =>{
            setCountryNames(names);
            setloading(false);
        });
    }, []);

    function check_guess() {
        setloading(true);
        fetch('/api/make_a_guess?answer_submitted='+guessTextbox).then(res => res.json()).then(resp =>{
            setcorrectStatus(resp.correct_status);
            setPopulationUPDOWN(resp.actual_country.population.directionupdown);
            setPopulationColour(resp.actual_country.population.howClose);
            setSaUPDOWN(resp.actual_country.surface_area.directionupdown);
            setSaColour(resp.actual_country.surface_area.howClose);
            setTimeUPDOWN(resp.actual_country.time_diff_hours_off);
            setlocationDirection(resp.actual_country.proximity.direction);
            setlocationDistance(resp.actual_country.proximity.distanceKM);
    
            let others = resp.actual_country;
            delete others['population'];
            delete others['surface_area'];
            delete others['time_diff_hours_off'];
            delete others['proximity'];
            setOtherCountryData(others);

            setloading(false);
        });
    }

    function handleChangeGuessValue(e) {
        setGuessText(e.target.value);
    }

    if (loading) {
        return(<h1>Loading...</h1>);
    }

    return (
        <div style={{padding:'30px'}}>
            <br/>
            <br/>
            <div><h2 style={{textAlign:'right'}}>Time Left: XXXXX</h2></div>
            <br/>
            <br/>
            <div id="country_stats" style={{ display: 'flex', justifyContent: 'space-around' }}>
                <b style={{ color: populationColour }}>Population: {populationUPDOWN}</b>
                <b style={{ color: saColour }}>Surface Area: {saUPDOWN}</b>
                <b>Location: [{locationDirection},{locationDistance}]</b>
                <b>Time Difference {timeUPDOWN}</b>
            </div>
            <br/>
            <br/>
            <b>Other</b>
            <div id="country_other_stats" style={{ display: 'flex', justifyContent: 'space-around' }}>
                {Object.keys(otherCountryData).map(key => (<small>{key} : {String(otherCountryData[key])}</small>))}
            </div>
            <br/>
            <br/>
            <div id="guessSubmissionBox">
                <select id="country" onChange={handleChangeGuessValue}>
                    {countryNames.map((val, index) => <option value={val.country_id}>{val.country_name}</option>)}
                </select>
                <b>{guessTextbox}</b>
                <button onClick={check_guess}>Submit</button>
            </div>
            <br/>
            <br/>
            <br/>
            <h1>Correct? ... {String(correctStatus)}</h1>
        </div>
    );
};

export default Question;