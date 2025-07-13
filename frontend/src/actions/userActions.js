import axios from "axios"
import { 
    clearError, 
    loadUserFail, 
    loadUserRequest, 
    loadUserSuccess, 
    loginFail, 
    loginRequest, 
    loginSuccess, 
    logoutFail, 
    logoutSuccess, 
    registerFail, 
    registerRequest, 
    registerSuccess, 
    updateProfileFail, 
    updateProfileRequest,
    updateProfileSuccess
} from "../slices/authSlice"

export const login = (email, password) => async(dispatch) => {
    try {
        dispatch(loginRequest())
        const {data} = await axios.post('/api/v1/login', {email, password});
        dispatch(loginSuccess(data))
    } catch (error) {
        //handle error
        dispatch(loginFail(error.response.data.message))
    }
}

export const clearAuthError = dispatch => {
    dispatch(clearError())
}

export const register = (userData) => async(dispatch) => {
    try {
        dispatch(registerRequest())
        const config = {
            headers:{
                "Content-Type":"multipart/form-data"
            }
        }
        const {data} = await axios.post('/api/v1/register', userData, config);
        dispatch(registerSuccess(data))
    } catch (error) {
        //handle error
        dispatch(registerFail(error.response.data.message))
    }
}

export const loadUser = async(dispatch) => {
    try {
        dispatch(loadUserRequest())
        const {data} = await axios.get('/api/v1/myprofile');
        dispatch(loadUserSuccess(data))
    } catch (error) {
        //handle error
        dispatch(loadUserFail(error.response.data.message))
    }
}

export const logout = async(dispatch) => {
    try {
        await axios.get('/api/v1/logout');
        dispatch(logoutSuccess())
    } catch (error) {
        //handle error
        dispatch(logoutFail(error.response.data.message))
    }
}

export const updateProfile = (userData) => async(dispatch) => {
    try {
        dispatch(updateProfileRequest())
        const config = {
            headers:{
                "Content-Type":"multipart/form-data"
            }
        }
        const {data} = await axios.put('/api/v1/profile/update', userData, config);
        dispatch(updateProfileSuccess(data))
    } catch (error) {
        //handle error
        dispatch(updateProfileFail(error.response.data.message))
    }
}