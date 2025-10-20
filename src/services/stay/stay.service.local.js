
import { storageService } from '../async-storage.service'
import { loadFromStorage, makeId, saveToStorage } from '../util.service'
import { userService } from '../user'
import { getDefaultFilter } from '.'
import staysData from './stays-data.json'

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

    if(f.minPrice != null){
        f.minPrice = Number(f.minPrice)        
        stays = stays.filter(s => (s.price?.base ?? 0) >= f.minPrice)
    } 

    if(f.maxPrice != null) {
        f.maxPrice = Number(f.maxPrice)        
        stays = stays.filter(s => (s.price?.base ?? 0) <= f.maxPrice) 
    }

    if(f.dates?.checkIn && f.dates?.checkOut) {
        stays = stays.filter(s => isAvailable(s, f.dates))
    }

    if(f.adults) {
        f.adults = Number(f.adults)        
        f.children = Number(f.children)
        const needed = (f.adults || 0) + (f.children || 0)        
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
        stays = staysData.map(stay => ({
            ...stay,
            _id: makeId(),
            createdAt: Date.now(),
            updatedAt: Date.now()
        }))
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