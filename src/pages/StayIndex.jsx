import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

import { loadStays, addStay, updateStay, removeStay } from '../store/actions/stay.actions'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { stayService } from '../services/stay'
import { userService } from '../services/user'

import { StayList } from '../cmps/StayList'

export function StayIndex() {
    const stays = useSelector(storeState => storeState.stayModule.stays)
    const [searchParams] = useSearchParams()

    // useEffect(() => {
    //     loadStays()
    // }, [searchParams])

    useEffect(() => {
        loadStays()
    }, [])

    async function onRemoveStay(stayId) {
        try {
            await removeStay(stayId)
            showSuccessMsg('stay removed')            
        } catch (err) {
            showErrorMsg('Cannot remove stay')
        }
    }

    async function onAddStay() {
        const stay = stayService.getEmptyStay()
        stay.vendor = prompt('Vendor?', 'Some Vendor')
        try {
            const savedStay = await addStay(stay)
            showSuccessMsg(`stay added (id: ${savedStay._id})`)
        } catch (err) {
            showErrorMsg('Cannot add stay')
        }        
    }

    async function onUpdateStay(stay) {
        const speed = +prompt('New speed?', stay.speed) || 0
        if(speed === 0 || speed === stay.speed) return

        const stayToSave = { ...stay, speed }
        try {
            const savedStay = await updateStay(stayToSave)
            showSuccessMsg(`stay updated, new speed: ${savedStay.speed}`)
        } catch (err) {
            showErrorMsg('Cannot update stay')
        }        
    }

    return (
        <section className="stay-index">
            <StayList 
                stays={stays}
                onRemoveStay={onRemoveStay} 
                onUpdateStay={onUpdateStay}/>
        </section>
    )
}