import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User} from "../Model/auction_types";
import {RootState, AppDispatch} from '../App/store';
import axios from 'axios';
import jwtDecode from "jwt-decode";

//Katona Tamás szakdolgozata alapján

interface LoginState {
    isAuthenticated: boolean,
    token: string,
    user: User
}

const initialState : LoginState = {
    token: "",
    isAuthenticated: false,
    user: {} as User
}

export const LoginSlice = createSlice({
    name: 'loginstate',
    initialState,
    reducers: {
            setToken: (state, action: PayloadAction<string>) => {
                state.token = action.payload;

                if(state.token) {
                    axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
                }
                else {
                    delete axios.defaults.headers.common["Authorization"];
                }
            },
            setStatus: (state, action: PayloadAction<boolean>) => {
                state.isAuthenticated = action.payload;
            },
            setUser: (state, action: PayloadAction<User>) => {
                state.user = action.payload;
            }
        }
})

const {actions} = LoginSlice;

export const LoginActions = {
    ...actions,
    setJWTToken: (token: string) => {
        return async (dispatch: AppDispatch) => {
            dispatch(actions.setToken(token))
        };
    },
    logout: () => {
        return async (dispatch: AppDispatch) => {
            window.localStorage.removeItem("jwtToken");
            dispatch(actions.setToken(""));
            dispatch(actions.setStatus(false));
            dispatch(actions.setUser({} as User));
        };
    },
    login: (token: string) => {
        return async (dispatch: AppDispatch) => {
            window.localStorage.setItem("jwtToken", token);
            dispatch(actions.setToken(token));
            dispatch(actions.setStatus(true));
            dispatch(actions.setUser(jwtDecode(token)));
        }
    },
    checkAuthentication: () => {
        return async (dispatch: AppDispatch) => {
            const token: string | null = window.localStorage.getItem("jwtToken");

            if(token) {
                dispatch(actions.setToken(token));
                dispatch(actions.setStatus(true));
                dispatch(actions.setUser(jwtDecode(token)));
            }
            else {
                dispatch(actions.setUser({} as User));
            }
        };
    },
};

const isLoggedIn = (state: RootState) => state.loginstate.isAuthenticated;
const user = (state: RootState) => state.loginstate.user;
const token = (state: RootState) => state.loginstate.token;

export const loginSelectors = {
    isLoggedIn,
    user,
    token
};

export default LoginSlice.reducer;