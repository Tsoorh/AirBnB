// import { act } from "react"

export const SET_STAYS = 'SET_STAYS'
export const SET_STAY = 'SET_STAY'
export const REMOVE_STAY = 'REMOVE_STAY'
export const ADD_STAY = 'ADD_STAY'
export const UPDATE_STAY = 'UPDATE_STAY'
export const ADD_STAY_MSG = 'ADD_STAY_MSG'

const initialState = {
    stays: [],
    Stay: null,
    lastStays: []

}

export function stayReducer(state = initialState, action) {
    switch (action.type) {
        case SET_STAYS:
            return {
                ...state,
                stays: action.stays
            }

        case SET_STAY:
            return {
                ...state,
                Stay: action.Stay
            }

        case REMOVE_STAY:
            return {
                lastStays: [...state.stays],
                ...state,
                stays: state.stays.filter(stay => stay._id !== action.stayId)

            }

        case ADD_STAY:
            return {
                ...state,
                stays: [...state.stays, action.stay]
            }

        case UPDATE_STAY:
            return {
                ...state,
                stays: state.stays.map(stay => stay._id === action.stay._id ? action.stay : stay)
            }
        case ADD_STAY_MSG:
            if (action.msg && state.Stay) {
                return{
                    ...state,
                    Stay: { ...state.Stay,
                        msgs: [...state.Stay.msgs || [], action.msg] }
                }
            }
            return state
        default:
                return state

    }
}


