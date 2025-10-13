import { storageService } from "../async-storage.service"
import { loadFromStorage } from "../util.service"


export const orderService = {
    query,
    getById,
    save,
    remove,
    createDraft
} 


async function query(filterBy ={}) {
    //filter: {guestId, hostId, status, upcomingOnly}
    let orders = await loadFromStorage('order')
    if(filterBy.guestId) orders = orders.filter(o => o.guest._id === filterBy.guestId)
    if(filterBy.hostId) orders = orders.filter(o => o.stay.hostId === filterBy.hostId)
    if(filterBy.status) orders = orders.filter(o => o.status === filterBy.status)
    if(filterBy.upcomingOnly) {
        const now = Date.now()
        orders = orders.filter(o => new Date(o.dates.checkIn).getTime() >= now )
    }
    return orders
}

async function getById(orderId){
    return storageService.get('order', orderId)
}

async function save(order) {
    if(!order._id){
        order.createdAt = Date.now()
        order.updatedAt = order.createdAt
    } else {
        order.updatedAt = Date.now()
    }
    return order._id ? storageService.put('order', order) : storageService.post('order', order)
}

async function remove(orderId) {
    return storageService.remove('order', orderId)    
}



function createDraft({stay, guest, dates, guests}) {
    const nights = Math.max(1, (new Date(dates.checkOut) - new Date(dates.checkIn)) / (1000*60*60*24))
    const PricePerNight = stay.price.base
    const cleaningFee = stay.price.cleaningFee || 0
    const subtotal = PricePerNight * nights +cleaningFee
    const serviceFee = Math.round(subtotal * (stay.price.serviceFeePtc || 0))
    const taxes = 0
    const total = subtotal + serviceFee + taxes

    return {
        stay: {_id: stay._id, name: stay.name, imgUrl: stay.imgUrl?.[0], hostId: stay.host._id},
        guest: {_id: guest._id, fullname: guest.fullname, picture: guest.picture},
        dates: {...dates, nights},
        guests,
        price: {PricePerNight, cleaningFee, serviceFeePtc: stay.price.serviceFeePtc || 0, currency: stay.price.currency, subtotal, serviceFee, taxes, total},
        status: 'pending',
        paymentStatus: 'unpaid',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        msgs: []
    }
}