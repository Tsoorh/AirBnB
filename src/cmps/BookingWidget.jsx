import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import '../assets/styles/cmps/BookingWidget.css'
import { Link } from 'react-router-dom'

export function BookingWidget() {
  const stay = useSelector(storeState => storeState.stayModule.Stay)
  const [searchParams] = useSearchParams()

  // Get dates from URL params or use empty string
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '')
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '')
  const [adults, setAdults] = useState(Number(searchParams.get('adults')) || 1)
  const [children, setChildren] = useState(Number(searchParams.get('children')) || 0)

  // Update state when URL params change
  useEffect(() => {
    const urlCheckIn = searchParams.get('checkIn')
    const urlCheckOut = searchParams.get('checkOut')
    const urlAdults = searchParams.get('adults')
    const urlChildren = searchParams.get('children')

    if (urlCheckIn) setCheckIn(urlCheckIn)
    if (urlCheckOut) setCheckOut(urlCheckOut)
    if (urlAdults) setAdults(Number(urlAdults))
    if (urlChildren) setChildren(Number(urlChildren))
  }, [searchParams])
  

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
            <input
              type="date"
              placeholder="Add dates"
              value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
            />
          </div>
          <div className="check-out">
            <label>CHECKOUT</label>
            <input
              type="date"
              placeholder="Add dates"
              value={checkOut}
              onChange={e => setCheckOut(e.target.value)}
            />
          </div>
        </div>

        <div className="guests-picker">
          <label>GUESTS</label>
          <select
            value={adults + children}
            onChange={e => setAdults(Number(e.target.value))}
          >
            <option value={1}>1 guest</option>
            <option value={2}>2 guests</option>
            <option value={3}>3 guests</option>
            <option value={4}>4 guests</option>
            <option value={5}>5+ guests</option>
          </select>
        </div>

        <Link to={`/Stay/${stay._id}/order?${searchParams.toString()}`}>
          <button className="reserve-button">Reserve</button>
        </Link>

        <p className="no-charge-text">You won&apos;t be charged yet</p>
      </div>

      {/* Report Link */}
      <a href="#" className="report-listing-link">Report this listing</a>
    </div>
  )
}
