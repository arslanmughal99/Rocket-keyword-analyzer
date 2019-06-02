"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var loaderWindow;
var senderID;
function createloaderWin(siteUrl) {
    loaderWindow = new electron_1.BrowserWindow({
        height: electron_1.screen.getPrimaryDisplay().size.height,
        width: electron_1.screen.getPrimaryDisplay().size.width,
        webPreferences: {
            nodeIntegration: true,
            offscreen: true
        },
        show: false
    });
    loaderWindow.webContents.loadURL(siteUrl, null).then(function () {
        loaderWindow.webContents.executeJavaScript('require("electron").ipcRenderer.send("html-ready", document.body.innerHTML);');
    }).catch(function (err) {
        senderID.send('yes-view-err', err);
    });
}
function getRawHtml(siteUrl, callback) {
    createloaderWin(siteUrl);
    loaderWindow.on('close', function () {
        loaderWindow = null;
    });
    electron_1.ipcMain.on('html-ready', function (e, raw) {
        try {
            loaderWindow.close();
        }
        catch (err) {
        }
        callback(raw);
    });
}
exports.default = getRawHtml;
(function () {
    electron_1.ipcMain.on('any-err-view', function (e) {
        senderID = e.sender;
    });
})();
//# sourceMappingURL=loader.js.map