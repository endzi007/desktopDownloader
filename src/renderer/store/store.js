import { createStore, applyMiddleware} from 'redux';
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux';
import reducers from '../../main/reducers';
//import middlewares from '../../main/middlewares';
const initialState = getInitialStateRenderer();

const store = createStore(
  reducers,
  initialState,
  applyMiddleware(
    forwardToMain // IMPORTANT! This goes first
    ),
);

store.subscribe(()=>{
    console.log("store updated", store.getState());
});

console.log(store.getState(), "initial state");

replayActionRenderer(store);

export default store;