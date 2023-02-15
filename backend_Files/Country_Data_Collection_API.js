module.exports = function (app) {
    const axios = require('axios'); // use to get country api data from web

    ////////////// COUNTRY API Start //////////////
    //get cleaned country data
    app.get('/api/getallcountrydata', function(req, res) {
        axios.get('https://restcountries.com/v3.1/all')
        .then(response => {
        res.setHeader('Content-Type', 'application/json');
        
        res.json(GenerateCountryDataTable(response.data));
        });
    
    });
    

    // clean country data from API ans return json b=object with formatted data
    function GenerateCountryDataTable(response){
        var countries = response;
        var formattedCountries = [];
    
        for(let i =0; i<countries.length;i++){
        // NOTE some countries don't have capitals
        var capitalName = "No Capital"
        if(countries[i].capital == undefined){
            //console.log(countries[i].name.common)
        }
        else{
            capitalName = countries[i].capital[0]
        }
    
        //LANGUAGE
        //seems to be only Antarctica
        var langName = "No Official Language"
        if(countries[i].languages == undefined){
            console.log(countries[i].name.common)
        }
        else{
            langName = Object.entries(countries[i].languages)[0][1]
        }
    
        //Currency
        //Antarctica, Bouvet Island and Heard Island and McDonald Islands don't have an official currency
        var currencySymbol = "Unknown Currency"
        if(countries[i].currencies == undefined){
            console.log(countries[i].name.common)
        }
        else{
            currencySymbol = Object.entries(countries[i].currencies)[0][1].symbol
        }
    
        //clean and make country object
        var individualCountry = {
            name: countries[i].name.common,
            independent: countries[i].independent,
            unMember: countries[i].unMember,
            region: countries[i].region,
            lat: countries[i].latlng[0],
            lng: countries[i].latlng[1],
            surface_area: countries[i].area,
            population: countries[i].population,
            timezone:Object.entries(countries[i].timezones)[0][1],
            driving_side: countries[i].car.side,
            capital: capitalName,
            flag:countries[i].flags.svg,
            language: langName,
            map: "https://maps.google.com/maps?q="+countries[i].name.common+"+country&amp;t=&amp;ie=UTF8&amp;iwloc=&amp;output=embed",
            currency: currencySymbol
        }
    
        formattedCountries.push(individualCountry) // add country to countries object
        }
    
        return formattedCountries;
    
    }
    
    //////////// Country API End ////////////////
}