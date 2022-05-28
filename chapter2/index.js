var electron = require('electron')
var app = electron.app
var BrowserWindow = electron.BrowserWindow
var win = null

app.on('ready', function() {
  win = new BrowserWindow({
    webPreferences: { nodeIntegration: true },
  })
  
  win.loadFile('index.html')
  win.on('closed', function() {
    win = null
  })
  win.openDevTools()
})

app.on('window-all-closed', function() {
  app.quit()
})

electron.ipcMain.on('msg_render2main', (e, param1, param2) => {
  console.log(e.sender);
  console.log(param1)
  console.log(param2)
})


electron.ipcMain.on('msg_render2main', (e, param1, param2) => {
  win.webContents.send('msg_main2render',  param1, param2)
  e.sender.send('msg_main2render', param1, param2)
  e.reply('msg_main2render', param1, param2)
  win.webContents.openDevTools()
})

electron.ipcMain.on('msg_render2main_sync', (e) => {
  e.returnValue = 'ok'
})