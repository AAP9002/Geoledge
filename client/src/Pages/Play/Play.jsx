import React from 'react';
import "./Play.css";
import { Rounds } from "./rounds"
import { RoundLength } from "./roundtime"


const Play = () => {
  return (
    <>
    <div>
      <Rounds></Rounds>
    </div>
    <div>
      <RoundLength></RoundLength>
    </div>
    </>
  );
};

export default Play;