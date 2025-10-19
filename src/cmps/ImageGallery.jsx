import { useState } from 'react'
import '../assets/styles/cmps/ImageGallery.css'

export function ImageGallery({ images, alt }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handlePrevious = () => {
    setCurrentImageIndex(Math.max(0, currentImageIndex - 1))
  }

  const handleNext = () => {
    setCurrentImageIndex(Math.min(images.length - 1, currentImageIndex + 1))
  }

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index)
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

  return (
    <div className="image-gallery">
      <div className="main-image-container">
        <img 
          src={images[currentImageIndex]} 
          alt={alt || `Image ${currentImageIndex + 1}`}
          className="main-image"
        />
        {images.length > 1 && (
          <div className="image-navigation">
            <button 
              className="nav-button prev-button"
              onClick={handlePrevious}
              disabled={currentImageIndex === 0}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button 
              className="nav-button next-button"
              onClick={handleNext}
              disabled={currentImageIndex === images.length - 1}
              aria-label="Next image"
            >
              ›
            </button>
          </div>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="image-thumbnails">
          {images.map((imageUrl, index) => (
            <img
              key={index}
              src={imageUrl}
              alt={`${alt || 'Image'} ${index + 1}`}
              className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => handleThumbnailClick(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
