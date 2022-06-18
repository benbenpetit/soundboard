import { combineReducers, configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import userLibraryReducer from 'reducers/userLibraryReducer';
import boardReducer from 'reducers/boardReducer';
import playbarReducer from 'reducers/playbarReducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['playbar']
};

const reducers = combineReducers({
  userLibrary: userLibraryReducer,
  board: boardReducer,
  playbar: playbarReducer
});

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
  reducer: persistedReducer,
  middleware: [thunk]
});
