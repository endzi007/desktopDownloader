import { combineReducers, createStore, applyMiddleware} from 'redux';
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux';
import React from 'react';
import { render } from 'react-dom';
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

const App = ()=>{
  return (<div>Enis</div>);
}

render(<App/>, document.querySelector("#app"));
console.log("store", store.getState());