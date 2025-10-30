import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import { useState } from "react";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

export function MobileDates({ handleChange, onCloseModal }) {
  const [selected, setSelected] = useState(null);
  const wrapperRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();


useEffect(()=>{
    selected&&onChangeDate(selected)
},[selected])
  // Close on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) onCloseModal?.();
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [onCloseModal]);

  function onChangeDate(date) {
    const formattedDate = { to: null, from: null };
    console.log("🚀 ~ onChangeDate ~ date:", date)
    if (date.from) {
      formattedDate.from = getFormattedDate(date.from.toLocaleDateString("he"));
      handleChange( "checkIn",formattedDate.from);
    }
    if (date.to) {
      formattedDate.to = getFormattedDate(date.to.toLocaleDateString("he"));
      handleChange("checkOut",formattedDate.to);
    }
  }

  function getFormattedDate(date) {
    return date.replaceAll(".", "-");
  }
  //   function onChangeDate(ev, field) {
  //     const { $D, $M, $y } = ev;

  //     // Format as YYYY-MM-DD (e.g., "2025-10-22")
  //     const year = $y;
  //     const month = String($M + 1).padStart(2, "0"); // $M is 0-indexed
  //     const day = String($D).padStart(2, "0");

  //     const pickedDateFormatted = `${year}-${month}-${day}`;
  //     handleChange(field, pickedDateFormatted);
  //   }

    const handleClearDates = () => {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("checkIn");
      newParams.delete("checkOut");
      setSearchParams(newParams);
    };

  return (
    <div className="modal-calendar-container" ref={wrapperRef}>
      <div className="flex justify-center">
        <DayPicker
          animate
          mode="range"
          selected={selected}
          onSelect={setSelected}
          footer={
            selected
              ? `Selected: ${
                  selected.from!==null && selected.from.toLocaleDateString("he")
                } - ${selected.to && selected.to.toLocaleDateString("he")}`
              : "Pick a range"
          }
        />
      </div>
    </div>
  );
}

// ChooseDates.propTypes = {
//   handleChange: PropTypes.func.isRequired
// }
