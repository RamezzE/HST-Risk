import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { logout } from '../api/user_functions';
import config from '../api/config';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [name, setName] = useState('');
  const [teamNo, setTeamNo] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [subteam, setSubteam] = useState('');
  const [userMode, setUserMode] = useState('');
  const [adminType, setAdminType] = useState('');
  const [expoPushToken, setExpoPushToken] = useState('');
  const [currentAttack, setCurrentAttack] = useState(null); // Track the current attack
  const [currentDefence, setCurrentDefence] = useState([]); // Track current defenses
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize the socket connection
    const newSocket = io(config.serverIP);
    setSocket(newSocket);

    // Clean up the socket connection on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const Logout = async () => {
    try {
      setName('');
      setSubteam('');
      setTeamNo('');
      setIsLoggedIn(false);
      setUserMode('');
      setAdminType('');
      setCurrentAttack(null);
      setCurrentDefence([]); // Clear current defense on logout
      await logout();

      // if (socket) {
        // socket.disconnect(); // Optionally disconnect the socket on logout
      // }
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
      adminType,
      subteam, 
      expoPushToken, 
      currentAttack, 
      currentDefence, // Provide currentDefence
      socket, // Provide the socket instance
      setExpoPushToken, 
      setName, 
      setTeamNo, 
      setIsLoggedIn, 
      setUserMode, 
      setSubteam, 
      setCurrentAttack, // Provide setCurrentAttack
      setCurrentDefence, // Provide setCurrentDefence
      setAdminType,
      Logout 
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
