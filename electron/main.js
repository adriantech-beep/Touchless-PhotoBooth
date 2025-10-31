// electron/main.js
import { app, BrowserWindow, ipcMain } from "electron";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.on("closed", () => (mainWindow = null));
};

// ✅ Silent printing logic
ipcMain.on("print-final-image", async (event, dataUrl) => {
  console.log("🖨️ Received print-final-image event");
  try {
    const printWindow = new BrowserWindow({
      width: 600,
      height: 800,
      show: false, // don’t show at all
      focusable: false, // prevent stealing focus
      skipTaskbar: true, // don’t appear on taskbar
      transparent: true, // optional, reduces flicker
      webPreferences: {
        offscreen: true, // runs headless-like
        sandbox: false, // 👈 add this line
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

    // Once loaded, silently print and close
    printWindow.webContents.on("did-finish-load", () => {
      printWindow.webContents.print(
        {
          silent: true, // ✅ auto print to default printer
          printBackground: true,
          deviceName: "", // leave blank to use default printer
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
