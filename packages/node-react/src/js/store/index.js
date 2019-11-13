import { createStore } from 'redux';
import reducers from './reducer';

let store = createStore(reducers);

export default store;
