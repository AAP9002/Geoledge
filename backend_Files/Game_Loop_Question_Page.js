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
                // SessionID is valid. Proceeding...

                // Checking to see if the client can still make further guesses
                let canUserMakeMoreGuesses = checkIfCanGuess(session_id, user);

                canUserMakeMoreGuesses.then(function(result) {
                    if (result == null || result == undefined || result == 1) {
                        // Client cannot make more guesses :/
                        res.status(401).send("No more guesses allowed");

                    } else {
                        // Client is allowed to make further guesess. Making a guess...
                        if (!user_verified) {
                            //console.log(user);
                            res.status(401).send({
                                auth_status: user_verified
                            });
                        } else {
                            makeAGuess(session_id, user, answer_submitted, user_verified, res);
                        }
                    }
                });
            }
        })
    });

    function makeAGuess(session_id, user_id, answer_submitted, user_verified, res) {

        let promise = new Promise(function(resolve) {
            DBconnection.query("call check_country_guess_correct(?,?)",
                                    [answer_submitted, user_id], function (error, results) {
                console.log(results);

                if (error) {
                    console.log(error);
                    res.status(500).status({errorMessage:error});
                    resolve(null);
                } else {
                    try {
                        //console.log(results);
                        resolve(results);
                    } catch {
                        res.status(500).send("Error when processing data, may be not in game or not in question state")
                    }
                }
            })
        });

        promise.then(function(results) {
            if (results != null) {
                guess = results[0][0];

                actual_docted = results[4][0];
                //console.log(actual_docted);
                status_of_correct = guess.country_id == actual_docted.country_id;
                console.log(Number(guess["timezone"].substring(3, 6)));
                console.log(Number(actual_docted["timezone"].substring(3, 6)));

                
                if (status_of_correct) {
                    // Checking if all players are ready for next round (and changing game state if they are)#
                    let promise2 = checkIfReadyForNextRound(session_id);

                    promise2.then(function(result) {
                        if (result == null || result[0].length == 0) {
                            console.log(":/")
                        } else {
                            if (result[0][0].result == 0) {
                                // All participents are either out of guesses or have answered the question correctly
                                // Moving game_state to revealing answer
                                let query = "call update_game_state(?,?)"

                                DBconnection.query(query, [session_id, "revealing answer"], (err, result) => {
                                    if (err) {
                                        console.log("Error occured when updating game state in game loop API");
                                    }
                                })
                            }
                        }
                    });

                } else {
                    // Setting "answered" column true if max_guesses reached
                    let promise2 = checkIfMaxGuessesReached(session_id, user_id);

                    promise2.then(function(resolve) {
                        if (resolve) {
                            console.log("client out of guesses");
                            // Client has made their maximum number of guesses. Setting "answered" column to true
                            let promise3 = new Promise(function(resolve) {
                                let query = 'call set_answered_true(?,?)';

                                DBconnection.query(query, [session_id, user_id], (err, result) => {
                                    if (err) {
                                        console.log("Error when setting answered true");
                                        resolve(null);
                                    } else {
                                        resolve(true);
                                    }
                                });
                            });

                            promise3.then(function(result) {
                                // Checking if all players are ready for next round (and changing game state if they are)
                                let promise4 = checkIfReadyForNextRound(session_id);

                                promise4.then(function(result) {
                                    if (result == null || result[0].length == 0) {
                                        console.log(":/")
                                    } else {
                                        if (result[0][0].result == 0) {
                                            // All participents are either out of guesses or have answered the question correctly
                                            // Moving game_state to revealing answer

                                            let query = "call update_game_state(?,?)"

                                            DBconnection.query(query, [session_id, "revealing answer"], (err, result) => {
                                                if (err) {
                                                    console.log("Error occured when updating game state in game loop API");
                                                }
                                            })
                                        }
                                    }
                                });
                            });
                        }
                    });
                }
                
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
                        time_diff_hours_off: (Number(actual_docted["timezone"])+24)-(Number(guess["timezone"])+24) ,
                        driving_side: (actual_docted["driving_side"] == guess["driving_side"]),
                        capital: (actual_docted["capital"] == guess["capital"]),
                        language: (actual_docted["language"] == guess["language"]),
                        currency: (actual_docted["currency"] == guess["currency"]),
                    }
                });

                
            }
        })
    }

    function compare_and_give_direction(guess_lat, guess_lng, target_lat, target_lng) {

        const R = 6371e3 / 1000; //kilo metres
        const lat1r = guess_lat * Math.PI / 180; // φ, λ in radians
        const lat2r = target_lat * Math.PI / 180;
        const deltaLat = (target_lat - guess_lat) * Math.PI / 180;
        const deltaLng = (target_lng - guess_lng) * Math.PI / 180;

        const heading = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(lat1r) * Math.cos(lat2r) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(heading), Math.sqrt(1 - heading));

        const _distance = R * c; // kilo metres


        const direction_calculated =  angleLngLat(guess_lat+360, guess_lng+360,target_lat+360, target_lng+360)
        return ({
            direction: direction_calculated,
            distanceKM: _distance
        })
    }

    // ref: https://www.sunearthtools.com/tools/distance.php
    function angleLngLat(lat1, lng1, lat2, lng2) {

        //convert to radians
        const pi = Math.PI

        lat1r = lat1 * pi / 180; 
        lat2r = lat2 * pi / 180; 
        lng1 = lng1 * pi / 180; 
        lng2 = lng2 * pi / 180; 

        a = Math.log((Math.tan((lat2r/2)+(pi/4))/Math.tan((lat1r/2)+(pi/4))));
        delta_lon = Math.abs(lng1-lng2)%pi;
        baring = Math.atan2(delta_lon,a);
        console.log(baring);
        baring = (baring*(180/pi));

        if (lng2<lng1){
            baring = - baring; 
        }
        return baring;
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
                if (result[0].length == 0) {
                    console.log("No country returned")
                    res.status(500).send({"status": "Error occured on the server"})
                } else {
                    let game_state = result[0][0].game_state
                    if (game_state == "revealing answer") {
                        res.status(200).send(result[2][0])
                    } else {
                        res.status(401).send({"status": "Invalid state for revealing an answer"})
                    }
                }
            }
            , function(err) {
                console.log("sql broken: " + err)
                res.status(500).send({"status": "Error occured on the server"})
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
    
    function checkIfReadyForNextRound(session_id) {
        // Game is ready to move to the next round when all players have either answered the question correctly or are out of guesses
        let promise = new Promise(function(resolve) {
            let query = 'call check_for_participents_not_answered(?)'

            DBconnection.query(query, [session_id], (err, result) => {
                if (err) {
                    console.log("Error when checking if participents are ready to move on to the next round (when timer still on)");
                    resolve(null);
                } else {
                    resolve(result);
                }
            })
        });

        return promise;
    }

    function checkIfMaxGuessesReached(session_id, user_id) {
        // Checks if the client has made all their guesses (if guesses == max_guesses)
        let promise = new Promise(function(finalResolve) {

            let promise2 = new Promise(function(resolve) {
                // getting max guesses of session
                let query = 'call get_max_guesses(?)';

                DBconnection.query(query, [session_id], (err, result) => {
                    if (err) {
                        console.log("Error when getting the max guessses of a session")
                        resolve(null);
                    } else {
                        resolve(result);
                    }
                })
            });

            promise2.then(function(result) {
                if (result == null || result[0].length == 0) {
                    console.log("Issue when getting max guesses of a session...");
                    return false;
                } else {
                    let max_guesses = result[0][0].max_guesses;

                    // Getting the number of guesses the user has made
                    let promise3 = new Promise(function(resolve) {
                        let query = 'call get_guesses(?,?)'

                        DBconnection.query(query, [session_id, user_id], (err, result) => {
                            if (err) {
                                console.log("Error when getting the number of guesses the user has made");
                                resolve(null);
                            } else {
                                resolve(result);
                            }
                        });
                    });

                    promise3.then(function(result) {
                        if (result == null || result[0].length == 0) {
                            console.log("Issue when getting number of guesses made by user...");
                            finalResolve(false);
                        } else {
                            // checking if client has made the max number of guesses
                            if (result[0][0].guesses >= max_guesses) {
                                finalResolve(true);
                            } else {
                                finalResolve(false);
                            }
                        }
                    })
                }
            })
        });

        return promise;
    }

    function checkIfCanGuess(sessionID, userID) {
        // Returns true if the user is allowed to submit further guesses (answered == 0)

        let promise = new Promise(function(resolve) {
            let query = 'call check_if_answered(?,?)';    // checks if client is out of guesses or have already gotten the answer correct

            DBconnection.query(query, [sessionID, userID], (err, result) => {
                if (err) {
                    console.log("Error occured when getting max guesses in a session");
                    resolve(null);
                } else {
                    if (result[0].length == 0) {
                        // no such userID with given sessionID exists exists in the database
                        resolve(null);
                    } else {
                        resolve(result[0][0].answered);
                    }
                }
            })
        });

        return promise;
    }

}