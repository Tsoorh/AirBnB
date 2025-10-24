import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

export function StayPreview({ stay }) {
    const price = stay.price?.base || 0
    
    // Generate consistent dates based on stay ID for demo purposes
    const { startDate, endDate, nights, totalPrice, isGuestFavorite } = useMemo(() => {
        const seed = stay._id?.charCodeAt(0) || 0
        const startDate = new Date()
        startDate.setDate(startDate.getDate() + (seed % 30))
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + ((seed % 5) + 1))
        
        const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
        const totalPrice = price * nights
        const isGuestFavorite = (seed % 3) === 0
        
        return { startDate, endDate, nights, totalPrice, isGuestFavorite }
    }, [stay._id, price])
    
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    
    return (
        <Link to={`/stay/${stay._id}`} className="stay-preview-link">
            <article className="stay-preview">
                <div className="stay-image-container">
                    <img 
                        src={stay.imgUrls?.[0] || '/img/sunflowers.jpg'} 
                        alt={stay.name}
                        className="stay-image"
                    />
                    <button className="heart-icon" type="button">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </button>
                    {isGuestFavorite && (
                        <div className="guest-favorite-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            Guest favorite
                        </div>
                    )}
                </div>
                
                <div className="stay-info">
                    <h3 className="stay-title">{stay.name}</h3>
                    <p className="stay-dates">{formatDate(startDate)} - {formatDate(endDate)}</p>
                    <div className="stay-price-rating">
                        <span className="stay-price-bold">₪{totalPrice}</span> <span className="stay-price-normal">for {nights} night{nights > 1 ? 's' : ''}</span>
                        {stay.rating?.avg && (
                            <span className="stay-rating">
                                <span className="star">★</span>
                                {stay.rating.avg.toFixed(2)}
                            </span>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    )
}

StayPreview.propTypes = {
    stay: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        imgUrls: PropTypes.arrayOf(PropTypes.string),
        price: PropTypes.shape({
            base: PropTypes.number,
            currency: PropTypes.string
        }),
        loc: PropTypes.shape({
            city: PropTypes.string,
            country: PropTypes.string
        }),
        rating: PropTypes.shape({
            avg: PropTypes.number
        })
    }).isRequired
}
