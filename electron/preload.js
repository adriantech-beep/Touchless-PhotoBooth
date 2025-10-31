// electron/preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  printFinalImage: (dataUrl) => ipcRenderer.send("print-final-image", dataUrl),
});
