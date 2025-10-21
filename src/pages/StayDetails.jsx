import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loadStay } from '../store/actions/stay.actions'
import { ReviewList } from '../cmps/ReviewList'
import { ImageGallery } from '../cmps/ImageGallery'
import { BookingWidget } from '../cmps/BookingWidget'
import '../assets/styles/cmps/stay/StayDetails.css'

export function StayDetails() {
  const { stayId } = useParams()
  const stay = useSelector(storeState => storeState.stayModule.stay)

  useEffect(() => {
    loadStay(stayId)
  }, [stayId])
  

  if (!stay) {
    return <div className="stay-details-loading">Loading...</div>
  }

  return (
    <div className="stay-details">
      {/* Title above gallery (Airbnb style) */}
      <h1 className="stay-title page-title">{stay.name}</h1>

      {/* Share and Save Buttons */}
      <div className="share-save-buttons">
        <button className="share-button">
          <svg className="share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16,6 12,2 8,6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
          <span className="button-text">Share</span>
        </button>
        <button className="save-button">
          <svg className="save-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span className="button-text">Save</span>
        </button>
      </div>

      {/* Image Gallery */}
      <ImageGallery 
        images={stay.imgUrls} 
        alt={stay.name}
      />

      {/* Main Content */}
      <div className="stay-main-layout">
        {/* Content Sections (Left Column) */}
        <div className="content-sections">
          {/* Basic Info - Narrow */}
          <div className="section-narrow">
            
            <div className="stay-info-header">
              <h2 className="stay-type-title">{stay.type} in {stay.loc?.city}, {stay.loc?.country}</h2>
              
              <div className="stay-capacity-summary">
                {stay.capacity?.guests && (
                  <span className="capacity-item">{stay.capacity.guests} {stay.capacity.guests === 1 ? 'guest' : 'guests'}</span>
                )}
                {stay.capacity?.bedrooms && (
                  <span className="capacity-item">{stay.capacity.bedrooms} {stay.capacity.bedrooms === 1 ? 'bedroom' : 'bedrooms'}</span>
                )}
                {stay.capacity?.beds && (
                  <span className="capacity-item">{stay.capacity.beds} {stay.capacity.beds === 1 ? 'bed' : 'beds'}</span>
                )}
                {stay.capacity?.bathrooms && (
                  <span className="capacity-item">{stay.capacity.bathrooms} {stay.capacity.bathrooms === 1 ? 'bathroom' : 'bathrooms'}</span>
                )}
              </div>

              {stay.rating && (
                <div className="rating-summary">
                  <span className="rating-star">★</span>
                  <span className="rating-number">{stay.rating.avg}</span>
                  <span className="rating-separator">·</span>
                  <span className="rating-count">{stay.rating.count} reviews</span>
                </div>
              )}
            </div>

            {/* Host Info */}
            {stay.host && (
              <div className="host-info">
                <div className="host-avatar">
                  <img 
                    src={stay.host.picture || '/img/sunflowers.jpg'} 
                    alt={stay.host.fullname}
                  />
                </div>
                <div className="host-details">
                  <h3>Meet your host, {stay.host.fullname}</h3>
                  {stay.host.isSuperhost && (
                    <span className="superhost-badge">Superhost</span>
                  )}
                </div>
              </div>
            )}


            {/* Summary */}
            {stay.summary && (
              <div className="stay-summary">
                <h3>About this place</h3>
                <p>{stay.summary}</p>
              </div>
            )}

            {/* Amenities - Narrow */}
            {stay.amenities && stay.amenities.length > 0 && (
              <div className="amenities-section">
                <h3>What this place offers</h3>
                <div className="amenities-grid">
                  {stay.amenities.map((amenity, index) => (
                    <div key={index} className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* House Rules - Narrow */}
            {(stay.houseRules && stay.houseRules.length > 0) || stay.checkIn || stay.checkOut ? (
              <div className="house-rules-section">
                <h3>House rules</h3>
                
                {stay.houseRules && stay.houseRules.length > 0 && (
                  <div className="house-rules-list">
                    {stay.houseRules.map((rule, index) => (
                      <div key={index} className="house-rule-item">
                        <span className="rule-icon">•</span>
                        <span className="rule-text">{rule}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="check-in-out-times">
                  {stay.checkIn && (
                    <div className="time-info">
                      <span className="time-label">Check-in:</span>
                      <span className="time-value">{stay.checkIn.from} - {stay.checkIn.to}</span>
                    </div>
                  )}
                  
                  {stay.checkOut && (
                    <div className="time-info">
                      <span className="time-label">Check-out:</span>
                      <span className="time-value">{stay.checkOut.by}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Booking Widget (Right Column) */}
        <BookingWidget />
      </div>

      {/* Location Details - Wide (moved outside main layout) */}
      {stay.loc && (
        <div className="section-wide">
          <div className="location-details-section">
            <h3>Where you'll be</h3>
            <div className="location-info">
              <div className="address-info">
                <p className="full-address">{stay.loc.address}</p>
                <p className="city-country">{stay.loc.city}, {stay.loc.country}</p>
              </div>
              
              {stay.loc.lat && stay.loc.lng && (
                <div className="map-container">
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${stay.loc.lng-0.01},${stay.loc.lat-0.01},${stay.loc.lng+0.01},${stay.loc.lat+0.01}&layer=mapnik&marker=${stay.loc.lat},${stay.loc.lng}`}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    title={`Map of ${stay.loc.address}`}
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section - Wide */}
      <div className="section-wide">
        <div className="reviews-section">
          <h2>Guest Reviews</h2>
          {stay.reviews && stay.reviews.length > 0 ? (
            <ReviewList reviews={stay.reviews} />
          ) : (
            <p className="no-reviews">No reviews yet</p>
          )}
        </div>
      </div>
    </div>
  )
}