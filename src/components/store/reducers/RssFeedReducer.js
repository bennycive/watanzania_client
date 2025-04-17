import { createSlice } from "@reduxjs/toolkit";
import { store } from "../store";

const initialState = {
    selectedFeed: []
}

export const selectedFeedSlice = createSlice({
    name: "rssfeed",
    initialState,
    reducers: {
        setSelectedFeed: (rssfeed, action) => {
            rssfeed.selectedFeed = action.payload.data;
        }
    }
})

export const { setSelectedFeed } = selectedFeedSlice.actions;
export default selectedFeedSlice.reducer;