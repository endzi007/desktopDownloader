import { createStore, applyMiddleware} from 'redux';
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux';
import reducers from '../../main/reducers';
import { createLogger } from 'redux-logger';
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


replayActionRenderer(store);

export default store;