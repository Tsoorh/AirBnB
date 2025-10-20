const { DEV, VITE_LOCAL } = import.meta.env

// import { getRandomIntInclusive, makeId } from '../util.service'

import { orderService as local } from './order.service.local'
// import { orderService as remote } from './order.service.remote'  


export function getEmptyOrder() {
  const now = Date.now()
  return {
    _id: '',                      
    host: { _id: '', fullname: "", imgUrl: "" },
    guest: { _id: '', fullname: "" },
    totalPrice: 0,                  
    checkIn: null,
    checkOut: null,                  
    guests: {
      adults: 1,
      kids: 0,
      infants: 0,                   
      pets: 0
    },
    stay: {                         
      _id: null,
      name: "",
      imgUrl: ""
    },
    msgs: [],                       // host-guest chat per order
    status: "pending",              // pending | approved | rejected | canceled | completed
    paymentStatus: "unpaid",        // unpaid | paid | refunded
    createdAt: now,
    updatedAt: now
  }
}

function getEmptyOrderFilter() {
      return {
          status: '', // 'pending', 'approved', 'rejected', ''
          guestId: '',
          hostId: '',
          stayId: '',
          upcomingOnly: null, // true = future bookings, false = past
      }
  }


// const service = (VITE_LOCAL ==='true') ? local : remote
const service = local
export const orderService = { getEmptyOrderFilter, getEmptyOrder, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.orderService = orderService
