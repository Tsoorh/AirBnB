import { ChildCare } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getDefaultFilter } from "../../services/stay";

export function GuestsPicker({ handleChange }) {
  const [counters, setCounters] = useState(getEssentialFilter);

  useEffect(() => {
    handleChange("guests", counters);
  }, [counters]);

  const guestsDetails = [
    {
      title: "Adults",
      subtitle: "Ages 13 or above",
      counterName: "adults",
    },
    {
      title: "Children",
      subtitle: "Ages 2-12",
      counterName: "children",
    },
    {
      title: "Infants",
      subtitle: "Under 2",
      counterName: "infants",
    },
    {
      title: "Pets",
      subtitle: <a>Bringing a service animal?</a>,
      counterName: "pets",
    },
  ];

  function getEssentialFilter(){
    const fullFilter = getDefaultFilter();
    const essentialPickerFilter = {... fullFilter.guests}
    return essentialPickerFilter
  }

  function onHandleChange({ target }) {
    const { innerText, name } = target;
    switch (innerText) {
      case "+":
        setCounters((prevCounters) => ({
          ...prevCounters,
          [name]: prevCounters[name] + 1,
        }));
        break;
      case "-":
        setCounters((prevCounters) => ({
          ...prevCounters,
          [name]: prevCounters[name] + -1,
        }));
    }
  }

  return (
    <ul className="guest-picker-container">
      {guestsDetails.map((Details, idx) => {
        return (
          <li
            className="flex align-center space-between"
            key={Details.title + idx}
          >
            <div className="flex column space-between">
              <p>{Details.title}</p>
              <span className="light-color">{Details.subtitle}</span>
            </div>
            <div className="flex align-center">
              {counters[Details.counterName] > 0 ? (
                <button
                  className="btn-round"
                  name={Details.counterName}
                  onClick={onHandleChange}
                >
                  -
                </button>
              ) : (
                <button className="btn-round" disabled>
                  -
                </button>
              )}
              <span>{counters[Details.counterName]}</span>
              <button
                className="btn-round"
                name={Details.counterName}
                onClick={onHandleChange}
              >
                +
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
