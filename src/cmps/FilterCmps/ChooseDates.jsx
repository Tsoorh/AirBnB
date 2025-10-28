import PropTypes from 'prop-types'
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useEffect, useRef } from "react";


export function ChooseDates({ handleChange, onCloseModal }) {
    const wrapperRef = useRef(null);

    // Close on outside click
    useEffect(() => {
      function onDocClick(e) {
        if (!wrapperRef.current) return;
        if (!wrapperRef.current.contains(e.target)) onCloseModal?.();
      }
      document.addEventListener("mousedown", onDocClick);
      return () => document.removeEventListener("mousedown", onDocClick);
    }, [onCloseModal]);
  

  function onChangeDate(ev, field) {
    const { $D, $M, $y } = ev;

    // Format as YYYY-MM-DD (e.g., "2025-10-22")
    const year = $y;
    const month = String($M + 1).padStart(2, '0'); // $M is 0-indexed
    const day = String($D).padStart(2, '0');

    const pickedDateFormatted = `${year}-${month}-${day}`;
    handleChange(field, pickedDateFormatted);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex justify-center align-center modal-calendar-container" ref={wrapperRef}>
        <div className="calendar-container">
        {/* <span>Check in</span> */}
        <DateCalendar  onChange={(ev)=>onChangeDate(ev,"checkIn")} />
        </div>
        <div className="calendar-container">
        {/* <span>Check out</span> */}
        <DateCalendar  onChange={(ev)=>onChangeDate(ev,"checkOut")}/>
        </div>
      </div>
      <div className='choose-dates-btns'>
        <p>Clear dates</p>
        <button onClick={onCloseModal}>Close</button>   
      </div>

    </LocalizationProvider>
  );
}

ChooseDates.propTypes = {
  handleChange: PropTypes.func.isRequired
}
