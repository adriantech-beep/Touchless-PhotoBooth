const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  printImage: (dataUrl, options) =>
    ipcRenderer.send("print-image", { dataUrl, options }),
});
