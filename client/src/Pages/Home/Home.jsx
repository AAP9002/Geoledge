import React from 'react';
import "./Home.css";
import { useEffect, useRef, useState } from 'react';




const About = () => {
    const [errorMsg, setMsg] = useState("");
    // Search for online game
    function findOnlineGame() {
        fetch('/api/checkLoggedIn', { method: "GET" }).then((res) => res.json()).then((stateJson) => {
            if (stateJson.status === 401 || stateJson.status === "Error: User is unauthorised/not logged in. Try logging in.") {
                // redirecting client to login page
                window.location.href = "/#/Log-in";
            } else {
                //Finding an online game to join
                fetch('/api/joinOnlineGame', { method: "GET" }).then(res => res.json()).then((res) => {
                    if (res.status === "sessionID found") {
                        let sessionID = res.sessionID;
                        console.log(sessionID);

                        fetch(`/api/joinLobby?sessionID=${sessionID}`, { method: "GET" }).then(res => res.json()).then((res) => {
                            console.log(res);
                            window.location.href = "/#/Game";
                            window.location.reload();
                        });

                    } else if (res.status === "no avaiable sessions") {
                        // Show error message to user
                        setMsg("No available sessions found - A perfect chance to host a game on your own! 😳")
                    } else if (res.status === "error occurred on the server") {
                        // Show error message to user
                        console.log("Error occured on the server, help!!!")
                    }
                });
            }
        });
    }

    // Host Game: Create Lobby
    function HostLobby() {
        fetch('/api/checkLoggedIn', { method: "GET" }).then((res) => {
            if (res.status === 401) {
                window.location.href = "/#/Log-in";
            } else {
                fetch('/api/createLobby', { method: "POST" }).then(res => res.json()).then(stateJson => {
                    let sessionID = stateJson.id
                    window.location.href = (`#/Play/${sessionID}`);
                    window.location.reload();
                })
            }
        })
    }


    function Joinlobby() {
        window.location.href = "/#/JoinLobby"
    }

    function FadeInSection(props) {
        const [isVisible, setVisible] = useState(true);
        const domRef = useRef();
        useEffect(() => {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => setVisible(entry.isIntersecting));
            });
            observer.observe(domRef.current);
            return () => observer.unobserve(domRef.current);
        }, []);
        return (
            <div
                className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}
                ref={domRef}
            >
                {props.children}
            </div>
        );
    }

    return (
        <div>
            <div className="column2">
                <div className="top">
                    <div className="row-md-8">
                        <div className='home-headers'>
                            <h1>GEOLEDGE</h1>
                            <h2>Prepared to test your<br></br> geographical knowledge?</h2>
                        </div>
                        <div className="btns">
                            <button className="homestyledbutton2" onClick={findOnlineGame}> Play Online</button>	
                        </div>
                        <div className='w-100'>
                            <div className='errormsgtxt'>{errorMsg.trim()}</div>
                        </div>
                        <div className='btns2'>
                            <button className="homestyledbutton" onClick={HostLobby}> Host Game</button>
                            <button className="homestyledbutton" onClick={Joinlobby}> Join Game</button>
                        </div>
                        <div className='earth'>
                            <div id="box"></div>
                                <div className="bottom">
                                    <div className="row-md-12">
                                        <h1>What Is Geoledge?</h1>
                                        <p>Geoledge is an online quiz-type game.</p>
                                        <p>Each round you will be given a list of facts describing a mystery country.</p>
                                        <p>Will you be able to pinpoint the coutnry based on these facts?</p>
                                    </div>
                                </div>   
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default About;