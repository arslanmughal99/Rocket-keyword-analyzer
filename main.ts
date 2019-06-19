import { app, BrowserWindow, screen, ipcMain, webContents, IpcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import getKeyDetail from './processing/process';

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {

  // const electronScreen = screen;
  // const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    width: 345,
    height: 550,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false,
    frame: false,
    resizable: false
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // if (serve) {
  //   win.webContents.openDevTools();
  // }
  // win.webContents.openDevTools();


  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null;
  });

  win.webContents.on('did-finish-load', () => {
    win.show();
  });


}


try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}



ipcMain.on('siteUrl', (e, isLocal:boolean,  siteUrl:string) => {

  getKeyDetail(siteUrl, isLocal, (err, data, totalKeyWords) => {
    if (err) {
      e.sender.send('error-occure', err);
      return;
    }
    e.sender.send('keyword-details', { data: data, total: totalKeyWords });
  });

  // ipcMain.on('error-occure', (e, errCode, errDes) => {
  //   win.webContents.send('error-occure', errCode, errDes);
  // });

 });
