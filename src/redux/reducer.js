// import {Map, fromJS} from 'immutable';
// import {loop, combineReducers} from 'redux-loop-symbol-ponyfill';
import { combineReducers } from 'redux'

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import NavigatorStateReducer from '../modules/navigator/NavigatorState';
import CounterStateReducer from '../modules/counter/CounterState';
import SessionStateReducer, {RESET_STATE} from '../modules/session/SessionState';
import AuthStateReducer from './actions/AuthState';
import LocationStateReducer from './actions/LocationState';
import RequestStateReducer from '../modules/request/RequestState';


const persistConfig = {
  key: 'root',
  timeout: 0,
  storage,
  // whitelist: [
  //   'token','expires'
  // ]
}


const reducers = {
  counter: CounterStateReducer,
  navigatorState: NavigatorStateReducer,
  session: SessionStateReducer,
  auth: persistReducer(persistConfig, AuthStateReducer),
  request: persistReducer(persistConfig, RequestStateReducer),
  location: persistReducer(persistConfig, LocationStateReducer),
};

export default combineReducers(
  reducers
  // immutableStateContainer,
  // setImmutable
);
