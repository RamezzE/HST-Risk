// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

declare global {
    interface Window {
        electron: {
            on(channel: string, callback: (data: any) => void): void,
            store: {
                get(key: string): any,
                set(key: string, value: any): void,
                delete(key: string): void,
            },
            debug: {
                log(message: string): void,
            }
        };
    }
}

contextBridge.exposeInMainWorld('electron', {
    on: (channel: string, callback: (data: any) => void) => {
        ipcRenderer.on(channel, (_, data) => callback(data));
    },
    store: {
        get(key: string) {
            return ipcRenderer.sendSync('store-get', key);
        },
        set(key: string, value: any) {
            ipcRenderer.send('store-set', key, value);
        },
        delete(key: string) {
            ipcRenderer.send('store-delete', key);
        }
    },
    debug: {
        log(message: string) {
            ipcRenderer.send('log', message);
        }
    }

});