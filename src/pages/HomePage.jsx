import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadStays } from '../store/actions/stay.actions'
import { StayList } from '../cmps/StayList'

export function HomePage() {
    const stays = useSelector(storeState => storeState.stayModule.stays)

    useEffect(() => {
        loadStays()
    }, [])

    return (
        <section className="home">
            <div className="home-content">
                <StayList stays={stays} />
            </div>
        </section>
    )
}

