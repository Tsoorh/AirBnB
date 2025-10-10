import { stayService } from '../../services/stay'
import { store } from '../store'
import { ADD_STAY, REMOVE_STAY, SET_STAYS, SET_STAY, UPDATE_STAY, ADD_STAY_MSG } from '../reducers/Stay.reducer'

export async function loadStays(filterBy) {
    try {
        const stays = await stayService.query(filterBy)
        store.dispatch(getCmdSetStays(stays))
    } catch (err) {
        console.log('Cannot load stays', err)
        throw err
    }
}

export async function loadStay(stayId) {
    try {
        const Stay = await stayService.getById(stayId)
        store.dispatch(getCmdSetStay(Stay))
    } catch (err) {
        console.log('Cannot load Stay', err)
        throw err
    }
}


export async function removeStay(stayId) {
    try {
        await stayService.remove(stayId)
        store.dispatch(getCmdRemoveStay(stayId))
    } catch (err) {
        console.log('Cannot remove Stay', err)
        throw err
    }
}

export async function addStay(Stay) {
    try {
        const savedStay = await stayService.save(Stay)
        store.dispatch(getCmdAddStay(savedStay))
        return savedStay
    } catch (err) {
        console.log('Cannot add Stay', err)
        throw err
    }
}

export async function updateStay(Stay) {
    try {
        const savedStay = await stayService.save(Stay)
        store.dispatch(getCmdUpdateStay(savedStay))
        return savedStay
    } catch (err) {
        console.log('Cannot save Stay', err)
        throw err
    }
}

export async function addStayMsg(stayId, txt) {
    try {
        const msg = await stayService.addStayMsg(stayId, txt)
        store.dispatch(getCmdAddStayMsg(msg))
        return msg
    } catch (err) {
        console.log('Cannot add Stay msg', err)
        throw err
    }
}

// Command Creators:
function getCmdSetStays(stays) {
    return {
        type: SET_STAYS,
        stays
    }
}
function getCmdSetStay(Stay) {
    return {
        type: SET_STAY,
        Stay
    }
}
function getCmdRemoveStay(stayId) {
    return {
        type: REMOVE_STAY,
        stayId
    }
}
function getCmdAddStay(Stay) {
    return {
        type: ADD_STAY,
        Stay
    }
}
function getCmdUpdateStay(Stay) {
    return {
        type: UPDATE_STAY,
        Stay
    }
}
function getCmdAddStayMsg(msg) {
    return {
        type: ADD_STAY_MSG,
        msg
    }
}

// unitTestActions()
async function unitTestActions() {
    await loadStays()
    await addStay(stayService.getEmptyStay())
    await updateStay({
        _id: 'm1oC7',
        vendor: 'Stay-Good',
    })
    await removeStay('m1oC7')
    // TODO unit test addStayMsg
}
