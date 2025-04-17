// Import necessary modules
import { createSelector, createSlice } from '@reduxjs/toolkit'
import { store } from '../store'

// Initial state with some default data
const initialState = {
    data: []
}
// Create a Redux slice
export const morePagesSlice = createSlice({
    name: 'morePages',
    initialState,
    reducers: {
        setMorePages: (state, action) => {
            const { data } = action.payload.data
            state.data = data
        },
    }
})


export const { setMorePages } = morePagesSlice.actions
export default morePagesSlice.reducer

export const setMorePagesData = data => {
    store.dispatch(setMorePages({ data }))
}

export const dataSelector = state => state.morePages

export const morePagesSelector = createSelector(dataSelector, state => state.data)
