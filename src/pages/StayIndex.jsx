import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { loadStays } from '../store/actions/stay.actions'
import { StayList } from '../cmps/StayList'

export function StayIndex() {
    const stays = useSelector(storeState => storeState.stayModule.stays)
    const [cityScrollPositions, setCityScrollPositions] = useState({})

    // useEffect(() => {
    //     loadStays()
    // }, [searchParams])

    useEffect(() => {
        loadStays()
    }, [])

    // Function to handle scroll navigation
    const handleScroll = (city, direction) => {
        const currentPosition = cityScrollPositions[city] || 0
        const staysForCity = staysByCity[city] || []
        
        let newPosition
        if (direction === 'left') {
            newPosition = Math.max(0, currentPosition - 1)
        } else {
            newPosition = Math.min(staysForCity.length - 7, currentPosition + 1)
        }
        
        setCityScrollPositions(prev => ({
            ...prev,
            [city]: newPosition
        }))
    }

    // Group stays by city
    const staysByCity = stays.reduce((acc, stay) => {
        const city = stay.loc?.city || 'Unknown'
        acc[city] = acc[city] || []
        acc[city].push(stay)
        return acc
    }, {})

    // Get unique cities and limit to 6 rows
    const cities = Object.keys(staysByCity).slice(0, 6)

    // Show loading or empty state
    if (!stays?.length) {
        return (
            <section className="stay-index">
                <div className="empty-state">
                    <h2>{!stays ? "Loading stays..." : "No stays available"}</h2>
                    {stays && <p>Check back later for new listings</p>}
                </div>
            </section>
        )
    }

    return (
        <section className="stay-index">
            {cities.map(city => {
                const staysForCity = staysByCity[city] || []
                const currentPosition = cityScrollPositions[city] || 0
                const visibleStays = staysForCity.slice(currentPosition, currentPosition + 7)
                const canScrollLeft = currentPosition > 0
                const canScrollRight = currentPosition < staysForCity.length - 7

                return (
                    <div key={city} className="city-section">
                        <div className="city-header">
                            <h2 className="city-title">Stay near {city}</h2>
                            <div className="navigation-arrows">
                                <button 
                                    className={`nav-arrow nav-arrow-left ${!canScrollLeft ? 'disabled' : ''}`}
                                    type="button"
                                    onClick={() => handleScroll(city, 'left')}
                                    disabled={!canScrollLeft}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M15 18l-6-6 6-6"/>
                                    </svg>
                                </button>
                                <button 
                                    className={`nav-arrow nav-arrow-right ${!canScrollRight ? 'disabled' : ''}`}
                                    type="button"
                                    onClick={() => handleScroll(city, 'right')}
                                    disabled={!canScrollRight}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 18l6-6-6-6"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <StayList stays={visibleStays} />
                    </div>
                )
            })}
        </section>
    )
}