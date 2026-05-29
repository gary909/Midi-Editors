/* Set app size in this file */
const { app, BrowserWindow, session } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    show: false,              // hide until first paint to avoid white flash
    backgroundColor: '#f5f5f5', // match loader-modal background
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'MIDI Editors',
  });

  win.loadFile('index.html');

  // Show the window once the first frame has been painted —
  // the loader modal will already be visible at this point.
  win.once('ready-to-show', () => win.show());
}

app.whenReady().then(() => {
  // Automatically grant MIDI + SysEx permissions so the Web MIDI API works
  // without a browser permission prompt.
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    const allowed = ['midi', 'midiSysex'];
    callback(allowed.includes(permission));
  });

  createWindow();

  app.on('activate', () => {
    // macOS: re-create window when dock icon is clicked and no windows are open
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  // On macOS, apps stay open until the user quits explicitly with Cmd+Q
  if (process.platform !== 'darwin') app.quit();
});
