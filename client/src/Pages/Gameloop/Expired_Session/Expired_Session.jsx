import React from 'react';
import "./Expired_Session.css";

import { useState, useEffect } from 'react';


const Session_Expired = () => {
    return(<div>
    <p className="waiting">Uh oh! This session has expired!</p>
    <p className="waiting">You may have hosted a new game on this account on a seprate device.</p>
    </div>);}

export default Session_Expired;