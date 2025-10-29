import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../assets/styles/cmps/PhotoTour.css';

export function PhotoTour() {
  const { stayId } = useParams();
  const stay = useSelector(storeState => storeState.stayModule.stay);

  if (!stay) {
    return <div>Loading...</div>;
  }

  return (
    <div className="photo-tour">
      <div className="photo-tour-header">
        <Link to={`/stay/${stayId}`} className="back-link">
          &lt; Back
        </Link>
        <h1>Photo tour</h1>
      </div>
      <div className="photo-grid">
        {stay.imgUrls.map((url, index) => (
          <div key={index} className="photo-item">
            <img src={url} alt={`Stay image ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
