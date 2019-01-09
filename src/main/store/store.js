import { createStore, applyMiddleware} from 'redux';
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux';
import reducers from '../reducers';
import videoMiddlewares from '../middlewares';
import uiMiddleware from '../middlewares/uiMiddleware';

let initialState = {
    options: {
      downloadFormat: "mp3",
      downloadFolder: "",
      parallel: {
          limit: 7, 
          inProgress: "NO",
          index: 0
      }
    },
    videos: [],
    test: "off",
    uiConfig: {
      showConfig: false
    },
    appState: {
      connection: null,
      downloading: null,
      error: null
    }
};

const store = createStore(
  reducers,
  initialState, // optional
  applyMiddleware(
    triggerAlias, // optional, see below
    videoMiddlewares,
    uiMiddleware,
    forwardToRenderer, // IMPORTANT! This goes last
  ),
);

 replayActionMain(store);

 export default store;