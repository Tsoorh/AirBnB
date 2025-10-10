import { httpService } from '../http.service'

export const stayService = {
    query,
    getById,
    save,
    remove,
    addStayMsg
}

async function query(filterBy = { txt: '', minSpeed: 0 }) {
    return httpService.get(`Stay`, filterBy)
}

function getById(stayId) {
    return httpService.get(`Stay/${stayId}`)
}

async function remove(stayId) {
    return httpService.delete(`Stay/${stayId}`)
}
async function save(Stay) {
    var savedStay
    if (Stay._id) {
        savedStay = await httpService.put(`Stay/${Stay._id}`, Stay)
    } else {
        savedStay = await httpService.post('Stay', Stay)
    }
    return savedStay
}

async function addStayMsg(stayId, txt) {
    const savedMsg = await httpService.post(`Stay/${stayId}/msg`, {txt})
    return savedMsg
}