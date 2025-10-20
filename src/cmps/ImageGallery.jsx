import { useState } from 'react'
import '../assets/styles/cmps/ImageGallery.css'

export function ImageGallery({ images, alt }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showAllPhotos, setShowAllPhotos] = useState(false)

  const handleImageClick = (index) => {
    setCurrentImageIndex(index)
  }

  const handleShowAllPhotos = () => {
    setShowAllPhotos(true)
  }

  if (!images || images.length === 0) {
    return (
      <div className="image-gallery">
        <div className="main-image-container">
          <img 
            src="/img/sunflowers.jpg" 
            alt={alt || "No image available"}
            className="main-image"
          />
        </div>
      </div>
    )
  }

  // Show modal with all photos
  if (showAllPhotos) {
    return (
      <div className="image-gallery-modal" onClick={() => setShowAllPhotos(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>All Photos</h2>
            <button 
              className="close-button"
              onClick={() => setShowAllPhotos(false)}
            >
              ×
            </button>
          </div>
          <div className="modal-images">
            {images.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`${alt || 'Image'} ${index + 1}`}
                className="modal-image"
                onClick={() => handleImageClick(index)}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Show first 5 images in Airbnb-style layout
  const displayImages = images.slice(0, 5)
  const remainingCount = images.length - 5

  return (
    <div className="image-gallery">
      <div className="gallery-grid">
        {/* Main large image */}
        <div 
          className="main-image-container"
          onClick={() => handleImageClick(0)}
        >
          <img 
            src={images[0]} 
            alt={alt || `Image 1`}
            className="main-image"
          />
        </div>
        
        {/* 4 smaller images - always show 4 images */}
        <div className="small-images-grid">
          {Array.from({ length: 4 }, (_, index) => {
            const imageIndex = index + 1
            const imageUrl = images[imageIndex] || images[0] // fallback to first image if not enough images
            
            return (
              <div 
                key={imageIndex}
                className="small-image-container"
                onClick={() => handleImageClick(imageIndex)}
              >
                <img
                  src={imageUrl}
                  alt={`${alt || 'Image'} ${imageIndex + 1}`}
                  className="small-image"
                />
                {/* Show "Show all photos" button on the last small image */}
                {index === 3 && remainingCount > 0 && (
                  <button 
                    className="show-all-photos-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShowAllPhotos()
                    }}
                  >
                    <span className="grid-icon">⊞</span>
                    Show all photos
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
