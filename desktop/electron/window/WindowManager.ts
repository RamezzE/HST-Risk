import { BrowserWindow } from "electron";
import { preloadPath, url } from "../paths";
import isDev from "electron-is-dev";

export class WindowManager {
    private mainWindow: BrowserWindow | null = null;
    private preloadPath = preloadPath;
    private url = url;

    constructor(
    ) { }

    /**
     * 
     * If the window does not exist, it creates a new one.
     * If the window exists, it returns the existing window.
     * @returns The main window object.
     */
    public createMainWindow(): BrowserWindow {
        if (this.mainWindow) {
            return this.mainWindow;
        }

        this.mainWindow = new BrowserWindow({
            webPreferences: {
                preload: this.preloadPath,
                devTools: true,
            },
        });

        // this.mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
       
        if (isDev) {
            this.mainWindow.loadURL(this.url);
        } else {
            this.mainWindow.loadFile(this.url);
        }

        return this.mainWindow;
    }

    /**
     * @returns The main window object.
     */
    public getMainWindow(): BrowserWindow | null {
        return this.mainWindow;
    }

    /**
     * Broadcasts a message to all windows.
     * 
     * @param channel The channel to send the message to.
     * @param args  The arguments to send.
     */
    public static broadcastToAllWindows = (channel: string, ...args: any[]): void => {
        BrowserWindow.getAllWindows().forEach((win) => {
            win.webContents.send(channel, ...args);
        });
    };

}