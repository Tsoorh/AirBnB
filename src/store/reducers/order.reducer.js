// import { act } from "react"

export const SET_ORDERS = 'SET_ORDERS'
export const SET_ORDER = 'SET_ORDER'
export const REMOVE_ORDER = 'REMOVE_ORDER'
export const ADD_ORDER = 'ADD_ORDER'
export const UPDATE_ORDER = 'UPDATE_ORDER'
export const UPDATE_ORDER_STATUS = 'UPDATE_ORDER_STATUS'
export const ADD_ORDER_MSG = 'ADD_ORDER_MSG'

const initialState = {
    orders: [],
    Order: null,
    lastOrders: []

}

export function orderReducer(state = initialState, action) {
    switch (action.type) {
        case SET_ORDERS:
            return {
                ...state,
                orders: action.orders
            }

        case SET_ORDER:
            return {
                ...state,
                Order: action.Order
            }

        case REMOVE_ORDER:
            return {
                lastOrders: [...state.orders],
                ...state,
                orders: state.orders.filter(order => order._id !== action.orderId)

            }

        case ADD_ORDER:
            return {
                ...state,
                orders: [...state.orders, action.order]
            }

        case UPDATE_ORDER:
            return {
                ...state,
                orders: state.orders.map(order => order._id === action.order._id ? action.order : order)
            }

        case UPDATE_ORDER_STATUS:
            return {
                ...state,
                orders: state.orders.map(order =>
                    order._id === action.orderId
                        ? { ...order, status: action.status }
                        : order
                ),
                Order: state.Order?._id === action.orderId
                    ? { ...state.Order, status: action.status }
                    : state.Order
            }

        case ADD_ORDER_MSG:
            if (action.msg && state.Order) {
                return {
                    ...state,
                    Order: {
                        ...state.Order,
                        msgs: [...state.Order.msgs || [], action.msg]
                    }
                }
            }
            return state

        default:
            return state

    }
}


