import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../App/store';
import * as signalR from "@microsoft/signalr";

interface ConnectionState {
    connection: signalR.HubConnection
}

const initialState = {
    connection: new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5000/auctionshub")
    .withAutomaticReconnect()
    .build()
}

export const ConnectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {
        start: (state) => {
            state.connection.start();
        }
    }
})

export const selectConnection = (state: RootState) => state.connection.connection

export default ConnectionSlice.reducer