const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // use preload bridge
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL); // dev server
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html")); // prod build
  }
});

ipcMain.on("print-image", (event, { dataUrl, options }) => {
  const printWindow = new BrowserWindow({ show: false });
  printWindow.loadURL(`data:text/html,
    <img src="${dataUrl}" style="width:${options.width}px;height:${options.height}px;object-fit:contain" />`);

  printWindow.webContents.on("did-finish-load", () => {
    printWindow.webContents.print({
      silent: true,
      deviceName: "HiTi P525L", // must match OS printer name
    });
  });
});
