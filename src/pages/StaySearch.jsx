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

    // Calculate center based on first stay or default to Tel Aviv
    const mapCenter = stays.length > 0 && stays[0].loc
        ? { lat: stays[0].loc.lat, lng: stays[0].loc.lng }
        : { lat: 32.0853, lng: 34.7818 }


        console.log(mapCenter);
        console.log('srays: ', stays);
        
        
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
                        defaultCenter={mapCenter}
                        defaultZoom={12}
                        mapId="bf51a910020fa25a"
                        style={{ width: '100%', height: '100%' }}
                    >
                        {/* {stays.map(stay => {
                            if (!stay.loc || !stay.loc.lat || !stay.loc.lng) return null

                            return (
                                <AdvancedMarker
                                    key={stay._id}
                                    position={{ lat: stay.loc.lat, lng: stay.loc.lng }}
                                />
                            )
                        })} */}
                                <AdvancedMarker position={mapCenter} />

                    </Map>
                </APIProvider>
            </div>
        </section>
    )
}
