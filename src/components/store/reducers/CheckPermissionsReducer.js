// Import necessary modules
import { createSelector, createSlice } from '@reduxjs/toolkit'
import { store } from '../store'

// Initial state with some default data
const initialState = {
  data: {
    isNotificaitonPermission: '',
    isLocationPermission: '',
    isNotificaitonPermissionCheck: false,
    isLocaitonPermissionCheck: false,
  }
}
// Create a Redux slice
export const checkPermissionSlice = createSlice({
  name: 'checkPermission',
  initialState,
  reducers: {
    checkNotificationPermission: (state, action) => {
      const { isNotificationPermission } = action.payload.data
      state.data.isNotificaitonPermission = isNotificationPermission
    },
    checkLocationPermission: (state, action) => {
      const { data } = action.payload.data
      state.data.isLocationPermission = data
    },
    isNotificationPermissionCheck: (state, action) => {
      const { isNotificaitonPermissionChecked } = action.payload.data
      state.data.isNotificaitonPermissionCheck = isNotificaitonPermissionChecked
    },
    isLocationPermissionCheck: (state, action) => {
      const { isLocaitonPermissionChecked } = action.payload.data
      state.data.isLocaitonPermissionCheck = isLocaitonPermissionChecked
    },
    resetPermissionData: (deafaultState) => {
      deafaultState = initialState;
      return deafaultState;
    },
  }
})


export const { checkNotificationPermission, checkLocationPermission, isNotificationPermissionCheck, isLocationPermissionCheck, resetPermissionData } = checkPermissionSlice.actions
export default checkPermissionSlice.reducer

export const checkNotificationPermissionGranted = data => {
  store.dispatch(checkNotificationPermission({ data }))
}
export const checkLocationPermissionGranted = data => {
  store.dispatch(checkLocationPermission({ data }))
}

export const isLocationPermissionCheckOnce = data => {
  store.dispatch(checkNotificationPermission({ data }))
}
export const isNotificationPermissionCheckOnce = data => {
  store.dispatch(checkLocationPermission({ data }))
}

export const checkPermissionsSelector = state => state.checkPermission

export const notificationPermissionSelector = createSelector(checkPermissionsSelector, checkPermission => checkPermission.data.isNotificaitonPermission)
export const locationPermissionSelector = createSelector(checkPermissionsSelector, checkPermission => checkPermission.data.isLocationPermission)



// clear state data 
export const resetPermission = () => {
  store.dispatch(resetPermissionData())
}