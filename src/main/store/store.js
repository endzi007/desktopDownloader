import { createStore, applyMiddleware} from 'redux';
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux';
import reducers from '../reducers';

let initialState = {
    options: {
      downloadFormat: "mp4",
      downloadFolder: ""
    },
    videos: [{url: "1"}, {url: "2"}],
    test: "off"
};

const store = createStore(
  reducers,
  initialState, // optional
  applyMiddleware(
    triggerAlias, // optional, see below
    forwardToRenderer, // IMPORTANT! This goes last
  ),
);

 replayActionMain(store);
 console.log(store.getState());

 export default store;