// import {
//   createReduxContainer,
//   createReactNavigationReduxMiddleware,
//   createNavigationReducer,
// } from 'react-navigation-redux-helpers';
// import { Provider, connect } from 'react-redux';

import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import AuthStateReducer from './reducers/AuthStateReducer';
import LocationStateReducer from './reducers/LocationStateReducer';
import RequestStateReducer from './reducers/RequestStateReducer';

// import {MainNavigation } from '../utils/MainReducer';

const persistConfig = {
  key: 'root',
  timeout: 0,
  storage,
  // whitelist: [
  //   'token','expires'
  // ]
}

// const navReducer = createNavigationReducer(MainNavigation);

const reducers = {
  // nav: navReducer,
  // session: SessionStateReducer,
  auth: persistReducer(persistConfig, AuthStateReducer),
  request: persistReducer(persistConfig, RequestStateReducer),
  location: persistReducer(persistConfig, LocationStateReducer),
};

export default combineReducers(
  reducers
  // immutableStateContainer,
  // setImmutable
);