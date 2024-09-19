const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const util = require('util')
const fs = require('fs')
const stat = util.promisify(fs.stat)

let mainWindow

app.on('ready', () => {
    const htmlPath = path.join('src', 'index.html')

    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    mainWindow.loadFile(htmlPath)
})

ipcMain.on('open-file-dialog', async (event) => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile', 'multiSelections'] // Allow multi-file selection
    })

    if (result.canceled) {
        return
    }

    const files = result.filePaths // Get full file paths
    const fileData = await Promise.all(files.map(async (filePath) => {
        const stats = await stat(filePath)
        return {
            filePath,
            stats
        }
    }))

    // Send the metadata back to the renderer
    mainWindow.webContents.send('metadata', fileData)
})
