import PropTypes from 'prop-types'
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

export function ChooseDates({ handleChange }) {
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
      <div className="flex justify-center align-center modal-calendar-container">
        <div className="calendar-container">
        <span>Check in</span>
        <DateCalendar  onChange={(ev)=>onChangeDate(ev,"checkIn")} />
        </div>
        <div className="calendar-container">
        <span>Check out</span>
        <DateCalendar  onChange={(ev)=>onChangeDate(ev,"checkOut")}/>
        </div>
      </div>
    </LocalizationProvider>
  );
}

ChooseDates.propTypes = {
  handleChange: PropTypes.func.isRequired
}
