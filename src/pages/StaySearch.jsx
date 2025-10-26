import { useEffect } from "react"
import { loadStays } from "../store/actions/stay.actions"
import { useSearchParams } from 'react-router-dom'
import { useSelector } from "react-redux"
import { StayList } from "../cmps/StayList"
import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';






export function StaySearch(){
    const [searchParams] = useSearchParams()
    const stays = useSelector(storeState => storeState.stayModule.stays)


    useEffect(() => {
        loadStays()
    },[searchParams])

    console.log('Stays data:', stays)
    

        
    const position = { lat: 53.54992, lng: 10.00678}
    return(
        <section className="stay-search">
            <div className="results-stay-list">
                <StayList
                    stays={stays}
                />
            </div>

            <div className="map-container">
                <APIProvider apiKey={import.meta.env.VITE_GMAP_KEY}>
                    <Map
                        defaultCenter={position}
                        defaultZoom={10}
                        id="map"
                    >
                        <AdvancedMarker position={position} />
                    </Map>
                </APIProvider>
            </div>
        </section>
    )
}