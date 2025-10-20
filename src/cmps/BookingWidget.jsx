import React from 'react'
import { useSelector } from 'react-redux'
import '../assets/styles/cmps/BookingWidget.css'
import { Link } from 'react-router-dom'

export function BookingWidget() {
  const stay = useSelector(storeState => storeState.stayModule.Stay)

  // Show loading state if stay is not loaded yet
  if (!stay) {
    return (
      <div className="booking-widget">
        <div className="booking-widget-loading">Loading...</div>
      </div>
    )
  }

  return (
    <div className="booking-widget">
      {/* Discount Banner */}
      <div className="discount-banner">
        This host is offering a discount
      </div>

      {/* Price Section */}
      <div className="price-section">
        <div className="price-display">
          <span className="price-amount">₪{stay.price?.base}</span>
          <span className="price-period">per night</span>
        </div>
        {stay.rating && (
          <div className="widget-rating">
            <span className="rating-stars">★</span>
            <span className="rating-number">{stay.rating.avg}</span>
            <span className="rating-count">({stay.rating.count})</span>
          </div>
        )}
      </div>

      {/* Booking Form */}
      <div className="booking-form">
        <div className="date-picker">
          <div className="check-in">
            <label>CHECK-IN</label>
            <input type="date" placeholder="Add dates" />
          </div>
          <div className="check-out">
            <label>CHECKOUT</label>
            <input type="date" placeholder="Add dates" />
          </div>
        </div>

        <div className="guests-picker">
          <label>GUESTS</label>
          <select>
            <option>1 guest</option>
            <option>2 guests</option>
            <option>3 guests</option>
            <option>4 guests</option>
            <option>5+ guests</option>
          </select>
        </div>

        <Link to={`/Stay/${stay._id}/order`}><button className="reserve-button">Reserve</button></Link>

        {/* <button className="reserve-button">Reserve</button> */}

        <p className="no-charge-text">You won't be charged yet</p>
      </div>

      {/* Report Link */}
      <a href="#" className="report-listing-link">Report this listing</a>
    </div>
  )
}
