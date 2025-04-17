// Import necessary modules
import { createSelector, createSlice } from '@reduxjs/toolkit'
import { store } from '../store'

// Initial state with some default data
const initialState = {
    data: [],
    lat: null,
    long: null,
    fcmtoken: "",
    systemTimezone: '',
    lastFetch: null
}
// Create a Redux slice
export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setSettings: (state, action) => {
            const { data } = action.payload.data
            state.data = data
        },
        latlong: (settings, action) => {
            let { lat, long } = action.payload;
            settings.lat = lat
            settings.long = long
        },
        fcmToken: (settings, action) => {
            settings.fcmtoken = action.payload.data
        },
        settingsLastFetch: (settings, action) => {
            const { data } = action.payload.data
            settings.lastFetch = data
        },

    }
})


export const { setSettings, settingsLastFetch,latlong,fcmToken } = settingsSlice.actions
export default settingsSlice.reducer

export const setSettingsData = data => {
    store.dispatch(setSettings({ data }))
}

export const setSettingsLastFetch = data => {
    store.dispatch(settingsLastFetch({ data }))
}

// load location
export const loadLocation = (lat, long) => {
    store.dispatch(latlong({ lat, long }))
}

// load fcmToken
export const loadFcmToken = (data) => {
    store.dispatch(fcmToken({ data }))
}

export const dataSelector = state => state.settings

export const settingsSelector = createSelector(dataSelector, state => state)
export const settingsLastFetchSelector = createSelector(dataSelector, state => state.lastFetch)
