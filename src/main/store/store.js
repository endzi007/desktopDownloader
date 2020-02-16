import { createStore, applyMiddleware} from 'redux';
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux';
import reducers from './reducers';
import allMiddlewares from './middlewares';
import {defaultState as defaultAppState} from '../appState/appStateDuck';
import { defaultState as defaultUiState } from '../ui/uiDuck';
import { defaultState as defaultOptionsState } from '../options/optionsDuck';

let initialState = {
    ...defaultOptionsState,
    videos: [],
    ...defaultUiState,
    ...defaultAppState
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