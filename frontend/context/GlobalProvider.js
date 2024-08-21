// GlobalContext.js
import React, { createContext, useState } from 'react';
import { logout } from '../api/user_functions';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [name, setName] = useState('');
  const [teamNo, setTeamNo] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [subteam, setSubteam] = useState('');
  const [userMode, setUserMode] = useState('');
  const [expoPushToken, setExpoPushToken] = useState('');
  const [currentAttack, setCurrentAttack] = useState(null); // Track the current attack
  const [currentDefence, setCurrentDefence] = useState([]); // Track current defenses

  const Logout = async () => {
    try {
      setName('');
      setSubteam('');
      setTeamNo('');
      setIsLoggedIn(false);
      setUserMode('');
      setCurrentAttack(null);
      setCurrentDefence([]); // Clear current defense on logout
      await logout();
    } catch (error) {
      console.log("Error logging out\n", error);
    }
  };

  return (
    <GlobalContext.Provider value={{ 
      name, 
      teamNo, 
      isLoggedIn, 
      userMode, 
      subteam, 
      expoPushToken, 
      currentAttack, 
      currentDefence, // Provide currentDefence
      setExpoPushToken, 
      setName, 
      setTeamNo, 
      setIsLoggedIn, 
      setUserMode, 
      setSubteam, 
      setCurrentAttack, // Provide setCurrentAttack
      setCurrentDefence, // Provide setCurrentDefence
      Logout 
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
