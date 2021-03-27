import {configureStore} from '@reduxjs/toolkit';
import {AuctionDetailsSlice} from '../Reducers/AuctionDetailsReducer';
import {AuctionsQuerySlice} from '../Reducers/AuctionsQueryReducer';

export const store = configureStore({
    reducer: {
        details: AuctionDetailsSlice.reducer,
        items: AuctionsQuerySlice.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch