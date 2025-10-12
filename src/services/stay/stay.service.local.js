
import { storageService } from '../async-storage.service'
import { loadFromStorage, makeId, saveToStorage } from '../util.service'
import { userService } from '../user'
import { getDefaultFilter } from '.'

const STORAGE_KEY = 'stayDB'
// Initialize stays when module loads
_createStays()

export const stayService = {
    query,
    getById,
    save,
    remove,
    addStayMsg
}
window.cs = stayService


async function query(filterBy = {}) {
    let stays = await loadFromStorage(STORAGE_KEY)
    const f = _normalizeFilter(filterBy)
    
    if(f.txt) {
        const regex = new RegExp(f.txt, 'i')
        stays = stays.filter(s =>
            regex.test(s.name) ||
            regex.test(s.summary) ||
            regex.test(s.loc?.city) 
        )
    }

    if(f.city){
        stays = stays.filter(s => (s.loc?.city || '' ) === f.city)
    }

    if(f.labels?.length) {
        stays = stays.filter (s => f.labels.every(l => (s.labels || []).includes(l)))
    }

    if(f.minPrice != null) stays = stays.filter(s => (s.price?.base ?? 0) >= f.minPrice) 
    if(f.maxPrice != null) stays = stays.filter(s => (s.price?.base ?? 0) <= f.maxPrice) 

    if(f.dates?.checkIn && f.dates?.checkOut) {
        stays = stays.filter(s => isAvailable(s, f.dates))
    }

    if(f.guests?.adults) {
        const needed = (f.guests.adults || 0) + (f.guests.children || 0)
        stays = stays.filter(s => (s.capacity?.guests ?? 0) >= needed)
    }
    
    return stays
}

function isAvailable(stay, {checkIn, checkOut}) {
    if(!checkIn || !checkOut) return true
    const ci = _toMs(checkIn)
    const co = _toMs(checkOut)
    if(ci >= co) return false
    const ranges = stay.unavailable || []
    return !ranges.some(r => {
        const rs = _toMs(r.startDate)
        const re = _toMs(r.endDate)
        return ci < re && co > rs
    })
}


function getById(stayId) {
    return storageService.get(STORAGE_KEY, stayId)
}

async function remove(stayId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, stayId)
}

async function save(Stay) {
    var savedStay
    if (Stay._id) {
        const stayToSave = {
            _id: Stay._id,
            speed: Stay.speed
        }
        savedStay = await storageService.put(STORAGE_KEY, stayToSave)
    } else {
        const stayToSave = {
            vendor: Stay.vendor,
            speed: Stay.speed,
            // Later, owner is set by the backend
            owner: userService.getLoggedinUser(),
            msgs: []
        }
        savedStay = await storageService.post(STORAGE_KEY, stayToSave)
    }
    return savedStay
}

async function addStayMsg(stayId, txt) {
    // Later, this is all done by the backend
    const Stay = await getById(stayId)

    const msg = {
        id: makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    Stay.msgs.push(msg)
    await storageService.put(STORAGE_KEY, Stay)

    return msg
}



async function _createStays() {
    let stays = await loadFromStorage(STORAGE_KEY)
    if(!stays || !stays.length) {
        stays = [
            {
                _id: makeId(),
                name: 'Sunny Loft in Neve Tzedek',
                type: 'Apartment',
                summary: 'Bright loft near the beach, perfect for couples.',
                imgUrls: [],
                price: { base: 450, currency: 'ILS', cleaningFee: 80, serviceFeePct: 0.12 },
                capacity: { guests: 3, bedrooms: 1, beds: 2, bathrooms: 1 },
                amenities: ['Wifi', 'AC', 'Kitchen', 'Washer'],
                labels: ['Trending', 'Near beach'],
                host: { _id: 'u101', fullname: 'Dana Levi', picture: '', isSuperhost: true },
                loc: { country: 'Israel', countryCode: 'IL', city: 'Tel Aviv-Yafo', address: 'Shabazi 23', lat: 32.0615, lng: 34.7650 },
                houseRules: ['No smoking'],
                checkIn: { from: '15:00', to: '22:00' },
                checkOut: { by: '11:00' },
                unavailable: [{ startDate: '2025-11-18', endDate: '2025-11-21' }],
                rating: { avg: 4.86, count: 37 },
                reviews: [],
                likedByUserIds: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
            {
                _id: makeId(),
                name: 'Quiet Garden Suite',
                type: 'House',
                summary: 'Private suite with a lovely garden.',
                imgUrls: [],
                price: { base: 320, currency: 'ILS', cleaningFee: 60, serviceFeePct: 0.12 },
                capacity: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
                amenities: ['Wifi', 'Heating'],
                labels: ['New'],
                host: { _id: 'u102', fullname: 'Roni Cohen', picture: '', isSuperhost: false },
                loc: { country: 'Israel', countryCode: 'IL', city: 'Jerusalem', address: 'Emek Refaim 10', lat: 31.761, lng: 35.219 },
                houseRules: ['No parties'],
                checkIn: { from: '16:00', to: '21:00' },
                checkOut: { by: '10:00' },
                unavailable: [],
                rating: { avg: 4.7, count: 12 },
                reviews: [],
                likedByUserIds: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
            }
        ]
    saveToStorage(STORAGE_KEY, stays)
    }
}

function _normalizeFilter(filter) {
  const f = { ...getDefaultFilter(), ...filter }
  // Merge dates if user passed top-level checkIn/checkOut (legacy)
  if (!f.dates) f.dates = { checkIn: filter.checkIn || null, checkOut: filter.checkOut || null }
  if (filter.checkIn && !f.dates.checkIn) f.dates.checkIn = filter.checkIn
  if (filter.checkOut && !f.dates.checkOut) f.dates.checkOut = filter.checkOut

  // Validate range
  const { checkIn, checkOut } = f.dates || {}
  if (checkIn && checkOut && _toMs(checkIn) >= _toMs(checkOut)) {
    f.dates.checkOut = null
  }
  return f
}

function _toMs(d) { return new Date(d).getTime() }