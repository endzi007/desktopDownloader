import { createStore, applyMiddleware} from 'redux';
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux';
import reducers from '../reducers';
import videoMiddlewares from '../middlewares';
const initialState = getInitialStateRenderer();

const store = createStore(
  reducers,
  initialState,
  applyMiddleware(
    forwardToMain, // IMPORTANT! This goes first
    videoMiddlewares
  ),
);

store.subscribe(()=>{
    console.log("store updated", store.getState());
});

replayActionRenderer(store);

export default store;