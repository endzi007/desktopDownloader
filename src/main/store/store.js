import { createStore, applyMiddleware} from 'redux';
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux';
import reducers from '../reducers';
import videoMiddlewares from '../middlewares';

let initialState = {
    options: {
      downloadFormat: "mp4",
      downloadFolder: ""
    },
    videos: [],
    test: "off"
};

const store = createStore(
  reducers,
  initialState, // optional
  applyMiddleware(
    triggerAlias, // optional, see below
    videoMiddlewares,
    forwardToRenderer, // IMPORTANT! This goes last
  ),
);

 replayActionMain(store);

 export default store;