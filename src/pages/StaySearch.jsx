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
                        defaultZoom={8}
                        mapId="bf51a910020fa25a"
                        style={{ width: '100%', height: '100%' }}
                    >
                        {stays.map((stay, index) => {
                            if (!stay.loc || !stay.loc.lat || !stay.loc.lng) {
                                console.log('Stay missing location:', stay.name)
                                return null
                            }
                            return (
                                <AdvancedMarker
                                    key={stay._id}
                                    position={{ lat: stay.loc.lat, lng: stay.loc.lng }}
                                >
                                    <div style={{
                                        backgroundColor: 'white',
                                        padding: '6px 10px',
                                        borderRadius: '20px',
                                        border: '1.5px solid #222',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                                        cursor: 'pointer'
                                    }}>
                                        ₪{stay.price.base}
                                    </div>
                                </AdvancedMarker>
                            )
                        })}
                                {/* <AdvancedMarker position={mapCenter} /> */}

                    </Map>
                </APIProvider>
            </div>
        </section>
    )
}
