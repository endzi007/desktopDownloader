'use strict'
import { app, BrowserWindow, Menu, ipcMain, shell } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import { autoUpdater } from 'electron-updater';

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
  console.log("error");
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  window = new BrowserWindow({show: false, icon: path.resolve(__static, "assets/logo.ico"), title: "DeDex Video Downloader"});
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


  let loading = new BrowserWindow({show: false, frame: false, transparent: true, icon: path.resolve(__static, "assets/logo.ico")})

  loading.once('show', () => {
    window.webContents.once('dom-ready', () => {
      console.log('window loaded')
      window.show()
      loading.hide()
      loading.close()
      autoUpdater.checkForUpdatesAndNotify()
    })
  })
  loading.loadURL(path.resolve(__static, 'assets/loading.html'));
  loading.show()

  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Save project",
          click() {
            window.webContents.send('videos/SAVE_PLAYLIST');
          },
          accelerator: 'Ctrl+S'
        },
        {
          label: "Load project",
          click() {
            window.webContents.send('videos/LOAD_PLAYLIST');
          },
          accelerator: 'Ctrl+O'
        },
        {type: 'separator'},
        {
          label: "Preferences",
          click() {
            window.webContents.send('ui/SHOW_CONFIG_PANEL');
          },
          accelerator: 'Ctrl+M'
        },
        {
          label: "Exit",
          click(){ app.quit() }  
        }
      ]
    },
    {
      label: "Downloads",
      submenu: [
        {
          label: "Paste", accelerator: "CmdOrCtrl+P", selector: "paste:",
          click(){
            window.webContents.send("videos/ADD_VIDEO_TO_PLAYLIST")
          }
        },
        {
          label: "Stop",
          click(){
            console.log("Stop download")
          }
        },
        {
          label: "Clear all",
          click(){
            window.webContents.send("videos/CLEAR_ALL")
          }
        }
      ]
    },
    {
      label: "Help",
      submenu:[
        {label: "Activate"},
        {label: "About"}
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

autoUpdater.on("checking-for-updates", ()=>{
    console.log("checking for updates...");
});

autoUpdater.on("update-available", (info)=>{
    console.log("update available")
})

autoUpdater.on("update-not-available", (info)=>{
  console.log("update not available")
})

ipcMain.on("GO_TO_WEBSITE", (e, url)=>{
    shell.openExternal(url, {activate: true});
});