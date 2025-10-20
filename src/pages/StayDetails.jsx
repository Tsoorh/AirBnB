import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loadStay } from '../store/actions/stay.actions'
import { ReviewList } from '../cmps/ReviewList'
import { ImageGallery } from '../cmps/ImageGallery'
import { BookingWidget } from '../cmps/BookingWidget'
import '../assets/styles/cmps/stay/StayDetails.css'

export function StayDetails() {
  const { stayId } = useParams()
  const stay = useSelector(storeState => storeState.stayModule.Stay)

  useEffect(() => {
    loadStay(stayId)
  }, [stayId])
  

  if (!stay) {
    return <div className="stay-details-loading">Loading...</div>
  }

  return (
    <div className="stay-details">
      {/* Header with back button */}
      <div className="stay-details-header">
        <Link to="/Stay" className="back-button">← Back to stays</Link>
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
          {/* Title and Basic Info - Narrow */}
          <div className="section-narrow">
            <h1 className="stay-title">{stay.name}</h1>
            
            <div className="stay-location">
              <span className="location-text">{stay.loc?.city}, {stay.loc?.country}</span>
              {stay.rating && (
                <div className="rating-display">
                  <span className="rating-stars">★</span>
                  <span className="rating-number">{stay.rating.avg}</span>
                  <span className="rating-count">({stay.rating.count} reviews)</span>
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

            {/* Stay Details Info */}
            <div className="stay-details-info">
              <div className="stay-type-capacity">
                {stay.type && (
                  <div className="stay-type">
                    <span className="type-label">{stay.type}</span>
                  </div>
                )}
                
                {stay.capacity && (
                  <div className="capacity-info">
                    {stay.capacity.guests && (
                      <div className="capacity-item">
                        <span className="capacity-number">{stay.capacity.guests}</span>
                        <span className="capacity-label">
                          {stay.capacity.guests === 1 ? 'guest' : 'guests'}
                        </span>
                      </div>
                    )}
                    
                    {stay.capacity.bedrooms && (
                      <div className="capacity-item">
                        <span className="capacity-number">{stay.capacity.bedrooms}</span>
                        <span className="capacity-label">
                          {stay.capacity.bedrooms === 1 ? 'bedroom' : 'bedrooms'}
                        </span>
                      </div>
                    )}
                    
                    {stay.capacity.beds && (
                      <div className="capacity-item">
                        <span className="capacity-number">{stay.capacity.beds}</span>
                        <span className="capacity-label">
                          {stay.capacity.beds === 1 ? 'bed' : 'beds'}
                        </span>
                      </div>
                    )}
                    
                    {stay.capacity.bathrooms && (
                      <div className="capacity-item">
                        <span className="capacity-number">{stay.capacity.bathrooms}</span>
                        <span className="capacity-label">
                          {stay.capacity.bathrooms === 1 ? 'bathroom' : 'bathrooms'}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

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