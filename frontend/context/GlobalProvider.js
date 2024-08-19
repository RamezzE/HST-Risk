// GlobalContext.js
import React, { createContext, useState } from 'react';

import { logout } from '../api/user_functions';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [name, setName] = useState('');
  const [teamNo, setTeamNo] = useState('');
  const [attackData, setAttackData] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [subteam, setSubteam] = useState('')
  const [userMode, setUserMode] = useState('');
  const [expoPushToken, setExpoPushToken] = useState('');

  const Logout = async () => {
    try {
      setName('');
      setSubteam('');
      setTeamNo('');
      setAttackData({});
      setIsLoggedIn(false);
      setUserMode('');
      await logout();
    } catch (error) {console.log("Error logging out\n", error)}
  };

  return (
    <GlobalContext.Provider value={{ name, teamNo, attackData, isLoggedIn, userMode, subteam, expoPushToken, setExpoPushToken, setName, setTeamNo, setAttackData, setIsLoggedIn, setUserMode, setSubteam, Logout }}>
      {children}
    </GlobalContext.Provider>
  );
};
