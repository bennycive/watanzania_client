// Import necessary modules
import { createSelector, createSlice } from '@reduxjs/toolkit'
import { store } from '../store'

// Initial state with some default data
const initialState = {
  list: [],
  default: null,
  currentLanguage: {
    id: null,
    code: null,
    name: null,
    displayName: null
  },
  currentLanguageLabels: {
    data: {},
    lastFetch: null
  }
}
// Create a Redux slice
export const languagesSlice = createSlice({
  name: 'languages',
  initialState,
  reducers: {
    setLanguagesList: (state, action) => {
      const { data } = action.payload.data
      state.list = data
    },
    setDefaultLanguage: (state, action) => {
      const { data } = action.payload.data
      state.default = data
    },
    languageChange: (state, action) => {
      state.currentLanguage.code = action.payload.code
      state.currentLanguage.name = action.payload.name
      state.currentLanguage.id = action.payload.id
      state.currentLanguage.displayName = action.payload.display_name
    },
    setCurrentLanguageLabel: (state, action) => {
      state.currentLanguageLabels.data = action.payload.data
      state.currentLanguageLabels.lastFetch = action.payload.lastFetch
    },

  }
})


export const { setLanguagesList, setDefaultLanguage, languageChange, setCurrentLanguageLabel } = languagesSlice.actions
export default languagesSlice.reducer

export const setLanguagesListData = data => {
  store.dispatch(setLanguagesList({ data }))
}

export const setDefaultLanguageData = data => {
  store.dispatch(setDefaultLanguage({ data }))
}

export const setLanguageChangeData = (name, code, id, display_name) => {
  store.dispatch(languageChange({ name, code, id, display_name }))
}

export const setCurrentLanguageLabelData = (data, lastFetch) => {
  store.dispatch(setCurrentLanguageLabel({ data, lastFetch }))
}


export const dataSelector = state => state.languages

export const languagesListSelector = createSelector(dataSelector, state => state.list)

export const currentLanguageSelector = createSelector(dataSelector, state => state.currentLanguage)

export const currentLanguageLabelSelector = createSelector(dataSelector, state => state.currentLanguageLabels)
