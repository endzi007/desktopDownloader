import { combineReducers, createStore, applyMiddleware} from 'redux';
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux';
import React from 'react';
import { render } from 'react-dom';
import reducers from './reducers';
import App from './components/app';
import { Provider } from 'react-redux';

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


render(
<Provider store={store}><App/></Provider>
, document.querySelector("#app"));
console.log("store", store.getState());