module.exports = function (app, DBconnection) {
    // === Need to check that game state in "dispaying question" before accepting answer === - Alex

    // submit a guess, will return correct status and the stats of guess country and stats of answer country 
    app.get('/api/make_a_guess', (req, res) => {
        let user = req.userID;
        let user_verified = user != undefined;
        let answer_submitted = req.query.answer_submitted;

        if (!user_verified) {
            //console.log(user);
            res.status(401).send({
                auth_status: user_verified
            });
        }
        else{
            DBconnection.query("call check_country_guess_correct(?,?)",
            [answer_submitted, user], function (error, results) {
                console.log(results);
                if (error) {
                    console.log(error);
                    res.status(500).status()
                }
                else {
                    try {
                        //console.log(results);

                        guess = results[0][0]

                        actual_docted = results[4][0];
                        //console.log(actual_docted);
                        status_of_correct = guess.country_id == actual_docted.country_id;

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
                                time_diff_hours_off: Number(guess["timezone"].substring(3, 6)) - Number(actual_docted["timezone"].substring(3, 6)),
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
    });

    function compare_and_give_direction(guess_lat, guess_lng, target_lat, target_lng) {

        const R = 6371e3 / 1000; //kilo metres
        const lat1r = guess_lat * Math.PI / 180; // ??, ?? in radians
        const lat2r = target_lat * Math.PI / 180;
        const deltaLat = (target_lat - guess_lat) * Math.PI / 180;
        const deltaLng = (target_lng - guess_lng) * Math.PI / 180;

        const heading = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(lat1r) * Math.cos(lat2r) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(heading), Math.sqrt(1 - heading));

        const _distance = R * c; // kilo metres


        return ({
            direction: heading,
            distanceKM: _distance
        })
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

    ///// /api/has_everyone_answered /////
    // check if for that quiz, if there are any participants where answered = 0
    // SELECT COUNT(answered) from participants where quiz_session_id={session_id} and answered = 0
    // in JS if == 0, return TRUE else FALSE
    app.get('/api/has_everyone_answered', (req, res) => {
        let quiz_session_id = "19";
        DBconnection.query("call check_if_all_participants_have_answered(?)", [quiz_session_id], function (error, results) {

            if (error) {
                res.status(500).send();
            }
            else {
                res.status(200).send({
                    all_answered_current_question: (results[0][0]['COUNT(*)'] == 0),
                });
            }
        })
    });

    app.get('/api/countryNames', (req, res) => {
        res.sendFile(`${__dirname}/static_files/country_name_list.json`);
    });

}