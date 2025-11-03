import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { RangeCalendar, Provider, defaultTheme } from "@adobe/react-spectrum";
import { I18nProvider } from "react-aria";

export function RangeCalendarPicker({ handleChange, onCloseModal }) {
  const wrapperRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Close on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) onCloseModal?.();
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [onCloseModal]);

  function onChangeDate(ev) {
    console.log("🚀 ~ onChangeDate ~ ev:", ev)
  }

  const handleClearDates = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("checkIn");
    newParams.delete("checkOut");
    setSearchParams(newParams);
  };

  return (
    <Provider theme={defaultTheme} colorScheme="light">
      <div className="modal-calendar-container " ref={wrapperRef}>
        <div className="flex justify-center">
          <I18nProvider locale="en-US">
            <RangeCalendar
              aria-label="Trip dates"
              visibleMonths={2}
              start={onChangeDate}
              end={onChangeDate}
              // onChange={onChangeDate}
            />
          </I18nProvider>
        </div>
        <div className="choose-dates-btns">
          <p onClick={handleClearDates}>Clear dates</p>
          <button onClick={onCloseModal}>Close</button>
        </div>
      </div>
    </Provider>
  );
}

RangeCalendarPicker.propTypes = {
  handleChange: PropTypes.func.isRequired,
};
