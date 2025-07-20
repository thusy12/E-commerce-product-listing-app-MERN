import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name:'order',
    initialState: {
        oredrDetail: {},
        userOrders: [],
        loading: false
    },
    reducers:{
        createOrderRequest(state,action){
            return{
                ...state,
                loading: true
            }
        },
        createOrderSuccess(state,action){
            return{
                ...state,
                loading: true,
                oredrDetail: action.payload
            }
        },
        createOrderFail(state,action){
            return{
                ...state,
                loading: false,
                error: action.payload
            }
        },
    }
})

const {actions, reducer} = orderSlice;

export const {
    createOrderRequest,
    createOrderSuccess,
    createOrderFail
} = actions;

export default reducer;