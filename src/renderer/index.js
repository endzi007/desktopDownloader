import { combineReducers, createStore, applyMiddleware} from 'redux';
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux';
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux';
import reducers from './reducers';

const todoApp = combineReducers(reducers);
const initialState = getInitialStateRenderer();

const store = createStore(
  todoApp,
  initialState,
  applyMiddleware(
    forwardToMain, // IMPORTANT! This goes first
  ),
);

replayActionRenderer(store);

console.log("store", store.getState());