import axios from 'axios'
import * as actionTypes from '../constants/conversationConstants'

// export const getConversation = ({senderid, receiverid}) => async(dispatch, getState) => {
//     try {
//         let data

//         dispatch({
//             type: actionTypes.GET_CONVERSATION_REQUEST
//         })

//         const { userLogin: { userInfo } } = getState()

//         const config = {
//             headers: {
//                 'Content-type': 'application/json',
//                 Authorization: `Bearer ${userInfo.token}`
//             },
//         }

//         const final  = await axios.get(`https://grab-my-garbage-server.herokuapp.com/conversation/${receiverid}/${userInfo._id}`, config, 
//         )

//         if(final.data.length === 0) {
//             const final = await axios.post('https://grab-my-garbage-server.herokuapp.com/conversation/', { haulerid: senderid, userid: receiverid }, config)
//             data = await final.data
//         } else {
//             data = final.data
//         }

//         dispatch({
//             type: actionTypes.GET_CONVERSATION_SUCCESS,
//             payload: data
//         })
        
//     } catch (err) {
//         dispatch({
//             type: actionTypes.GET_CONVERSATION_FAIL,
//             payload: err.response.data.msg
//         })
//     }
// }

export const sendMessage = ({conversationId, sender, text, createdAt}) => async(dispatch, getState) => {
    try{
        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        await axios.post('https://grab-my-garbage-server.herokuapp.com/message/hauler', 
        { conversationId: conversationId, text, createdAt, sender_id: sender._id, sender_name: sender.name, sender_avatar: sender.image },
        config)

        dispatch({
            type: actionTypes.SEND_MESSAGE_SUCCESS
        })
        dispatch(getConversations())
    } catch (err) {
        dispatch({
            type: actionTypes.SEND_MESSAGE_FAIL,
            payload: err.response.data.msg
        })
    }
}

// export const getMessage = ({conversationId}) => async(dispatch, getState) => {
//     try{
//         dispatch({
//             type: actionTypes.GET_MESSAGE_REQUEST
//         })

//         const { userLogin: { userInfo } } = getState()

//         const config = {
//             headers: {
//                 'Content-type': 'application/json',
//                 Authorization: `Bearer ${userInfo.token}`
//             },
//         }

//         const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/message/${conversationId}`, config)

//         dispatch({
//             type: actionTypes.GET_MESSAGE_SUCCESS,
//             payload: data
//         })
//     } catch (err) {
//         dispatch({
//             type: actionTypes.GET_MESSAGE_FAIL,
//             payload: err.response.data.msg
//         })
//     }
// }

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

        //const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/conversation/${userInfo._id}`, config)
        const { data } = await axios.get(`http://192.168.13.1:5000/conversation/${userInfo._id}`, config)

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
        dispatch(getConversations())
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