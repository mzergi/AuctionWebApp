import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AuctionItem} from "../Model/auction_types";
import {RootState} from '../App/store';

interface AuctionsQueryState
{
    items: AuctionItem[],
    categoryID: number
}

const initialState : AuctionsQueryState = {
    items: [],
    categoryID: 0
}

export const AuctionsQuerySlice = createSlice({
    name: 'queriedauctions',
    initialState,
    reducers: {
        setQueriedItems: (state, action: PayloadAction<AuctionItem[]>) => {
            state.items = action.payload;
        },
        setCategoryID: (state, action: PayloadAction<number>) => {
            state.categoryID = action.payload;
        }
    }
})

export const {setQueriedItems, setCategoryID} = AuctionsQuerySlice.actions;

export const selectAuctionItems = (state: RootState) => state.items.items;

export const selectCategoryID = (state: RootState) => state.items.categoryID;

export default AuctionsQuerySlice.reducer;