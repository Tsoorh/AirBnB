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

    useEffect(() => {
        loadStays()
    }, [searchParams])

    async function onRemoveStay(stayId) {
        try {
            await removeStay(stayId)
            showSuccessMsg('Stay removed')            
        } catch (err) {
            showErrorMsg('Cannot remove Stay')
        }
    }

    async function onAddStay() {
        const Stay = stayService.getEmptyStay()
        Stay.vendor = prompt('Vendor?', 'Some Vendor')
        try {
            const savedStay = await addStay(Stay)
            showSuccessMsg(`Stay added (id: ${savedStay._id})`)
        } catch (err) {
            showErrorMsg('Cannot add Stay')
        }        
    }

    async function onUpdateStay(Stay) {
        const speed = +prompt('New speed?', Stay.speed) || 0
        if(speed === 0 || speed === Stay.speed) return

        const stayToSave = { ...Stay, speed }
        try {
            const savedStay = await updateStay(stayToSave)
            showSuccessMsg(`Stay updated, new speed: ${savedStay.speed}`)
        } catch (err) {
            showErrorMsg('Cannot update Stay')
        }        
    }

    return (
        <section className="Stay-index">
            <StayList 
                stays={stays}
                onRemoveStay={onRemoveStay} 
                onUpdateStay={onUpdateStay}/>
        </section>
    )
}