// Import necessary modules
import { createSelector, createSlice } from '@reduxjs/toolkit'
import { store } from '../store'

// Initial state with some default data
const initialState = {
    data: null,
    isLogin: false,
    isMobileLogin: false,
    userManageData: null
}
// Create a Redux slice
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setData: (state, action) => {
            const { data, profileUpdate, profileImageUpdate } = action.payload.data
            if (profileImageUpdate) {
                state.data.profile = data.profile
            }
            else if (profileUpdate) {
                state.data.name = data.name;
                state.data.mobile = data.mobile
                state.data.email = data.email
                state.data.profile = data.profile
            }
            else {
                state.data = data
            }
        },
        logoutSuccess: (user) => {
            user = initialState;
            return user;
        },
        isMobileLogin: (state, action) => {
            const { data } = action.payload.data
            state.isMobileLogin = data
        },
        userManageDataSuccess: (user, action) => {
            let { data } = action.payload;
            user.userManageData = data
        },
        updateUserName: (state, action) => {
            const { data } = action.payload.data
            state.userName = data;
        },
    }
})


export const { setData, logoutSuccess, isMobileLogin, userManageDataSuccess, updateUserName } = userSlice.actions
export default userSlice.reducer

export const setUserData = data => {
    store.dispatch(setData({ data }))
}

export const updateUserNameData = (data) => {
    store.dispatch(updateUserName({ data }))
}

export const setIsMobileLogin = data => {
    store.dispatch(isMobileLogin({ data }))
}

// logout
export const logoutUser = () => {
    store.dispatch(logoutSuccess())
}

export const setUserManageData = (data) => {
    store.dispatch(userManageDataSuccess({ data }))
}

export const dataSelector = state => state?.user

export const userDataSelector = createSelector(dataSelector, state => state)

export const userNameSelector = (state) => dataSelector(state).userName;
