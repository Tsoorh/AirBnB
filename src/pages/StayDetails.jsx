import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loadStay } from '../store/actions/stay.actions'
import { ReviewList } from '../cmps/ReviewList'
import { ImageGallery } from '../cmps/ImageGallery'
import { BookingWidget } from '../cmps/BookingWidget'
import { AmenityIcon } from '../cmps/AmenityIcon'
import '../assets/styles/cmps/stay/StayDetails.css'

export function StayDetails() {
  const { stayId } = useParams()
  const stay = useSelector(storeState => storeState.stayModule.stay)
  const mapSectionRef = useRef(null)
  const reviewsSectionRef = useRef(null)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  useEffect(() => {
    loadStay(stayId)
  }, [stayId])

  if (!stay) {
    return <div className="stay-details-loading">Loading...</div>
  }

  const ratingAvg = stay.rating?.avg
  const ratingCount = stay.rating?.count
  const formattedRating = ratingAvg ? Number(ratingAvg).toFixed(2).replace(/\.0+$/, '').replace(/\.(\d)0$/, '.$1') : null
  const locationLabel = [stay.loc?.city, stay.loc?.country].filter(Boolean).join(', ')
  const capacityItems = [
    stay.capacity?.guests && `${stay.capacity.guests} ${stay.capacity.guests === 1 ? 'guest' : 'guests'}`,
    stay.capacity?.bedrooms && `${stay.capacity.bedrooms} ${stay.capacity.bedrooms === 1 ? 'bedroom' : 'bedrooms'}`,
    stay.capacity?.beds && `${stay.capacity.beds} ${stay.capacity.beds === 1 ? 'bed' : 'beds'}`,
    stay.capacity?.bathrooms && `${stay.capacity.bathrooms} ${stay.capacity.bathrooms === 1 ? 'bathroom' : 'bathrooms'}`
  ].filter(Boolean)
  const checkInWindow = stay.checkIn ? `${stay.checkIn.from} - ${stay.checkIn.to}` : null
  const checkOutTime = stay.checkOut?.by
  const hostAvatar = stay.host?.picture || (stay.host?.fullname ? `https://i.pravatar.cc/120?u=${encodeURIComponent(stay.host.fullname)}` : 'https://i.pravatar.cc/120')
  const amenitiesPreview = stay.amenities?.slice(0, 10) || []
  const hasMoreAmenities = (stay.amenities?.length || 0) > amenitiesPreview.length
  const descriptionPreview = stay.summary?.slice(0, 350)
  const shouldTruncateDescription = stay.summary && stay.summary.length > 350
  const displayedDescription = !shouldTruncateDescription || isDescriptionExpanded ? stay.summary : `${descriptionPreview}...`
  const houseRulesItems = stay.houseRules?.length ? stay.houseRules : ['Follow local community guidelines.']
  const safetyItems = [
    checkInWindow ? `Self check-in after ${stay.checkIn.from}` : null,
    checkOutTime ? `Checkout before ${checkOutTime}` : null,
    'Carbon monoxide alarm not reported',
    'Smoke alarm not reported'
  ].filter(Boolean)
  const cancellationItems = [
    stay.cancellationPolicy || 'Add your trip dates to get the cancellation details for this stay.'
  ]

  const handleShowMap = () => {
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleShowReviews = () => {
    reviewsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="stay-details">
      <header className="stay-details-header">
        <div className="header-main">
          <h1 className="stay-title">{stay.name}</h1>
        </div>

        <div className="header-actions">
          <button type="button" className="header-action-link">
            <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
            <span>Share</span>
          </button>
          <button type="button" className="header-action-link">
            <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
              <path d="M12 21.35 10.55 20C5.4 15.36 2 12.27 2 8.5 2 5.42 4.42 3 7.5 3A4.49 4.49 0 0 1 12 5.09 4.49 4.49 0 0 1 16.5 3C19.58 3 22 5.42 22 8.5c0 3.77-3.4 6.86-8.55 11.54Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span>Save</span>
          </button>
        </div>
      </header>

      <ImageGallery images={stay.imgUrls} alt={stay.name} stayId={stay._id} />

      <div className="stay-main-content">
        <div className="stay-details-content">
          <section className="stay-summary-intro">
            <h2 className="stay-summary-title">
              {`Entire ${stay.type ? stay.type.toLowerCase() : 'stay'}${locationLabel ? ` in ${locationLabel}` : ''}`.trim()}
            </h2>

            {capacityItems.length > 0 && (
              <div className="stay-summary-capacity">
                {capacityItems.map((item, idx) => (
                  <span key={item} className="summary-capacity-item">
                    {item}
                    {idx < capacityItems.length - 1 && <span className="summary-dot">{'\u00b7'}</span>}
                  </span>
                ))}
              </div>
            )}

            {formattedRating && (
              <div className="stay-summary-rating">
                <span className="summary-star" aria-hidden="true">{'\u2605'}</span>
                <span className="summary-rating-value">{formattedRating}</span>
                {ratingCount && (
                  <>
                    <span className="summary-dot">{'\u00b7'}</span>
                    <button type="button" onClick={handleShowReviews}>
                      {`${ratingCount} reviews`}
                    </button>
                  </>
                )}
              </div>
            )}
          </section>

          <div className="stay-content">
            <section className="stay-overview">
              <div className="overview-text">
                <h2>{stay.host ? `Hosted by ${stay.host.fullname}` : 'Hosted by Airbnb Host'}</h2>
                {stay.host?.isSuperhost && (
                  <span className="overview-superhost">Superhost</span>
                )}
              </div>

              {stay.host && (
                <div className="stay-host-card">
                  <div className="stay-host-avatar">
                    <img src={hostAvatar} alt={`Host ${stay.host.fullname}`} />
                  </div>
                  <div className="stay-host-text">
                    <span className="stay-host-name">{stay.host.fullname}</span>
                    {stay.host.isSuperhost && <span className="superhost-badge">Superhost</span>}
                  </div>
                </div>
              )}
            </section>

            {stay.labels?.length > 0 && (
              <section className="stay-highlights">
                {stay.labels.map(label => (
                  <div key={label} className="stay-highlight-item">
                    <div className="highlight-icon-circle" aria-hidden="true">{'\u2605'}</div>
                    <div className="highlight-copy">
                      <p className="highlight-title">{label}</p>
                      <p className="highlight-subtitle">Highly rated by recent guests.</p>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {stay.summary && (
              <section className="stay-description">
                <h3>About this place</h3>
                <p>{displayedDescription}</p>
                {shouldTruncateDescription && (
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => setIsDescriptionExpanded(prev => !prev)}
                  >
                    {isDescriptionExpanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </section>
            )}

            {stay.amenities?.length > 0 && (
              <section className="stay-amenities">
                <h3>What this place offers</h3>
                <div className="stay-amenities-grid">
                  {amenitiesPreview.map(amenity => (
                    <div key={amenity} className="stay-amenity">
                      <span className="amenity-icon" aria-hidden="true">
                        <AmenityIcon amenity={amenity} />
                      </span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
                {hasMoreAmenities && (
                  <button type="button" className="link-button">
                    Show all amenities
                  </button>
                )}
              </section>
            )}

            {(houseRulesItems.length || safetyItems.length || cancellationItems.length) > 0 && (
              <section className="stay-things-to-know">
                <h3>Things to know</h3>
                <div className="things-grid">
                  <div className="thing-column">
                    <h4>House rules</h4>
                    <ul>
                      {houseRulesItems.map(rule => (
                        <li key={rule}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="thing-column">
                    <h4>Safety & property</h4>
                    <ul>
                      {safetyItems.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="thing-column">
                    <h4>Cancellation policy</h4>
                    <ul>
                      {cancellationItems.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <button type="button" className="link-button link-button--inline">
                      Show more
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
        <aside className="stay-sidebar">
          <BookingWidget />
        </aside>
      </div>

      {stay.loc && (
        <section className="stay-location" ref={mapSectionRef}>
          <h2>Where you'll be</h2>
          <div className="stay-location-content">
            <div className="stay-location-text">
              <p className="location-address">{stay.loc.address}</p>
              {locationLabel && <p className="location-city">{locationLabel}</p>}
            </div>
            {stay.loc.lat && stay.loc.lng && (
              <div className="stay-map-container">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${stay.loc.lng - 0.01},${stay.loc.lat - 0.01},${stay.loc.lng + 0.01},${stay.loc.lat + 0.01}&layer=mapnik&marker=${stay.loc.lat},${stay.loc.lng}`}
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  title={`Map of ${stay.loc.address}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            )}
            <button type="button" className="link-button link-button--inline">
              Show more
            </button>
          </div>
        </section>
      )}

      <section className="stay-reviews" ref={reviewsSectionRef}>
        <div className="reviews-header">
          <h2>Guest reviews</h2>
          {formattedRating && ratingCount && (
            <div className="reviews-summary">
              <span className="reviews-star" aria-hidden="true">{'\u2605'}</span>
              <span>{formattedRating}</span>
              <span className="reviews-dot">{'\u00b7'}</span>
              <span>{ratingCount} reviews</span>
            </div>
          )}
        </div>
        {stay.reviews?.length ? (
          <ReviewList reviews={stay.reviews} />
        ) : (
          <p className="no-reviews">No reviews yet</p>
        )}
      </section>
    </div>
  )
}
