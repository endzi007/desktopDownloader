import { createStore, applyMiddleware} from 'redux';
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux';
import reducers from '../../main/store/reducers';
import { createLogger } from 'redux-logger';
import { types as optionsTypes } from '../../main/options/optionsDuck';
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

store.subscribe(()=>{

});

let localStorageItems = JSON.parse(localStorage.getItem("options"));
if(localStorageItems !== null){
  store.dispatch({ type: optionsTypes.CHANGE_SAVE_FOLDER, payload:localStorageItems.downloadFolder});
  store.dispatch({ type: optionsTypes.CHANGE_DOWNLOAD_FORMAT, payload:localStorageItems.downloadFormat});
  store.dispatch({ type: optionsTypes.AUTO_NUMBERING, payload:localStorageItems.autoNumbering || {numbering: false, value: 0}});
} else {
  store.dispatch({ type: optionsTypes.GET_SAVE_FOLDER});
}




replayActionRenderer(store);

export default store;