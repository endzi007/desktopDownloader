import { createStore, applyMiddleware} from 'redux';
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux';
import reducers from './reducers';
import allMiddlewares from './middlewares';

let initialState = {
    options: {
      downloadFormat: {
        type: "mp3",
        quality: "best",
        mp3:  ["low", "medium", "best"],
        mp4:  ["360", "720", "1080"]
      },
      downloadFolder: "",
      parallel: {
          limit: 5, 
          inProgress: "NO",
          index: 0
      },
      autoNumbering: {
        numbering: false,
        value: 0
      },
      customRange: false
    },
    videos: [],
    uiConfig: {
        showConfig: false, 
        showProFeatureDialog: {
          open: false,
          message: ""
        },
        showAbout: false,
        showPlaylistDialog: {show: false, videos: [], playlistUrl: ""}
    },
    appState: {
      connection: null,
      downloading: 0,
      updates: true,
      error: {
        status: false,
        message: ""
      },
      parsingData: {
        bool: null,
        count: 0
      },
      license: {
        status: false,
        failureCount: 0
      },
      proFeatures: {
          videosLength: 20, 
          quality: "1080"
      }
    }
};

const store = createStore(
  reducers,
  initialState, // optional
  applyMiddleware(
    triggerAlias, // optional, see below
    ...allMiddlewares,
    forwardToRenderer, // IMPORTANT! This goes last
  ),
);

 replayActionMain(store);

 export default store;