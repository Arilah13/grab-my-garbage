import axios from 'axios'
import * as actionTypes from '../constants/conversationConstants'

export const getConversation = ({senderid, receiverid}) => async(dispatch, getState) => {
    try {
        let data

        dispatch({
            type: actionTypes.GET_CONVERSATION_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const final  = await axios.get(`https://grab-my-garbage-server.herokuapp.com/conversation/${userInfo._id}/${receiverid}`, config, 
        )

        if(final.data.length === 0) {
            const final = await axios.post('https://grab-my-garbage-server.herokuapp.com/conversation/', { senderid, receiverid }, config)
            data = await final.data
        } else {
            data = final.data
        }

        dispatch({
            type: actionTypes.GET_CONVERSATION_SUCCESS,
            payload: data
        })
        
    } catch (err) {
        dispatch({
            type: actionTypes.GET_CONVERSATION_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const sendMessage = ({conversationId, sender, text, createdAt}) => async(dispatch, getState) => {
    try{
        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        await axios.post('http://192.168.13.1:5000/message/', 
        { conversationId: conversationId, text, createdAt, sender_id: sender._id, sender_name: sender.name, sender_avatar: sender.image },
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

export const getMessage = ({conversationId}) => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.GET_MESSAGE_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.get(`http://192.168.13.1:5000/message/${conversationId}`, config)

        dispatch({
            type: actionTypes.GET_MESSAGE_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.GET_MESSAGE_FAIL,
            payload: err.response.data.msg
        })
    }
}