import { createStore, applyMiddleware} from 'redux';
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux';
import reducers from '../../main/store/reducers';
import { createLogger } from 'redux-logger';
import { types as optionsTypes } from '../../main/options/optionsDuck';
import { ipcRenderer } from 'electron';
const initialState = getInitialStateRenderer();

const store = createStore(
  reducers,
  initialState,
  applyMiddleware(
    forwardToMain, // IMPORTANT! This goes first,
    )
);

try {
  let localStorageItems = JSON.parse(localStorage.getItem("options"));
  if(localStorageItems !== null){
    store.dispatch({ type: optionsTypes.CHANGE_SAVE_FOLDER, payload:localStorageItems.downloadFolder});
    store.dispatch({ type: optionsTypes.CHANGE_DOWNLOAD_FORMAT, payload:localStorageItems.downloadFormat.type});
    store.dispatch({ type: optionsTypes.CHANGE_DOWNLOAD_QUALITY, payload:localStorageItems.downloadFormat.quality});
    store.dispatch({ type: optionsTypes.AUTO_NUMBERING, payload:localStorageItems.autoNumbering || {numbering: false, value: 0}});
  } else {
    store.dispatch({ type: optionsTypes.GET_SAVE_FOLDER});
  }
} catch (error) {
  console.log("error loading local storage", error);
}

ipcRenderer.on('videos/SAVE_PLAYLIST', (event)=>{
  store.dispatch({type: 'videos/SAVE_PLAYLIST'});
})
ipcRenderer.on('videos/LOAD_PLAYLIST', (event)=>{
  store.dispatch({type: 'videos/LOAD_PLAYLIST'});
})
ipcRenderer.on('ui/SHOW_CONFIG_PANEL', (event)=>{
  store.dispatch({type: 'ui/SHOW_CONFIG_PANEL', payload: true});
})
ipcRenderer.on('videos/CLEAR_ALL', (event)=>{
  store.dispatch({type: 'videos/CLEAR_ALL', payload: true});
})

ipcRenderer.on('videos/ADD_VIDEO_TO_PLAYLIST', (event)=>{
  store.dispatch({type: 'videos/ADD_VIDEO_TO_PLAYLIST', payload: ""});
})




replayActionRenderer(store);

export default store;