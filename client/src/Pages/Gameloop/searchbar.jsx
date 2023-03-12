import React from 'react';
import "./Question.css";
import { useState, useEffect } from 'react';

useEffect(() => {
    fetch('/api/countryNames').then(res => res.json()).then(names =>{
        setCountryNames(names);
        setloading(false);
    });
}, []);


const Searchbar = () => {
console.log(names)
}


export default Searchbar