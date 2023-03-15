import React, { useEffect } from 'react';

import { useState } from 'react';
 


function ScoreBoard(){
  const [Points, SetPoints] = useState(0)
  const [Place, SetPlace] = useState(0)
  const[Username, SetUsername] = useState("Username")



const End_game = () => {
    return(<><p>End game</p></>);

};
