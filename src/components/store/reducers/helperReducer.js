import { createSelector,createSlice } from "@reduxjs/toolkit";
import { store } from "../store";

const initialState = {
    isLoginModalOpen: false
}

export const helperSlice = createSlice({
    name: "helper",
    initialState,
    reducers: {
        setLoginModal: (state, action) => {
            const { openModal } = action.payload.data
            console.log(openModal)
            state.isLoginModalOpen = openModal;
        }
    }
});

export const { setLoginModal } = helperSlice.actions;
export default helperSlice.reducer;

export const setLoginModalState = data => {
    store.dispatch(setLoginModal({ data }))
}

export const selectHelperState = (state) => state.helper;

export const checkIsLoginModalOpen = createSelector(
    [selectHelperState],
    (helper) => helper.isLoginModalOpen
);