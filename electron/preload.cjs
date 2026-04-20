const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('desktopAPI', {
  getPaths: () => ipcRenderer.invoke('app:get-paths'),
  chooseAlertAudio: () => ipcRenderer.invoke('app:choose-alert-audio'),
  writeSnapshot: (snapshot) => ipcRenderer.invoke('app:write-snapshot', snapshot),
  exportCsv: (snapshot) => ipcRenderer.invoke('app:export-csv', snapshot),
  chooseRecordingDirectory: () => ipcRenderer.invoke('app:choose-recording-directory'),
  saveRecordingFile: (params) => ipcRenderer.invoke('app:save-recording-file', params),
})
