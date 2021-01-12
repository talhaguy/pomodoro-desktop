import { app, BrowserWindow, Menu, MenuItemConstructorOptions } from "electron";
import path from "path";
import { Environment } from "../shared";

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

function createMenu() {
    const viewMenuTemplate: MenuItemConstructorOptions = {
        label: "View",
        submenu: [
            { role: "reload" },
            { role: "forceReload" },
            { type: "separator" },
            { role: "resetZoom" },
            { role: "zoomIn" },
            { role: "zoomOut" },
            { type: "separator" },
            { role: "togglefullscreen" },
        ],
    };

    if (process.env.ENV === Environment.Dev) {
        (viewMenuTemplate.submenu as MenuItemConstructorOptions[]).push({
            role: "toggleDevTools",
        });
    }

    const isMac = process.platform === "darwin";
    const menuTemplate = [].concat(
        // for mac, set up the app menu
        isMac
            ? [
                  {
                      label: app.name,
                      submenu: [
                          { role: "about" },
                          { type: "separator" },
                          { role: "hide" },
                          { role: "hideothers" },
                          { role: "unhide" },
                          { type: "separator" },
                          { role: "quit" },
                      ],
                  },
              ]
            : [],
        [
            {
                label: "File",
                submenu: [{ role: "quit" }],
            },
            viewMenuTemplate,
            {
                label: "Window",
                submenu: [
                    { role: "minimize" },
                    { role: "zoom" },
                    { role: "close" },
                ],
            },
        ],
        // for windows and linux, have an about item in the help menu
        !isMac
            ? [
                  {
                      label: "Help",
                      submenu: [{ role: "about" }],
                  },
              ]
            : []
    );

    const menu = Menu.buildFromTemplate(menuTemplate);

    Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
    createMenu();
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
