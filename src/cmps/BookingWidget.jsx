import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import '../assets/styles/cmps/BookingWidget.css'
import { Link } from 'react-router-dom'
import { ChooseDates } from '../cmps/FilterCmps/ChooseDates.jsx'
import { GuestsPicker } from './FilterCmps/GuestsPicker.jsx'


export function BookingWidget() {
  const stay = useSelector(storeState => storeState.stayModule.stay)
  const [searchParams, setSearchParams] = useSearchParams()
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false)

  // Get dates from URL params or use empty string
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '')
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '')
  const [adults, setAdults] = useState(Number(searchParams.get('adults')) || 0)
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
  

    // Handle date change from calendar modal
    const handleDateChange = (field, value) => {
        const newParams = new URLSearchParams(searchParams)
        newParams.set(field, value)
        setSearchParams(newParams)
    }

    
    
    // Handle guest change from guests modal
    const handleGuestChange = (guestCounts) => {
        const newParams = new URLSearchParams(searchParams)
        newParams.set('adults', guestCounts.adults || 0)
        newParams.set('children', guestCounts.children || 0)
        newParams.set('infants', guestCounts.infants || 0)
        newParams.set('pets', guestCounts.pets || 0)
        setSearchParams(newParams)
    }

    // Clear dates without closing modal
    const handleClearDates = () => {
        setCheckIn('')
        setCheckOut('')
        const newParams = new URLSearchParams(searchParams)        
        newParams.delete('checkIn')
        newParams.delete('checkOut')
        setSearchParams(newParams)
    }

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
        <div className="date-picker" onClick={() => setIsCalendarModalOpen(true)}>
        <div className="check-in">
          <button className='booking-btn'>
            <label>CHECK-IN</label>
            <span>{checkIn ? checkIn : 'Add date'}</span>
          </button>
        </div>

        <div className="check-out">
          <button className='booking-btn'>
            <label>CHECKOUT</label>
            <span>{checkOut ? checkOut : 'Add date'}</span>
          </button>
        </div>
          {isCalendarModalOpen && (
            <>
              <div className="booking-modal-overlay" onClick={() =>  setIsCalendarModalOpen(false)}></div>
              <div className="booking-calendar-modal-content" onClick={(e) => e.stopPropagation()}>
                <ChooseDates
                    handleChange={handleDateChange}
                    onCloseModal={() => setIsCalendarModalOpen(false)}
                />
              </div>
            </>
          )}



        </div>

        <div className="guests-picker">
          <button
            className='booking-btn'
            onClick={() => setIsGuestsModalOpen(true)}>
            <label>GUESTS</label>
            <span>{adults + children} guests</span>
          </button>
          {isGuestsModalOpen && (
            <>
              <div className="booking-modal-overlay" onClick={() => setIsGuestsModalOpen(false)}></div>
              <div className="booking-modal-content" onClick={(e) => e.stopPropagation()}>
                <GuestsPicker
                    handleChange={handleGuestChange}
                    onCloseModal={() => setIsGuestsModalOpen(false)}
                />
                <button onClick={() => setIsGuestsModalOpen(false)}>Close</button>
              </div>
            </>
          )}
        </div>

        <Link to={`/stay/${stay._id}/order?${searchParams.toString()}`}>
          <button className="reserve-button">Reserve</button>
        </Link>

        <p className="no-charge-text">You won&apos;t be charged yet</p>
      </div>

      {/* Report Link */}
      <a href="#" className="report-listing-link">Report this listing</a>
    </div>
  )
}
