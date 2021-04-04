import {configureStore} from '@reduxjs/toolkit';
import {AuctionDetailsSlice} from '../Reducers/AuctionDetailsReducer';
import {AuctionsQuerySlice} from '../Reducers/AuctionsQueryReducer';
import {LoginSlice} from '../Reducers/UserLoginReducer'

export const store = configureStore({
    reducer: {
        details: AuctionDetailsSlice.reducer,
        items: AuctionsQuerySlice.reducer,
        loginstate: LoginSlice.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch