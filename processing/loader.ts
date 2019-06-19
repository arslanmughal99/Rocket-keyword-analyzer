import { BrowserWindow, ipcMain, screen } from 'electron';
import * as url from 'url';


let loaderWindow;
let senderID;



function createloaderWin(siteUrl: string, isLocal: boolean) {
  loaderWindow = new BrowserWindow({
    height : screen.getPrimaryDisplay().size.height,
    width: screen.getPrimaryDisplay().size.width,
    webPreferences: {
      nodeIntegration: true,
      offscreen: true
    },
    show: false
  });

  if(isLocal){
    loaderWindow.webContents.loadURL(url.format({
      pathname: siteUrl,
      protocol: 'file:',
      slashes: true
    })).then(()=>{
      loaderWindow.webContents.executeJavaScript('require("electron").ipcRenderer.send("html-ready", document.body.innerHTML);')
      .catch((err) => {
        senderID.send('yes-view-err', err);
      });
    });
  }

  if(!isLocal){
    loaderWindow.webContents.loadURL(siteUrl, null).then(() => {
      loaderWindow.webContents.executeJavaScript('require("electron").ipcRenderer.send("html-ready", document.body.innerHTML);');
    }).catch((err) => {
      senderID.send('yes-view-err', err);
    });
  }

  


}


export default function getRawHtml(siteUrl: string, isLocal:boolean, callback) {
  createloaderWin(siteUrl, isLocal);
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


//  Register an IPC Event Emitter imidieatly
(function () {
  ipcMain.on('any-err-view', (e) => {
    senderID = e.sender;
  });
})();
