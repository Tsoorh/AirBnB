import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

export function ChooseDates({field,handleChange}) {
    const monthes = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  function onChangeDate(ev) {
    const { $D, $M, $y } = ev;
    const pickedDateFormatted = $D + " " + monthes[$M] + " " + $y;
    handleChange({field:field,value:pickedDateFormatted})
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar onChange={onChangeDate} />
    </LocalizationProvider>
  );
}
