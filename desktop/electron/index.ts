import { app, BrowserWindow } from "electron";
import { initializeApp } from "./appSetup";

app.whenReady()
  .then(initializeApp)
  .catch(err => console.error("Failed to initialize app:", err));

app.on("window-all-closed", () => {
  // if (process.platform !== "darwin")
    app.quit();
});

app.on("activate", () => {
  app.dock.hide();
  // On macOS it's common to re-create a window in the app when the dock icon is clicked
  // and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    initializeApp();
  }
});
