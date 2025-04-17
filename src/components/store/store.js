"use client"
import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import clickActionReducer from "./stateSlice/clickActionSlice";
import morePagesReducer from './reducers/morePagesReducer';
import settingsReducer from './reducers/settingsReducer';
import languageReducer from './reducers/languageReducer';
import CheckPermissionsReducer from './reducers/CheckPermissionsReducer';
import CheckNewsDataReducer from './reducers/CheckNewsDataReducer';
import userReducer from './reducers/userReducer';
import createNewsReducer from './reducers/createNewsReducer';
import CheckThemeReducer from './reducers/CheckThemeReducer';
import CategoriesReducer from './reducers/CategoriesReducer';
import RssFeedReducer from "./reducers/RssFeedReducer"
import helperReducer from './reducers/helperReducer';

const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({
    clickAction: clickActionReducer,
    morePages: morePagesReducer,
    settings: settingsReducer,
    languages: languageReducer,
    checkPermission: CheckPermissionsReducer,
    checkNewsData: CheckNewsDataReducer,
    user: userReducer,
    createNews: createNewsReducer,
    checkTheme: CheckThemeReducer,
    categoriesData: CategoriesReducer,
    rssfeed: RssFeedReducer,
    helper: helperReducer,
});

export const store = configureStore({
    reducer: persistReducer(persistConfig, rootReducer),
});

const customizedMiddleware = getDefaultMiddleware({
    serializableCheck: false
  })

export const persistor = persistStore(store);