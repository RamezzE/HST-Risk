// GlobalContext.js
import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [name, setName] = useState('');
  const [teamNo, setTeamNo] = useState('');
  const [attackData, setAttackData] = useState({});
//   const [globalVariable3, setGlobalVariable3] = useState('defaultValue3');

  return (
    <GlobalContext.Provider value={{ name, teamNo, attackData, setName, setTeamNo, setAttackData }}>
      {children}
    </GlobalContext.Provider>
  );
};
