let path = require('path')
let URL = require('url')
var electron = require('electron')
var app = electron.app
var BrowserWindow = electron.BrowserWindow
var win = null
let url = ''

if (process.env.NODE_ENV !== 'production') {
  url = 'http://localhost:' + process.env.ELECTRON_WEBPACK_WDS_PORT
} else {
  url = URL.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file'
  })
}

app.on('ready', function() {
  win = new BrowserWindow({
    webPreferences: { nodeIntegration: true },
    frame: false
  })
  
  win.loadFile('index.html')
  win.on('closed', function() {
    win = null
  })
  win.loadURL(url)
  win.openDevTools()
})

app.on('window-all-closed', function() {
  app.quit()
})