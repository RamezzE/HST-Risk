import Constants from 'expo-constants';
const SERVER_IP = Constants.expoConfig?.extra?.serverUrl || 'http://localhost:3000';
const config = {
  serverIP: SERVER_IP,
};

console.log('Config loaded:', config);

export default config;
