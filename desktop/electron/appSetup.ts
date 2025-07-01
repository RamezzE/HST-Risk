// import { BrowserWindow } from "electron";
import ElectronStore from "electron-store";
import { WindowManager } from "./window";
import 'dotenv/config'
import isDev from 'electron-is-dev';
import io from 'socket.io-client';

import { registerIpcHandlers } from "./ipc/registerIpcHandlers";

const store = new ElectronStore();

const socket = isDev ? io(process.env.VITE_SERVER_IP) : io(process.env.VITE_SERVER_IP); // Replace with your actual API URL

socket.on('connect', () => {
    console.log('Connected to server:', socket.id); // Log the socket ID on connection
});

socket.on("update_country", (updatedCountry) => {
    WindowManager.broadcastToAllWindows("updateCountry", updatedCountry);
    console.log("Country updated:", updatedCountry);
});

socket.on("new_attack", (newAttack) => {
    WindowManager.broadcastToAllWindows("newAttack", newAttack);
    console.log("New attack received:", newAttack);
});

socket.on("remove_attack", (attackId) => {
    WindowManager.broadcastToAllWindows("removeAttack", attackId);  
    console.log("Attack removed:", attackId);
});


// --- Main Window & Services Initialization ---
const createMainWindowAndServices = async (): Promise<void> => {

    const windowManager = new WindowManager();
    windowManager.createMainWindow();
    registerIpcHandlers(store);
}

// --- Main Initialization Function ---
export const initializeApp = async (): Promise<void> => {

    await createMainWindowAndServices();
}
