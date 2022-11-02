// Configure the store in redux/store.js:

import { createStore } from "redux";
import { combineReducers } from "redux";

import colorsReducer from "./redux";

const rootReducer = combineReducers({
    colors: colorsReducer,
});

const store = createStore(rootReducer);

export default store;
