/* Set app size in this file */
const { app, BrowserWindow, session, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 910,
    show: false,              // hide until first paint to avoid white flash
    backgroundColor: '#f5f5f5', // match loader-modal background
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    title: 'MIDI Editors',
  });

  mainWindow.loadFile('index.html');

  // Show the window once the first frame has been painted —
  // the loader modal will already be visible at this point.
  mainWindow.once('ready-to-show', () => mainWindow.show());
}

function buildMenu() {
  const template = [
    {
      label: app.name,
      submenu: [
        {
          label: 'About MIDI Editors',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('show-about');
          },
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('show-about');
          },
        },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  // Automatically grant MIDI + SysEx permissions so the Web MIDI API works
  // without a browser permission prompt.
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    const allowed = ['midi', 'midiSysex'];
    callback(allowed.includes(permission));
  });

  buildMenu();
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
