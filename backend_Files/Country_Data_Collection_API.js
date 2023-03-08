// Handling country data collection and storage on database
// /api/getallcountrydata -> call country api and update database
// /api/allcountries -> return json of all countries on database
//
// GenerateCountryDataTable -> clean and restructure api country data
// update_data_on_database -> per country, call sql stored procedure to update database

module.exports = function (app, DBconnection) {
    const axios = require('axios'); // use to get country api data from web

    //get cleaned country data
    app.get('/api/getallcountrydata', function (req, res) {
        axios.get('https://restcountries.com/v3.1/all')
            .then(response => {
                res.setHeader('Content-Type', 'application/json');
                console.log("Getting country data from external API")
                let success = update_data_on_database(GenerateCountryDataTable(response.data));

                res.json({ updated_database: success });
            });
    });

    //get cleaned country data
    app.get('/api/allcountries', function (req, res) {
        DBconnection.query("select * from country", function (error, results) {
            console.log(results);
            res.send(results);
        })
    });


    // clean country data from API ans return json object with formatted data
    function GenerateCountryDataTable(response) {
        var countries = response;
        var formattedCountries = [];

        for (let i = 0; i < countries.length; i++) {
            // NOTE some countries don't have capitals
            var capitalName = "No Capital"
            if (countries[i].capital == undefined) {
                //console.log(countries[i].name.common)
            }
            else {
                capitalName = countries[i].capital[0]
            }

            //LANGUAGE
            //seems to be only Antarctica
            var langName = "No Official Language"
            if (countries[i].languages == undefined) {
                console.log(countries[i].name.common)
            }
            else {
                langName = Object.entries(countries[i].languages)[0][1]
            }

            //Currency
            //Antarctica, Bouvet Island and Heard Island and McDonald Islands don't have an official currency
            var currencySymbol = "Unknown Currency"
            if (countries[i].currencies == undefined) {
                console.log(countries[i].name.common)
            }
            else {
                currencySymbol = Object.entries(countries[i].currencies)[0][1].symbol
            }

            //clean and make country object
            var individualCountry = {
                country_id: countries[i].cca3,
                country_name: countries[i].name.common,
                independent: countries[i].independent,
                unMember: countries[i].unMember,
                region: countries[i].region,
                latitude: countries[i].latlng[0],
                longitude: countries[i].latlng[1],
                surface_area: countries[i].area,
                population: countries[i].population,
                timezone: Object.entries(countries[i].timezones)[0][1],
                driving_side: countries[i].car.side,
                capital: capitalName,
                flag: countries[i].flags.svg,
                language: langName,
                map: "https://maps.google.com/maps?q=" + countries[i].name.common + "+country&amp;t=&amp;ie=UTF8&amp;iwloc=&amp;output=embed",
                currency: currencySymbol
            }

            formattedCountries.push(individualCountry) // add country to countries object
        }

        return formattedCountries;

    }

    function update_data_on_database(formatted_country_data) {
        console.log("Starting to push updates to database")
        for (let i = 0; i < formatted_country_data.length; i++) {
            let country = formatted_country_data[i]
            DBconnection.query("call ProcUpdateCountryRecord(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [country.country_id, country.country_name,
                country.independent, country.unMember, country.region,
                country.latitude, country.longitude, country.surface_area,
                country.population, country.timezone, country.driving_side,
                country.capital, country.flag, country.language,
                country.map, country.currency],
                function (err, result) {
                    if (err) {
                        console.log("err:", err);
                        return false;
                    } else {
                        console.log("Country ", (i + 1), " [", country.country_name, "] was updated")
                    }

                });
        }
        console.log("Countries in database updated")
        return true;
    }
}