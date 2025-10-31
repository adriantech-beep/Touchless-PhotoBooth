// electron/preload.js
const { contextBridge, ipcRenderer } = require("electron");

console.log("Preload.js loaded");

contextBridge.exposeInMainWorld("electronAPI", {
  printFinalImage: (dataUrl) => ipcRenderer.send("print-final-image", dataUrl),
});
