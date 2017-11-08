const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', function () {
    //create new window;
    mainWindow = new BrowserWindow(
        {
            show: false,
            backgroundColor: '#2e2c29'
        }
    );

    //Load html into the window;
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    //open when ready;
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    })
    //Quit app when closed;
    mainWindow.on('closed', () => {
        app.quit();
    })
    //build menu from template;
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert the menu;
    Menu.setApplicationMenu(mainMenu);
});

//create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click() {
                    if (addWindow) {
                        addWindow.focus();
                    } else {
                        createAddWindow();
                    }
                }
            },
            {
                label: 'Clear Items',
                click() {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

//Handle add Window
function createAddWindow() {
    //create new window;
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Shopping List Item',
        transparent: true
    });

    //Load html into the window;

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    addWindow.setMenu(null);

    addWindow.once('ready-to-show', () => {
        addWindow.show();
    })
    //remove reference to addWindow;
    addWindow.on('closed', () => {
        addWindow = null;
    })

}

//catch item:add
ipcMain.on('item:add', (e, item) => {
    mainWindow.webContents.send('item:add', item);
    //addWindow.close();
});

//Add developer tools item if not in pord;
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DeveTools',
                accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}