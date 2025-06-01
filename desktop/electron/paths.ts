import isDev from "electron-is-dev";
import { join } from "path";

export const preloadPath = isDev ? join(__dirname, "preload.js") : join(__dirname, "preload.js");

export const url = isDev ? `http://localhost:3000` : join(__dirname, "..", "dist-vite", "index.html");
