
import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'Stay'

export const stayService = {
    query,
    getById,
    save,
    remove,
    addStayMsg
}
window.cs = stayService


async function query(filterBy = { txt: '', minSpeed: 0 }) {
    var stays = await storageService.query(STORAGE_KEY)
    const { txt, minSpeed, sortField, sortDir } = filterBy

    if (txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        stays = stays.filter(Stay => regex.test(Stay.vendor) || regex.test(Stay.description))
    }
    if (minSpeed) {
        stays = stays.filter(Stay => Stay.speed >= minSpeed)
    }
    if(sortField === 'vendor'){
        stays.sort((stay1, stay2) => 
            stay1[sortField].localeCompare(stay2[sortField]) * +sortDir)
    }
    if(sortField === 'speed'){
        stays.sort((stay1, stay2) => 
            (stay1[sortField] - stay2[sortField]) * +sortDir)
    }
    
    stays = stays.map(({ _id, vendor, speed, owner }) => ({ _id, vendor, speed, owner }))
    return stays
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