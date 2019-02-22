import { createStore, applyMiddleware} from 'redux';
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux';
import reducers from '../../main/reducers';
import { createLogger } from 'redux-logger';
import { CHANGE_DOWNLOAD_FORMAT, CHANGE_SAVE_FOLDER, GET_SAVE_FOLDER } from '../../main/actions/optionsActions';
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
  store.dispatch({ type: CHANGE_SAVE_FOLDER, payload:localStorageItems.downloadFolder || ""});
  store.dispatch({ type: CHANGE_DOWNLOAD_FORMAT, payload:localStorageItems.downloadFormat || "mp3"});
} else {
  store.dispatch({ type: GET_SAVE_FOLDER});
}




replayActionRenderer(store);

export default store;