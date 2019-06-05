// import {Map, fromJS} from 'immutable';
// import {loop, combineReducers} from 'redux-loop-symbol-ponyfill';
import { combineReducers } from 'redux'

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import NavigatorStateReducer from '../modules/navigator/NavigatorState';
import CounterStateReducer from '../modules/counter/CounterState';
import SessionStateReducer, {RESET_STATE} from '../modules/session/SessionState';
import AuthStateReducer from '../modules/auth/AuthState';


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
  // auth: AuthStateReducer
  auth: persistReducer(persistConfig, AuthStateReducer)
};

export default combineReducers(
  reducers
  // immutableStateContainer,
  // setImmutable
);
