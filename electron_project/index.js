const { app, desktopCapturer, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, 'images')

// 主进程
ipcMain.handle('capture', async event => {
  fs.rmSync(dir, {
    recursive: true,
    force: true
  })

  fs.mkdirSync(dir, {
    recursive: true
  })

  return desktopCapturer
    .getSources({
      types: ['window'],
      thumbnailSize: {
        width: 1024,
        height: 1024 + Math.round(Math.random() * 20)
      }
    })
    .then(sources => {
      console.log(
        sources.map(item => ({
          id: item.id,
          name: item.name
        }))
      )

      sources.forEach((item, index) => {
        fs.writeFileSync(path.join(dir, `./${index}.png`), item.thumbnail.toPNG())
      })

      return sources
    })
})

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // Or load a local HTML file
  win.loadFile(path.join(__dirname, 'index.html'))
  win.webContents.openDevTools()
})
