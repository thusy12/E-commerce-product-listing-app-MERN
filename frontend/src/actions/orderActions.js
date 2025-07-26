import { adminOrderFail, adminOrderRequest, adminOrderSuccess, createOrderFail, createOrderRequest, createOrderSuccess, deleteOrderFail, deleteOrderRequest, deleteOrderSuccess, orderDetailFail, orderDetailRequest, orderDetailSuccess, updateOrderFail, updateOrderRequest, updateOrderSuccess, userOrderFail, userOrderRequest, userOrderSuccess } from "../slices/orderSlice";
import axios from "axios";

export const createOrder = order => async(dispatch) => {
    try {
        dispatch(createOrderRequest());
        const {data} = await axios.post('/api/v1/order/new', order);
        dispatch(createOrderSuccess(data))
    } catch (error) {
        //handle error
        dispatch(createOrderFail(error.response.data.message))
    }
}

export const userOrders = async(dispatch) => {
    try {
        dispatch(userOrderRequest());
        const {data} = await axios.get('/api/v1/myorders');
        dispatch(userOrderSuccess(data))
    } catch (error) {
        //handle error
        dispatch(userOrderFail(error.response.data.message))
    }
}

export const orderDetail = id => async(dispatch) => {
    try {
        dispatch(orderDetailRequest());
        const {data} = await axios.get(`/api/v1/order/${id}`);
        dispatch(orderDetailSuccess(data))
    } catch (error) {
        //handle error
        dispatch(orderDetailFail(error.response.data.message))
    }
}

export const getAdminOrders = async (dispatch) => {
    try {
        dispatch(adminOrderRequest())
        const {data} = await axios.get('/api/v1/admin/orders');
        dispatch(adminOrderSuccess(data))
    } catch (error) {
        //handle error
        dispatch(adminOrderFail(error.response.data.message))
    }
}

export const deleteOrder = id => async (dispatch) => {
    try {
        dispatch(deleteOrderRequest())
        await axios.delete(`/api/v1/admin/order/${id}`);
        dispatch(deleteOrderSuccess())
    } catch (error) {
        //handle error
        dispatch(deleteOrderFail(error.response.data.message))
    }
}

export const updateOrder = (id, orderData) => async (dispatch) => {
    try {
        dispatch(updateOrderRequest())
        const {data} = await axios.put(`/api/v1/admin/order/${id}`, orderData);
        dispatch(updateOrderSuccess(data))
    } catch (error) {
        //handle error
        dispatch(updateOrderFail(error.response.data.message))
    }
}