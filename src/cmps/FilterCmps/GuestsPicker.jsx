import { ChildCare } from "@mui/icons-material";
import { useState } from "react";

export function GuestsPicker() {
  const [counters, setCounters] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const guestsDetails = [
    {
      title: "Adults",
      subtitle: "Ages 13 or above",
      counterName:"adults"
    },
    {
      title: "Children",
      subtitle: "Ages 2-12",
      counterName:"children"
    },
    {
      title: "Infants",
      subtitle: "Under 2",
      counterName:"infants"
    },
    {
        title:"Pets",
        subtitle:<a>Bringing a service animal?</a>,
        counterName:"pets"
    }
  ];

  return (
    <ul className="guest-picker-container">
      {guestsDetails.map((Details) => {
        return (
          <li className="flex align-center space-between">
            <div className="flex column space-between">
              <p>{Details.title}</p>
              <span className="light-color">{Details.subtitle}</span>
            </div>
            <div className="flex align-center">
              <button className="btn-round">-</button>
              <span>{counters[Details.counterName]}</span>
              <button className="btn-round">+</button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
