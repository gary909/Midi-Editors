const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Wrap the callback so the raw IPC event object is never exposed to the renderer
  onShowAbout: (callback) => ipcRenderer.on('show-about', (_event) => callback()),
});
