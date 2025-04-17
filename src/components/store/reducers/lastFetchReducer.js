// Import necessary modules
import { createSelector, createSlice } from '@reduxjs/toolkit'
import { store } from '../store'

// Initial state with some default data
const initialState = {
    settings: '',
    categories: '',
    languages: "",

}
// Create a Redux slice
export const lastFetchSlice = createSlice({
    name: 'lastFetch',
    initialState,
    reducers: {
        setSettingsLastFetch: (state, action) => {
            const { data } = action.payload.data
            state.settings = data
        },
        setCategoriesLastFetch: (state, action) => {
            const { data } = action.payload.data
            state.categories = data
        },
        setLanguageLastFetch: (state, action) => {
            const { data } = action.payload.data
            state.languages = data
        },
    }
})


export const { setSettingsLastFetch, setCategoriesLastFetch, setLanguageLastFetch } = lastFetchSlice.actions
export default lastFetchSlice.reducer

export const setSettingsLastFetchData = data => {
    store.dispatch(setSettingsLastFetch({ data }))
}
export const setCategoriesLastFetchData = data => {
    store.dispatch(setCategoriesLastFetch({ data }))
}
export const setLanguageLastFetchData = data => {
    store.dispatch(setLanguageLastFetch({ data }))
}

export const dataSelector = state => state.morePages

export const settingsFetchSelector = createSelector(dataSelector, state => state.settings)
export const categoriesFetchSelector = createSelector(dataSelector, state => state.categories)
export const languagesFetchSelector = createSelector(dataSelector, state => state.languages)
