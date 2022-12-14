import axios from 'axios';
import { setAlert } from './alert';

import{
    CLEAR_PROFILE,
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE
} from './types';

//Get the current users profile

export const getCurrentUserProfile  = () => async dispatch =>{
    try {
        const res = await axios.get('/api/profile/me');
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:error.response.statusText, status: error.response.status}
        });
    }
}

//Create or update profile
export const createProfile = (formData,history,edit=false) => async dispatch =>{
    try {
        const config ={
            headers:{
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.post('/api/profile',formData,config)

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
        dispatch(setAlert(edit ? 'Profile updated' : 'Profile created','success'));
        if(!edit){
            history.push('/dashboard');
        }
    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText, status: err.response.status}
        });
    }
}


//add experience

export const addExperience =(formData, history) => async dispatch =>{
    try {
        const config ={
            headers:{
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.post('/api/profile/experience',formData,config)

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Experience Added','success'));
        if(!edit){
            history.push('/dashboard');
        }
    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText, status: err.response.status}
        });
    }
}

//add education

export const addEducation =(formData, history) => async dispatch =>{
    try {
        const config ={
            headers:{
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.post('/api/profile/education',formData,config)

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('education Added','success'));
        if(!edit){
            history.push('/dashboard');
        }
    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText, status: err.response.status}
        });
    }
}