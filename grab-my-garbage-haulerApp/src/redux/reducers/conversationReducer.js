import * as actionTypes from '../constants/conversationConstants'

export const getConversationReducer = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.GET_CONVERSATION_REQUEST:
            return { loading: true }
        case actionTypes.GET_CONVERSATION_SUCCESS:
            return { loading: false, conversation: action.payload, success: true }
        case actionTypes.GET_CONVERSATION_FAIL:
            return { loading: false, error: action.payload }
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

export const updateReadMessageReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.UPDATE_READ_MESSAGE_SUCCESS:
            return { success: true }
        case actionTypes.UPDATE_READ_MESSAGE_FAIL:
            return { success: false, error: action.payload }
        default:
            return state
    }
}

export const currentConvoReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.ADD_CURRENT_CONVO:
            return { convo: action.payload }
        case actionTypes.ADD_CURRENT_CONVO_FAIL:
            return { error: action.payload }
        case actionTypes.RESET_CURRENT_CONVO:
            return {}
        default:
            return state
    }
}

export const receiveMessageReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.CONVERSATION_RECEIVED_SUCCESS:
            return { success: true }
        case actionTypes.CONVERSATION_RECEIVED_FAIL:
            return { success: false, error: action.payload }
        default:
            return state
    }
}