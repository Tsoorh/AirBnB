
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
            },
            {
                _id: makeId(),
                name: 'Bay View Haifa Apartment',
                type: 'Apartment',
                summary: 'Modern 2BR with Carmel mountain & bay views.',
                imgUrls: [],
                price: { base: 390, currency: 'ILS', cleaningFee: 70, serviceFeePct: 0.12 },
                capacity: { guests: 4, bedrooms: 2, beds: 3, bathrooms: 1.5 },
                amenities: ['Wifi', 'AC', 'Kitchen', 'Washer', 'TV', 'Elevator'],
                labels: ['City view', 'Family-friendly'],
                host: { _id: 'u103', fullname: 'Noa Ben-Ari', picture: '', isSuperhost: true },
                loc: { country: 'Israel', countryCode: 'IL', city: 'Haifa', address: 'Hankin 12', lat: 32.794, lng: 34.989 },
                houseRules: ['No smoking', 'No parties'],
                checkIn: { from: '15:00', to: '21:00' },
                checkOut: { by: '11:00' },
                unavailable: [{ startDate: '2025-12-24', endDate: '2025-12-28' }],
                rating: { avg: 4.82, count: 24 },
                reviews: [],
                likedByUserIds: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
            {
                _id: makeId(),
                name: 'Eilat Coral Penthouse',
                type: 'Apartment',
                summary: 'Penthouse near the beach with a private terrace and sea breeze.',
                imgUrls: [],
                price: { base: 520, currency: 'ILS', cleaningFee: 90, serviceFeePct: 0.12 },
                capacity: { guests: 5, bedrooms: 2, beds: 3, bathrooms: 2 },
                amenities: ['Wifi', 'AC', 'Kitchen', 'Free parking', 'Pool'],
                labels: ['Near beach', 'Trending'],
                host: { _id: 'u104', fullname: 'Idan Levi', picture: '', isSuperhost: false },
                loc: { country: 'Israel', countryCode: 'IL', city: 'Eilat', address: 'Tarshish 7', lat: 29.5577, lng: 34.9519 },
                houseRules: ['No pets'],
                checkIn: { from: '16:00', to: '22:00' },
                checkOut: { by: '10:00' },
                unavailable: [{ startDate: '2025-11-05', endDate: '2025-11-08' }],
                rating: { avg: 4.68, count: 18 },
                reviews: [],
                likedByUserIds: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
            {
                _id: makeId(),
                name: 'Tiberias Lakeside Cabin',
                type: 'House',
                summary: 'Cozy wooden cabin with Kinneret views and garden.',
                imgUrls: [],
                price: { base: 340, currency: 'ILS', cleaningFee: 50, serviceFeePct: 0.12 },
                capacity: { guests: 3, bedrooms: 1, beds: 2, bathrooms: 1 },
                amenities: ['Wifi', 'Heating', 'Kitchen', 'BBQ grill'],
                labels: ['Lake view', 'Romantic'],
                host: { _id: 'u105', fullname: 'Shira Almog', picture: '', isSuperhost: true },
                loc: { country: 'Israel', countryCode: 'IL', city: 'Tiberias', address: 'Yehuda Halevi 4', lat: 32.7922, lng: 35.5312 },
                houseRules: ['Quiet hours 22:00–07:00'],
                checkIn: { from: '15:00', to: '20:00' },
                checkOut: { by: '11:00' },
                unavailable: [{ startDate: '2025-10-25', endDate: '2025-10-27' }],
                rating: { avg: 4.74, count: 31 },
                reviews: [],
                likedByUserIds: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
            {
                _id: makeId(),
                name: 'Zikhron Ya\'akov Stone Villa',
                type: 'Villa',
                summary: 'Authentic stone villa with patio, near wineries and nature.',
                imgUrls: [],
                price: { base: 680, currency: 'ILS', cleaningFee: 120, serviceFeePct: 0.12 },
                capacity: { guests: 6, bedrooms: 3, beds: 4, bathrooms: 2 },
                amenities: ['Wifi', 'AC', 'Kitchen', 'Free parking', 'Washer', 'Dryer'],
                labels: ['Countryside', 'Families'],
                host: { _id: 'u106', fullname: 'Ruth Hadar', picture: '', isSuperhost: false },
                loc: { country: 'Israel', countryCode: 'IL', city: 'Zikhron Ya\'akov', address: 'Hameyasdim 5', lat: 32.571, lng: 34.953 },
                houseRules: ['No parties', 'No smoking'],
                checkIn: { from: '15:00', to: '20:00' },
                checkOut: { by: '11:00' },
                unavailable: [{ startDate: '2025-12-01', endDate: '2025-12-04' }],
                rating: { avg: 4.66, count: 14 },
                reviews: [],
                likedByUserIds: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
            {
                _id: makeId(),
                name: 'Herzliya Marina Suite',
                type: 'Apartment',
                summary: 'Waterfront suite with balcony overlooking the marina.',
                imgUrls: [],
                price: { base: 560, currency: 'ILS', cleaningFee: 90, serviceFeePct: 0.12 },
                capacity: { guests: 4, bedrooms: 1, beds: 2, bathrooms: 1 },
                amenities: ['Wifi', 'AC', 'Kitchen', 'Elevator', 'Pool', 'Gym'],
                labels: ['Near beach', 'Business travel'],
                host: { _id: 'u107', fullname: 'Eyal Mor', picture: '', isSuperhost: true },
                loc: { country: 'Israel', countryCode: 'IL', city: 'Herzliya', address: 'Hashunit 2', lat: 32.1663, lng: 34.8433 },
                houseRules: ['No smoking'],
                checkIn: { from: '16:00', to: '22:00' },
                checkOut: { by: '10:00' },
                unavailable: [{ startDate: '2025-11-15', endDate: '2025-11-17' }],
                rating: { avg: 4.9, count: 42 },
                reviews: [],
                likedByUserIds: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
            {
                _id: makeId(),
                name: 'Safed Artists\' Loft',
                type: 'Apartment',
                summary: 'Historic quarter loft with stone arches and panoramic terrace.',
                imgUrls: [],
                price: { base: 300, currency: 'ILS', cleaningFee: 40, serviceFeePct: 0.12 },
                capacity: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
                amenities: ['Wifi', 'Heating', 'Kitchen', 'Dedicated workspace'],
                labels: ['Historic', 'Scenic'],
                host: { _id: 'u108', fullname: 'Yael Azulay', picture: '', isSuperhost: true },
                loc: { country: 'Israel', countryCode: 'IL', city: 'Safed', address: 'Arlozorov 9', lat: 32.9646, lng: 35.496 },
                houseRules: ['No parties'],
                checkIn: { from: '14:00', to: '20:00' },
                checkOut: { by: '11:00' },
                unavailable: [{ startDate: '2025-10-20', endDate: '2025-10-22' }],
                rating: { avg: 4.58, count: 19 },
                reviews: [],
                likedByUserIds: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
            {
                _id: makeId(),
                name: 'Porto Riverside Duplex',
                type: 'Apartment',
                summary: 'Charming duplex by the Douro river, walk to Ribeira.',
                imgUrls: [],
                price: { base: 110, currency: 'EUR', cleaningFee: 35, serviceFeePct: 0.12 },
                capacity: { guests: 4, bedrooms: 1, beds: 2, bathrooms: 1 },
                amenities: ['Wifi', 'Kitchen', 'Washer', 'Heating'],
                labels: ['City center', 'River view'],
                host: { _id: 'u109', fullname: 'Duarte Silva', picture: '', isSuperhost: false },
                loc: { country: 'Portugal', countryCode: 'PT', city: 'Porto', address: 'Rua das Flores 21', lat: 41.1579, lng: -8.6291 },
                houseRules: ['Quiet hours 22:00–07:00'],
                checkIn: { from: '15:00', to: '21:00' },
                checkOut: { by: '11:00' },
                unavailable: [{ startDate: '2025-12-29', endDate: '2026-01-02' }],
                rating: { avg: 4.77, count: 53 },
                reviews: [],
                likedByUserIds: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
            {
                _id: makeId(),
                name: 'Athens Acropolis Terrace',
                type: 'Apartment',
                summary: 'Sunny flat with a rooftop terrace and Acropolis view.',
                imgUrls: [],
                price: { base: 95, currency: 'EUR', cleaningFee: 30, serviceFeePct: 0.12 },
                capacity: { guests: 3, bedrooms: 1, beds: 2, bathrooms: 1 },
                amenities: ['Wifi', 'AC', 'Kitchen', 'Washer'],
                labels: ['City view', 'New'],
                host: { _id: 'u110', fullname: 'Eleni Papadopoulos', picture: '', isSuperhost: true },
                loc: { country: 'Greece', countryCode: 'GR', city: 'Athens', address: 'Adrianou 15', lat: 37.9838, lng: 23.7275 },
                houseRules: ['No smoking'],
                checkIn: { from: '15:00', to: '22:00' },
                checkOut: { by: '11:00' },
                unavailable: [{ startDate: '2025-11-22', endDate: '2025-11-25' }],
                rating: { avg: 4.84, count: 61 },
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