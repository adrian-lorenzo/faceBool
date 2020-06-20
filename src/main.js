const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const isDev = require('electron-is-dev');
const screen = require('electron').screen


let mainWindow;

function createWindow() {

  let area = screen.getPrimaryDisplay().workArea;
  let size = Math.min(area.width, area.height) * 0.9;

  mainWindow = new BrowserWindow({
    width: size, height: size,
    contextIsolation: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false,
    frame: false,
    backgroundColor: "#3c51b9",
  });

  mainWindow.setResizable(false);
  mainWindow.setFullScreenable(false);
  mainWindow.removeMenu();
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});