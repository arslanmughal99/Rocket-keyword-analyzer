"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var url = require("url");
var loaderWindow;
var senderID;
function createloaderWin(siteUrl, isLocal) {
    loaderWindow = new electron_1.BrowserWindow({
        height: electron_1.screen.getPrimaryDisplay().size.height,
        width: electron_1.screen.getPrimaryDisplay().size.width,
        webPreferences: {
            nodeIntegration: true,
            offscreen: true
        },
        show: false
    });
    if (isLocal) {
        loaderWindow.webContents.loadURL(url.format({
            pathname: siteUrl,
            protocol: 'file:',
            slashes: true
        })).then(function () {
            loaderWindow.webContents.executeJavaScript('require("electron").ipcRenderer.send("html-ready", document.body.innerHTML);')
                .catch(function (err) {
                senderID.send('yes-view-err', err);
            });
        });
    }
    if (!isLocal) {
        loaderWindow.webContents.loadURL(siteUrl, null).then(function () {
            loaderWindow.webContents.executeJavaScript('require("electron").ipcRenderer.send("html-ready", document.body.innerHTML);');
        }).catch(function (err) {
            senderID.send('yes-view-err', err);
        });
    }
}
function getRawHtml(siteUrl, isLocal, callback) {
    createloaderWin(siteUrl, isLocal);
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
//  Register an IPC Event Emitter imidieatly
(function () {
    electron_1.ipcMain.on('any-err-view', function (e) {
        senderID = e.sender;
    });
})();
//# sourceMappingURL=loader.js.map