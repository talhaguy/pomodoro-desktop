import { app, BrowserWindow } from "electron";
import path from "path";
import { Environment } from "../shared/environment";

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        // in dev env, make window bigger to fit dev tools
        height: process.env.ENV === Environment.Dev ? 1000 : 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    mainWindow.loadFile("index.html");

    if (process.env.ENV === Environment.Dev) {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", function () {
        // for mac, re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", function () {
    // don't quit application when all windows are closed on mac
    if (process.platform !== "darwin") {
        app.quit();
    }
});
