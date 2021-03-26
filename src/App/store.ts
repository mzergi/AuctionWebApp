import {configureStore} from '@reduxjs/toolkit';
import {AuctionDetailsSlice} from '../Reducers/AuctionDetailsReducer';

export const store = configureStore({
    reducer: {
        details: AuctionDetailsSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch