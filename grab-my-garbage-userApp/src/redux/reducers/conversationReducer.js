import * as actionTypes from '../constants/conversationConstants'

export const getConversationReducer = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.GET_CONVERSATION_REQUEST:
            return { loading: true }
        case actionTypes.GET_CONVERSATION_SUCCESS:
            return { loading: false, conversation: action.payload, success: true }
        case actionTypes.GET_CONVERSATION_FAIL:
            return { loading: false, error: action.payload }
        case actionTypes.GET_CONVERSATION_RESET:
            return {}
        default:
            return state
    }
}

export const sendMessageReducer = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.SEND_MESSAGE_SUCCESS:
            return { success: true }
        case actionTypes.SEND_MESSAGE_FAIL:
            return { success: false, error: action.payload }
        default:
            return state
    }
}

export const getMessageReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.GET_MESSAGE_REQUEST:
            return { loading: true }
        case actionTypes.GET_MESSAGE_SUCCESS:
            return { loading: false, message: action.payload, success: true }
        case actionTypes.GET_MESSAGE_FAIL:
            return { loading: false, error: action.payload }
        case actionTypes.GET_MESSAGE_RESET:
            return {}
        default: 
            return state
    }
}

export const getAllConversationReducer = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL_CONVERSATIONS_REQUEST:
            return { loading: true }
        case actionTypes.GET_ALL_CONVERSATIONS_SUCCESS:
            return { loading: false, conversation: action.payload, success: true }
        case actionTypes.GET_ALL_CONVERSATIONS_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}