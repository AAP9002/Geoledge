import React from 'react';
import { useState, useEffect } from 'react';




const Searchbar = () => {

const [loading, setloading] = useState(true);
const [countryNames, setCountryNames] = useState([]);
    
useEffect(() => {
    fetch('/api/countryNames').then(res => res.json()).then(names =>{
        setCountryNames(names);
        setloading(false);
        console.log(names);
    });
}, []);


}


export default Searchbar