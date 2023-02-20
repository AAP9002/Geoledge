module.exports = function (app, DBconnection) {

    // submit a guess, will return correct status and the stats of guess country and stats of answer country 
    app.get('/api/make_a_guess', (req, res) => {
        let user = "";
        let current_quiz_session = "27";
        let user_verified = true;
        let answer_submitted = "AGO";
        //change to AFG to get a correct status

        if (!user_verified) {
            res.send({
                auth_status: user_verified
            });
        }

        DBconnection.query("call check_country_guess_correct(?,?,?)",
            [answer_submitted, user, current_quiz_session], function (error, results) {
                
                console.log(results);

                guess = results[0][0]

                actual_docted_index = results[2][0]['num_of_questions'];
                actual_docted = results[3][Number(actual_docted_index)];
                console.log(actual_docted);
                status_of_correct = guess.country_id == actual_docted.country_id;

                delete actual_docted["country_name"];
                delete actual_docted["country_id"];
                delete actual_docted["map"];
                delete actual_docted["idcountry_set"];
                delete actual_docted["quiz_id"];

                res.send({
                    auth_status: user_verified,
                    correct_status: status_of_correct,
                    guess_country: guess,
                    actual_country: actual_docted
                });
            })

    });

    ///// /api/has_everyone_answered /////
    // check if for that quiz, if there are any participants where answered = 0
    // SELECT COUNT(answered) from participants where quiz_session_id={session_id} and answered = 0
    // in JS if == 0, return TRUE else FALSE
    app.get('/api/has_everyone_answered', (req, res) => {
        let quiz_session_id = "19";
        DBconnection.query("call check_if_all_participants_have_answered(?)",[quiz_session_id], function (error, results) {

                res.send({
                    all_answered_current_question: (results[0][0]['COUNT(*)']==0),
                });
            })
    });

}