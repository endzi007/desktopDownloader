import { createStore, applyMiddleware} from 'redux';
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux';
import reducers from '../reducers';
import videoMiddlewares from '../middlewares';
import uiMiddleware from '../middlewares/uiMiddleware';

let initialState = {
    options: {
      downloadFormat: "mp4",
      downloadFolder: ""
    },
    videos: [],
    test: "off",
    uiConfig: {
      showConfig: false
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