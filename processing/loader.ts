import { BrowserWindow, ipcMain, screen } from 'electron';


let loaderWindow;
let senderID;



function createloaderWin(siteUrl: string) {
  loaderWindow = new BrowserWindow({
    height : screen.getPrimaryDisplay().size.height,
    width: screen.getPrimaryDisplay().size.width,
    webPreferences: {
      nodeIntegration: true,
      offscreen: true
    },
    show: false
  });

  loaderWindow.webContents.loadURL(siteUrl, null).then(() => {
    loaderWindow.webContents.executeJavaScript('require("electron").ipcRenderer.send("html-ready", document.body.innerHTML);');
  }).catch((err) => {
    senderID.send('yes-view-err', err);
  });
}


export default function getRawHtml(siteUrl, callback) {
  createloaderWin(siteUrl);
  loaderWindow.on('close', () => {
    loaderWindow = null;
  });
  ipcMain.on('html-ready', (e, raw) => {
    try {
      loaderWindow.close();
    } catch (err) {

    }
    callback(raw);
  });
}


(function () {
  ipcMain.on('any-err-view', (e) => {
    senderID = e.sender;
  });
})();
