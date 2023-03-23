const { urlencoded } = require("express");

module.exports = function (app, DBconnection) {
    // === Need to check that game state in "dispaying question" before accepting answer === - Alex

    // submit a guess, will return correct status and the stats of guess country and stats of answer country 
    app.get('/api/make_a_guess', (req, res) => {
        let user = req.userID;
        let user_verified = user != undefined;
        let answer_submitted = req.query.answer_submitted;
        let session_id = req.query.sessionID;

        // Checking if sessionID is valid
        let promise = new Promise(function(resolve) {
            let query = `SELECT game_state FROM session WHERE session_id=${ session_id }`

            DBconnection.query(query, (err, result) => {
                if (err) {
                    resolve(null);
                } else {
                    resolve(result);
                }
            })
        })

        promise.then(function(result) {
            if (result == null) {
                res.status(200).send("Not in valid game state or session id doesn't exist")
            } else {
                if (!user_verified) {
                    //console.log(user);
                    res.status(401).send({
                        auth_status: user_verified
                    });
                }
                else {
                    DBconnection.query("call check_country_guess_correct(?,?)",
                        [answer_submitted, user], function (error, results) {
                            console.log(results);
                            if (error) {
                                console.log(error);
                                res.status(500).status({errorMessage:error});
                            }
                            else {
                                try {
                                    //console.log(results);
        
                                    guess = results[0][0]
        
                                    actual_docted = results[4][0];
                                    //console.log(actual_docted);
                                    status_of_correct = guess.country_id == actual_docted.country_id;
                                    console.log(Number(guess["timezone"].substring(3, 6)));
                                    console.log(Number(actual_docted["timezone"].substring(3, 6)));
                                    res.status(200).send({
                                        auth_status: user_verified,
                                        correct_status: status_of_correct,
                                        guess_country: guess,
                                        actual_country: {
                                            independent: (actual_docted["independent"] == guess["independent"]),
                                            unMember: (actual_docted["unMember"] == guess["unMember"]),
                                            region: (actual_docted["region"] == guess["region"]),
                                            proximity: compare_and_give_direction(guess["latitude"], guess["longitude"], actual_docted["latitude"], actual_docted["longitude"]),
                                            surface_area: value_distance_score(guess["surface_area"], actual_docted["surface_area"]),
                                            population: value_distance_score(guess["population"], actual_docted["population"]),
                                            time_diff_hours_off: (Number(actual_docted["timezone"].substring(3, 6))+12)-(Number(guess["timezone"].substring(3, 6))+12) ,
                                            driving_side: (actual_docted["driving_side"] == guess["driving_side"]),
                                            capital: (actual_docted["capital"] == guess["capital"]),
                                            language: (actual_docted["language"] == guess["language"]),
                                            currency: (actual_docted["currency"] == guess["currency"]),
                                        }
                                    });
                                }
                                catch {
                                    res.status(500).send("Error when processing data, may be not in game or not in question state")
                                }
                            }
                        })
                }
            }
        })


        
    });

    function compare_and_give_direction(guess_lat, guess_lng, target_lat, target_lng) {

        const R = 6371e3 / 1000; //kilo metres
        const lat1r = guess_lat * Math.PI / 180; // φ, λ in radians
        const lat2r = target_lat * Math.PI / 180;
        const deltaLat = (target_lat - guess_lat) * Math.PI / 180;
        const deltaLng = (target_lng - guess_lng) * Math.PI / 180;

        const heading = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(lat1r) * Math.cos(lat2r) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(heading), Math.sqrt(1 - heading));

        const _distance = R * c; // kilo metres


        const direction_calculated =  angleLngLat(guess_lat, guess_lng,target_lat, target_lng)
        return ({
            direction: direction_calculated,
            distanceKM: _distance
        })
    }

    function angleLngLat(lat1, lng1, lat2, lng2) {
        y = Math.sin(lng2 - lng1) * Math.cos(lat2);
        x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);

        direction_calculated = Math.atan2(y, x);
        direction_calculated = (direction_calculated*(180/Math.PI));
        direction_calculated = (direction_calculated + 360) % 360;
        direction_calculated = 360 - direction_calculated +90;

        return direction_calculated;
    }

    function value_distance_score(guess, actual) {
        numguess = Number(guess);
        numactual = Number(actual);

        //console.log(numguess,numactual)
        upDownCorrect = "";
        closeToCorrect = "RED";

        if (numguess < numactual) {
            upDownCorrect = "UP"
        }
        else if (numguess > numactual) {
            upDownCorrect = "DOWN"
        }
        else {
            upDownCorrect = "CORRECT"
        }

        difference = Math.abs(numguess - numactual)

        //within 25% of actual value
        if (difference <= (numactual * 0.25)) {
            closeToCorrect = "YELLOW"
        }
        //within 10% of actual value
        if (difference <= (numactual * 0.1)) {
            closeToCorrect = "AMBER"
        }
        //correct
        if (difference == 0) {
            closeToCorrect = "GREEN"
        }

        return ({
            directionupdown: upDownCorrect,
            howClose: closeToCorrect
        })
    }

    app.get('/api/countryNames', (req, res) => {
        res.sendFile(`${__dirname}/static_files/country_name_list.json`);
    });

    // Sends country name answer of current question
    app.get('/api/revealAnswer', (req, res) => {
        let sessionID = req.query.sessionID;
        let myPromise = new Promise(function (myResolve, myReject) {
            let query = `call answer(?)`
            DBconnection.query(query, [sessionID], (err, result) => {
                if (err) {
                    myReject(err);
                } else {
                    myResolve(result); // pass countries to next promise
                }
            })
        });

        myPromise.then(
            function(result) {
                console.log(result)
                let game_state = result[0][0].game_state
                let answer = result[2][0].country_name
                if (game_state == "revealing answer") {
                    res.status(200).send({ country_name: answer})
                } else {
                    res.status(401).send("game state not in revealing answer yet")
                }
            }
            , function(err) {
                console.log("sql broken: " + err)
                res.status(500).send()
            }
        )
    });

    app.get('/api/isHost', (req, res) => {
        let sessionID = req.query.sessionID;
        let userID = req.userID;
        if (userID == null) {
            res.status(401).send({ status: "User is not logged in"})
        }
        else {
            let query = `call is_host(?,?)`
            DBconnection.query(query, [sessionID, userID], (err, result) => {
                if (err) {
                    console.log("sql broken" + err)
                    res.status(500).send()
                } 
                else {
                    if (result[0].length == 0) {
                        res.status(500).send({ status: "Invalid session id, or doesn't exist"})
                    } else {
                        res.status(200).send({ is_host: result[0][0].value})
                    }
                }
            });
        }
    });
    
}