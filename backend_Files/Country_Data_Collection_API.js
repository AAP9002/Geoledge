module.exports = function (app, DBconnection) {
    const axios = require('axios'); // use to get country api data from web

    //get cleaned country data
    app.get('/api/getallcountrydata', function(req, res) {
        axios.get('https://restcountries.com/v3.1/all')
        .then(response => {
        res.setHeader('Content-Type', 'application/json');
        
        res.json(GenerateCountryDataTable(response.data));
        });
    
    });

    //get cleaned country data
    app.get('/api/allcountries', function(req, res) {
        DBconnection.query("select * from country", function(error, results){
            console.log(results);
            res.send(results);
        })
    });

//     // test if can get a record from mysql database and return json
//     app.get('/express_backend', (req, res) => {
//         DBconnection.query("select * from temp", function(error, results){
//       console.log(results);
//       res.send({  results  });
//     })
//   });
  
//   app.get('/express_backend_insert', (req, res) => {
//     DBconnection.query("INSERT INTO `temp` (`id`, `name`) VALUES ('14', 'Alex') ", function(error, results){
//       console.log(results);
//       res.send({  results  });
//     })
//   });
    

    // clean country data from API ans return json object with formatted data
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
            country_id:i,
            country_name: countries[i].name.common,
            independent: countries[i].independent,
            unMember: countries[i].unMember,
            region: countries[i].region,
            latitude: countries[i].latlng[0],
            longitude: countries[i].latlng[1],
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

    function update_data_on_database(formatted_country_data){
        // doing it manually atm
    }
}