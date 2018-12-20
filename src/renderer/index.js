import React from 'react';
import { render } from 'react-dom';
import App from './components/app';
import { Provider } from 'react-redux';
import store from './store/store';
import "./style.css";



render(
<Provider store={store}><App/></Provider>
, document.querySelector("#app"));