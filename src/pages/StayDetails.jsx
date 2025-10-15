import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loadStay } from '../store/actions/stay.actions'
import { ReviewList } from '../cmps/ReviewList'
import '../assets/styles/cmps/stay/StayDetails.css'

export function StayDetails() {
  const { stayId } = useParams()
  const stay = useSelector(storeState => storeState.stayModule.Stay)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    loadStay(stayId)
  }, [stayId])

  if (!stay) {
    return <div className="stay-details-loading">Loading...</div>
  }

  const handleImageChange = (index) => {
    setCurrentImageIndex(index)
  }

  return (
    <div className="stay-details">
      {/* Header with back button */}
      <div className="stay-details-header">
        <Link to="/Stay" className="back-button">← Back to stays</Link>
      </div>

      {/* Image Gallery */}
      <div className="stay-gallery">
        <div className="main-image">
          <img 
            src={stay.imgUrls?.[currentImageIndex] || '/img/sunflowers.jpg'} 
            alt={stay.name}
          />
          {stay.imgUrls && stay.imgUrls.length > 1 && (
            <div className="image-thumbnails">
              {stay.imgUrls.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`${stay.name} ${index + 1}`}
                  className={index === currentImageIndex ? 'active' : ''}
                  onClick={() => handleImageChange(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="stay-content">
        <div className="stay-main-info">
          <h1 className="stay-title">{stay.name}</h1>
          
          <div className="stay-location">
            <span className="location-text">{stay.loc?.city}, {stay.loc?.country}</span>
          </div>

          {/* Summary */}
          {stay.summary && (
            <div className="stay-summary">
              <h3>About this place</h3>
              <p>{stay.summary}</p>
            </div>
          )}
        </div>

        {/* Reviews Section */}
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