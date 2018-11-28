import { app, BrowserWindow } from 'electron';
import { combineReducers, createStore, applyMiddleware} from 'redux';
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux';
import reducers from './reducers';

let initialState = {
    enis: "31"
};
const todoApp = combineReducers(reducers);

const store = createStore(
  todoApp,
  initialState, // optional
  applyMiddleware(
    triggerAlias, // optional, see below
    forwardToRenderer, // IMPORTANT! This goes last
  ),
);

 replayActionMain(store);

 


let window;
app.on("ready", ()=>{
    window = new BrowserWindow({
        width: 500,
        height: 400
    });
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
});