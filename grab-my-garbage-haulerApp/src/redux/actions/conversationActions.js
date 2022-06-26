import axios from 'axios'
import * as actionTypes from '../constants/conversationConstants'

export const sendMessage = ({conversationId, sender, text, createdAt, image}) => async(dispatch, getState) => {
    try{
        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        await axios.post('https://grab-my-garbage-server.herokuapp.com/message/hauler', 
        { conversationId, text, createdAt, sender, image },
        config)

        dispatch({
            type: actionTypes.SEND_MESSAGE_SUCCESS
        })
    } catch (err) {
        dispatch({
            type: actionTypes.SEND_MESSAGE_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const getConversations = () => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.GET_ALL_CONVERSATIONS_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/conversation/${userInfo._id}`, config)

        dispatch({
            type: actionTypes.GET_ALL_CONVERSATIONS_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.GET_ALL_CONVERSATIONS_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const receiverRead = (id) => async(dispatch, getState) => {
    try{
        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.put(`https://grab-my-garbage-server.herokuapp.com/conversation/hauler/${id}`, config)

        dispatch({
            type: actionTypes.UPDATE_READ_MESSAGE_SUCCESS,
            payload: data
        })
    } catch(err) {
        dispatch({
            type: actionTypes.UPDATE_READ_MESSAGE_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const addCurrentConvo = (id) => async(dispatch) => {
    try{
        dispatch({
            type: actionTypes.ADD_CURRENT_CONVO,
            payload: id
        })
    } catch(err) {
        dispatch({
            type: actionTypes.ADD_CURRENT_CONVO_FAIL,
            payload: err
        })
    }
}