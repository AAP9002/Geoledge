import React from 'react';
import "./Question.css";

import { useState, useEffect } from 'react';


const Question = () => {
    const [loading, setloading] = useState(false);
    const [otherCountryData, setOtherCountryData] = useState("");
    const [correctStatus, setcorrectStatus] = useState(true);


    const [populationUPDOWN, setPopulationUPDOWN] = useState();
    const [populationColour, setPopulationColour] = useState();
    const [saUPDOWN, setSaUPDOWN] = useState();
    const [saColour, setSaColour] = useState();
    const [timeUPDOWN, setTimeUPDOWN] = useState();
    const [locationDirection, setlocationDirection] = useState();
    const [locationDistance, setlocationDistance] = useState();


    // search bar stuff start
    const [countryNames, setCountryNames] = useState([]);

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

    const check_guess=(country_code)=>{
        setloading(true);
        fetch('/api/make_a_guess?answer_submitted=' + country_code).then(res => res.json()).then(resp => {
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
            setValue("");
            setloading(false);
        });
    }

    if (loading) {
        return (<h1>Loading...</h1>);
    }

    return (
        <div className="question-container" style={{ padding: '30px', color:"white" }}>
            <br />
            <br />
            <div><h2 style={{ textAlign: 'right' }}>Time Left: XXXXX</h2></div>
            <br />
            <br />
            <div id="country_stats" style={{ display: 'flex', justifyContent: 'space-around' }}>
                <b style={{ color: populationColour }}>Population: {populationUPDOWN}</b>
                <b style={{ color: saColour }}>Surface Area: {saUPDOWN}</b>
                <b>Location: [{locationDirection},{locationDistance}]</b>
                <b>Time Difference {timeUPDOWN}</b>
            </div>
            <br />
            <br />
            <b>Other</b>
            <div id="country_other_stats" style={{ display: 'flex', justifyContent: 'space-around' }}>
                {Object.keys(otherCountryData).map(key => (<small>{key} : {String(otherCountryData[key])}</small>))}
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
                        return (searchTerm && country.startsWith(searchTerm) && country !== searchTerm);
                    })
                        .slice(0, 10)
                        .map((item) => (
                            <button
                                onClick={() => check_guess(item.country_id)}
                                value={item.country_id}
                                className='btn btn-secondary btn-sm w-100'
                                key={item.country_id}
                                style={{padding:"5px"}}
                            >
                                {item.country_name}
                            </button>
                        ))}
                </div>
            </div>
            <br />
            <h1>Correct? ... {String(correctStatus)}</h1>
        </div>
    );
};

export default Question;