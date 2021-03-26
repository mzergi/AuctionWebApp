import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AuctionItem} from "../Model/auction_types";
import {RootState} from '../App/store';

interface AuctionState {
    id: number
    auctionitem: AuctionItem
}

const initialState: AuctionState = {
    id: 0,
    auctionitem: <AuctionItem>{id: 0}
}

export const AuctionDetailsSlice = createSlice({
    name: 'details',
    initialState,
    reducers: {
        setDisplayed: (state, action: PayloadAction<AuctionItem>) => {
            state.id = action.payload.id;
            state.auctionitem = action.payload;
        }
    }
})

export const {setDisplayed} = AuctionDetailsSlice.actions

export const selectAuctionID = (state: RootState) => state.details.id

export const selectAuctionItem = (state: RootState) => state.details.auctionitem

export default AuctionDetailsSlice.reducer