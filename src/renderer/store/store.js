import { createStore, applyMiddleware} from 'redux';
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux';
import reducers from '../../main/store/reducers';
import { createLogger } from 'redux-logger';
import { types as optionsTypes } from '../../main/options/optionsDuck';
import { creators as appStateCreators } from '../../main/appState/appStateDuck';
import { ipcRenderer } from 'electron';
import persistStore from '../../main/helpers/persistStore';
const initialState = getInitialStateRenderer();

const logger = createLogger({
  collapsed: true
});

const store = createStore(
  reducers,
  initialState,
  applyMiddleware(
    forwardToMain, // IMPORTANT! This goes first,
    logger
    )
);

try {
  let localStorageItems = JSON.parse(persistStore.get("options"));
  if(localStorageItems !== null){
    store.dispatch({ type: optionsTypes.CHANGE_SAVE_FOLDER, payload:localStorageItems.downloadFolder});
    store.dispatch({ type: optionsTypes.CHANGE_DOWNLOAD_FORMAT, payload:localStorageItems.downloadFormat.type});
    store.dispatch({ type: optionsTypes.CHANGE_DOWNLOAD_QUALITY, payload:localStorageItems.downloadFormat.quality});
    store.dispatch({ type: optionsTypes.AUTO_NUMBERING, payload:localStorageItems.autoNumbering || {numbering: false, value: 0}});
  } else {
    store.dispatch({ type: optionsTypes.GET_SAVE_FOLDER});
  }
  let allowUpdatesKey = JSON.parse(persistStore.get("allowUpdates"));
  if(allowUpdatesKey !== null){
    store.dispatch(appStateCreators.allowUpdates(allowUpdatesKey));
  }

} catch (error) {
  console.log("error loading local storage", error);
}
ipcRenderer.on("FORWARD_TO_REDUX", (e, action)=>{
  store.dispatch({type: action.type, payload: action.payload})
});


replayActionRenderer(store);

export default store;