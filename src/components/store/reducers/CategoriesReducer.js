// Import necessary modules
import { createSelector, createSlice } from '@reduxjs/toolkit'
import { store } from '../store'

// Initial state with some default data
const initialState = {
    categories: [],
    limit: 15,
    offset: 0,
    totalCates: 0,
    loadMoreCates: false,
}
// Create a Redux slice
export const categoriesDataSlice = createSlice({
    name: 'categoriesData',
    initialState,
    reducers: {
        categoriesData: (state, action) => {
            const { data } = action.payload.data
            state.categories = data;
        },
        resetCategoriesData: (deafaultState) => {
            deafaultState = initialState;
            return deafaultState;
        },
        updateCategoryOffset: (state, action) => {
            state.offset = action.payload
        },
        loadMorecategories: (state, action) => {
            state.loadMoreCates = action.payload
        },
        updateTotalCates: (state, action) => {
            const { data } = action.payload.data
            state.totalCates = data;
        },

    }
})

export const { categoriesData, resetCategoriesData, updateCategoryOffset, loadMorecategories, updateTotalCates } = categoriesDataSlice.actions
export default categoriesDataSlice.reducer

export const setCategoriesData = data => {
    store.dispatch(categoriesData({ data }))
}
export const setTotalCates = data => {
    store.dispatch(updateTotalCates({ data }))
}

export const categoriesDataSelector = state => state.categoriesData

export const categoriesSelector = createSelector(categoriesDataSelector, categoriesData => categoriesData.categories)

export const totalCates = createSelector(categoriesDataSelector, categoriesData => categoriesData.totalCates)

export const categoryLimit = createSelector(categoriesDataSelector, categoriesData => categoriesData.limit)

export const categoryOffset = createSelector(categoriesDataSelector, categoriesData => categoriesData.offset)
export const IsLoadMoreCates = createSelector(categoriesDataSelector, categoriesData => categoriesData.loadMoreCates)



// clear state data 
export const resetCategories = () => {
    store.dispatch(resetCategoriesData())
}