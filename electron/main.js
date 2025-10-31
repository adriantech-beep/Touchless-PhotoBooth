import { app, BrowserWindow, ipcMain } from "electron";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

const createWindow = () => {
  console.log(path.join(__dirname, "preload.js"));

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      // preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    // 🧩 Production (Electron build)
    // const indexPath = path.join(__dirname, "../dist/index.html");
    // const fullPath = `file://${indexPath}#/`;
    // console.log("🚀 Loading app from:", fullPath);
    mainWindow.loadURL("https://photobooth-kappa-coral.vercel.app/");
  }

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (url.startsWith("file://")) return;
    event.preventDefault();
  });

  mainWindow.on("closed", () => (mainWindow = null));
};

ipcMain.on("print-final-image", async (event, dataUrl) => {
  console.log("🖨️ Received print-final-image event");
  try {
    const printWindow = new BrowserWindow({
      width: 600,
      height: 800,
      show: false,
      focusable: false,
      skipTaskbar: true,
      transparent: true,
      webPreferences: {
        offscreen: true,
        sandbox: false,
        webSecurity: false,
      },
    });

    await printWindow.loadURL(
      `data:text/html;charset=utf-8,
      <html>
        <body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;height:100%;background:white;">
          <img src="${dataUrl}" style="width:100%;height:auto;" />
        </body>
      </html>`
    );

    printWindow.webContents.on("did-finish-load", () => {
      printWindow.webContents.print(
        {
          silent: true,
          printBackground: true,
          deviceName: "",
        },
        (success, errorType) => {
          if (!success) console.error("❌ Print failed:", errorType);
          printWindow.close();
        }
      );
    });
  } catch (err) {
    console.error("❌ Printing error:", err);
  }
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
