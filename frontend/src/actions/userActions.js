import axios from "axios"
import { 
    clearError, 
    forgotPasswordFail, 
    forgotPasswordRequest, 
    forgotPasswordSuccess, 
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
    resetPasswordFail, 
    resetPasswordRequest, 
    resetPasswordSuccess, 
    updatePasswordFail, 
    updatePasswordRequest, 
    updatePasswordSuccess, 
    updateProfileFail, 
    updateProfileRequest,
    updateProfileSuccess
} from "../slices/authSlice"
import { deleteUserFail, deleteUserRequest, deleteUserSuccess, updateUserFail, updateUserRequest, updateUserSuccess, userFail, userRequest, usersFail, usersRequest, usersSuccess, userSuccess } from "../slices/userSlice";

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

export const updatePassword = (formData) => async(dispatch) => {
    try {
        dispatch(updatePasswordRequest());
        const config = {
            headers:{
                "Content-Type":"application/json"
            }
        }
        await axios.put('/api/v1/password/change', formData, config);
        dispatch(updatePasswordSuccess())
    } catch (error) {
        //handle error
        dispatch(updatePasswordFail(error.response.data.message))
    }
}
export const forgotPassword = (formData) => async(dispatch) => {
    try {
        dispatch(forgotPasswordRequest());
        const config = {
            headers:{
                "Content-Type":"application/json"
            }
        }
        const {data} = await axios.post('/api/v1/password/forgot', formData, config);
        dispatch(forgotPasswordSuccess(data))
    } catch (error) {
        //handle error
        dispatch(forgotPasswordFail(error.response.data.message))
    }
}

export const resetPassword = (formData, token) => async(dispatch) => {
    try {
        dispatch(resetPasswordRequest());
        const config = {
            headers:{
                "Content-Type":"application/json"
            }
        }
        const {data} = await axios.post(`/api/v1/password/reset/${token}`, formData, config);
        dispatch(resetPasswordSuccess(data))
    } catch (error) {
        //handle error
        dispatch(resetPasswordFail(error.response.data.message))
    }
}

export const getUsers = async(dispatch) => {
    try {
        dispatch(usersRequest())
        const {data} = await axios.get('/api/v1/admin/users');
        dispatch(usersSuccess(data))
    } catch (error) {
        //handle error
        dispatch(usersFail(error.response.data.message))
    }
}

export const getUser = id => async(dispatch) => {
    try {
        dispatch(userRequest())
        const {data} = await axios.get(`/api/v1/admin/user/${id}`);
        dispatch(userSuccess(data))
    } catch (error) {
        //handle error
        dispatch(userFail(error.response.data.message))
    }
}

export const deleteUser = id => async(dispatch) => {
    try {
        dispatch(deleteUserRequest())
        const {data} = await axios.delete(`/api/v1/admin/user/${id}`);
        dispatch(deleteUserSuccess(data))
    } catch (error) {
        //handle error
        dispatch(deleteUserFail(error.response.data.message))
    }
}

export const updateUser = (id, formData) => async(dispatch) => {
    try {
        dispatch(updateUserRequest());
        const config = {
            headers:{
                "Content-Type":"application/json"
            }
        }
        await axios.put(`/api/v1/admin/user/${id}`, formData, config);
        dispatch(updateUserSuccess())
    } catch (error) {
        //handle error
        dispatch(updateUserFail(error.response.data.message))
    }
}