// GlobalContext.js
import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [name, setName] = useState('');
  const [teamNo, setTeamNo] = useState('');
  const [attackData, setAttackData] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMode, setUserMode] = useState('');

  return (
    <GlobalContext.Provider value={{ name, teamNo, attackData, isLoggedIn, userMode, setName, setTeamNo, setAttackData, setIsLoggedIn, setUserMode }}>
      {children}
    </GlobalContext.Provider>
  );
};
