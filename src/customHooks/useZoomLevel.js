import { useState, useEffect } from 'react'

export function useZoomLevel() {
    const [zoomLevel, setZoomLevel] = useState(100)

    useEffect(() => {
        const updateZoomLevel = () => {
            // Calculate zoom level using window dimensions
            const zoom = Math.round((window.outerWidth / window.innerWidth) * 100)
            setZoomLevel(zoom)
        }

        // Initial calculation
        updateZoomLevel()

        // Listen for resize events (zoom changes trigger resize)
        window.addEventListener('resize', updateZoomLevel)

        return () => {
            window.removeEventListener('resize', updateZoomLevel)
        }
    }, [])

    return zoomLevel
}
