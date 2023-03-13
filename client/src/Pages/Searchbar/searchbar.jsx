import React from 'react';
import { useState, useEffect } from 'react';
import './Searchbar.css'



function Searchbar() {


const [loading, setloading] = useState(true);
const [countryNames, setCountryNames] = useState([]);
    
useEffect(() => {
    fetch('/api/countryNames').then(res => res.json()).then(names =>{
        setCountryNames(names);
        setloading(false);
        console.log(names);
    });
}, []);

const [value, setValue] = useState('');

const onChange = (event) => {
    setValue(event.target.value);
}

const onSearch = (searchTerm) => {
    setValue(searchTerm);
    //our api to fetch the search result
    console.log('search' , searchTerm);
}

return(
    <div className='Search'>
        <h1>Search</h1>

        <div className='search-container'>
            <div className='search-inner'>
                <input type='text' placeholder='Start Typing a Country' value={value} onChange={onChange} />
                <button onClick={()=>onSearch(value)}> Search </button>
            </div>
            <div className='dropdown'>
                {countryNames.filter((item) => {
                    const searchTerm = value.toLowerCase();
                    const country = item.country_name.toLowerCase();
                    return (searchTerm && country.startsWith(searchTerm) && country !== searchTerm);
                })
                .slice(0, 10)
                .map((item) => (
                    <div onClick={()=>onSearch(item.country_name)}
                     className='drowdown-row'
                     key={item.country_id}
                     > 
                     {item.country_name}</div>
                ))}
            </div>
        </div>
    </div>

);
}



export default Searchbar