'use strict'
import { app, BrowserWindow, Menu } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import { creators as uiActions } from './ui/uiDuck';
import store from './store/store';

const isDevelopment = process.env.NODE_ENV !== 'production';

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let window;

  
// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
})

process.on('uncaughtException', function (err) {
  console.log(err);
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  window = new BrowserWindow({show: false});
  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  }
  else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  let loading = new BrowserWindow({show: false, frame: false, transparent: true})

  loading.once('show', () => {
    window.webContents.once('dom-ready', () => {
      console.log('window loaded')
      window.show()
      loading.hide()
      loading.close()
    })
  })
  loading.loadURL(path.resolve(__static, 'loading.html'));
  loading.show()

  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Save current project",
          click() {
            uiActions.showOpenDialog(true)
          }
        },
        {label: "Load saved project"},
        {label: "exit"}
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  window.on('closed', () => {
    window = null;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    })
  });
  
});