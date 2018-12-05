import { app, BrowserWindow } from 'electron';
import store from './store/store';


let window;
app.on("ready", ()=>{
    window = new BrowserWindow({
        width: 500,
        height: 400
    });
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
});