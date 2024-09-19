const { ipcRenderer } = require('electron');

const openFileButton = document.getElementById('openFileButton')
const clearFiles = document.getElementById('clearFiles')
const pre = document.getElementById('data')

let fileCounter = 0

openFileButton.addEventListener('click', () => {
    ipcRenderer.send('open-file-dialog') // Ask main process to open the file dialog
})

ipcRenderer.on('metadata', (event, fileData) => {

    fileData.forEach((file) => {
        fileCounter++

        const filePath = file.filePath
        const name = file.filePath.split('\\').pop()
        const birthtime = file.stats.birthtime

        const fileMetadata = `
        File ${fileCounter}:
        {
            Name: ${name}
            Path: ${filePath}
            Birthtime: ${birthtime}
        }`

        pre.innerText += fileMetadata
    })
})

ipcRenderer.on('metadata:error', (event, error) => {
    console.error(error)
})

clearFiles.addEventListener('click', () => {
    pre.innerText = '' // Clear the pre element
    fileCounter = 0 // Reset the file counter
    console.log('Cleared')
})
