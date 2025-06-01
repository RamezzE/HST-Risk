import { ipcMain } from "electron";
import ElectronStore from "electron-store";

export const registerIpcHandlers = (
    store: ElectronStore,
): void => {
    ipcMain.on("store-get", (event, key) => {
        event.returnValue = store.get(key); // Return the value for the requested key
    });

    ipcMain.on("store-set", (event, key, value) => {
        store.set(key, value);

        event.returnValue = null;
    });

    ipcMain.on("store-delete", (event, key) => {
        store.delete(key);

        event.returnValue = null;
    });

    ipcMain.on("log", (event, message) => {
        console.log(message); // Log to the main process console

        event.returnValue = null; // Return null to the renderer process
    });
};
