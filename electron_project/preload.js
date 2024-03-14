const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('Capturer', {
  capture: () => {
    return ipcRenderer.invoke('capture')
  }
})
