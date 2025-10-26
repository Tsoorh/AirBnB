import { useState, useEffect } from "react";
import { DynamicModalCmp } from "./FilterCmps/DynamicModalCmp";
import SearchIcon from "@mui/icons-material/Search";
import { useWindowSize } from "../customHooks/useWindowSize";
import { getDefaultFilter } from "../services/stay";
import { useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { SearchDestination } from "./FilterCmps/SearchDestination";
import { ChooseDates } from "./FilterCmps/ChooseDates";
import { GuestsPicker } from "./FilterCmps/GuestsPicker";
import { useNavigate } from 'react-router'


export function StayFilter({ isOnViewPort }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileFilterSelection, setMobileFilterSelection] = useState({
    destination: true,
    checkIn: false,
    guest: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModalContent, SetCurrentModalContent] = useState(null);
  const [filter, setFilter] = useState(getDefaultFilter);
  const [searchParams, setSearchParams] = useSearchParams({ ...filter });
  const location = useLocation();
  const { width } = useWindowSize();
  const navigate = useNavigate()


  const filterConfigs = [
    {
      name: "destination",
      Label: "Where",
      Placeholder: filter.city || "I'm flexible",
      Component: SearchDestination,
      propHandler: handleCityChange,
      selectionState: mobileFilterSelection.destination,
    },
    {
      name: "checkIn",
      Label: "When",
      Placeholder:
        (filter.dates.checkIn && filter.dates.checkIn + "-") ||
        (filter.dates.checkIn &&
          filter.dates.checkOutfilter.dates.checkIn +
            "-" +
            filter.dates.checkOut) ||
        "Add dates",
      Component: ChooseDates,
      propHandler: handleDateChange,
      selectionState: mobileFilterSelection.checkIn,
    },
    {
      name: "guest",
      Label: "Who",
      Placeholder: handleGuests(),
      Component: GuestsPicker,
      propHandler: handleGuestsChange,
      selectionState: mobileFilterSelection.guest,
    },
  ];

  useEffect(() => {
    setIsFilterOpen(false);
    setIsModalOpen(false);
    SetCurrentModalContent(null);

    // const el = document.querySelector(".stay-filter");
    // if (el) el.classList.remove("active");
  }, [location.pathname]);

  useEffect(() => {
    setSearchParams({ ...refactorFilter(filter) });
    console.log('filter: ', filter);
  }, [filter]);

  useEffect(() => {
    if (isOnViewPort && width > 745) {
      setIsFilterOpen(true);
    } else {
      setIsFilterOpen(false);
    }
  }, [isOnViewPort]);

  useEffect(()=>{
    if( width > 754 ) setMobileFilterOpen(false)
  },[width])

  function refactorFilter(filterObj) {
    let flatObj = {};
    for (const key in filterObj) {
      if (typeof filterObj[key] === "object" && filterObj[key] !== null) {
        for (const nestedKey in filterObj[key]) {
          flatObj = { ...flatObj, [nestedKey]: filterObj[key][nestedKey] };
        }
      } else {
        flatObj = { ...flatObj, [key]: filterObj[key] };
      }
    }
    return flatObj;
  }

  const buttonDetails = [
    {
      name: "checkIn",
      span: "Check in",
      placeholder: filter.dates.checkIn || "Add dates",
    },
    {
      name: "checkOut",
      span: "Check out",
      placeholder: filter.dates.checkOut || "Add dates",
    },
  ];

  function onHandleOpenFilter(ev) {
    setIsFilterOpen(true);
    onHandleClick(ev);
  }

  function onHandleClick({ currentTarget }) {
    const filterContainer = document.querySelector(".stay-filter");
    filterContainer.classList.add("active");
    const allButtons = document.querySelectorAll(".filter-btn");
    allButtons.forEach((btn) => {
      btn.classList.remove("active");
    });
    currentTarget.classList.add("active");

    const { name } = currentTarget;
    SetCurrentModalContent(name);
    setIsModalOpen(true);
  }

  function onCloseModal() {
    SetCurrentModalContent(null);
    setIsModalOpen(false);
  }

  function onSearchClick(ev) {
    // Stop event from bubbling to parent button
    ev.stopPropagation();
    ev.preventDefault();

    // Close all modals
    SetCurrentModalContent(null);
    setIsModalOpen(false);

    // Apply the filter (if setFilterBy is provided as prop)
    if (setFilter) {
      setFilter(filter);
    }
    // Update URL search params (this will trigger filtering in parent component)
    setSearchParams({ ...refactorFilter(filter) });
    // Remove active class from filter container
    const filterContainer = document.querySelector(".stay-filter");
    if (filterContainer) {
      filterContainer.classList.remove("active");
    }
    navigate(`/search?${searchParams}`)

  }

  function classModalOpen() {
    if (isModalOpen) return "open";
    else return "";
  }

  // function handleChange(field, value) {
  //   switch (field) {
  //     case "city":
  //       setFilter((prevFilter) => ({
  //         ...prevFilter,
  //         city: value,
  //       }));
  //       break;
  //     case "guests":
  //       setFilter((prevFilter) => ({
  //         ...prevFilter,
  //         guests: { ...value },
  //       }));
  //       break;
  //     case "checkIn":
  //       setFilter((prevFilter) => ({
  //         ...prevFilter,
  //         dates: {
  //           ...prevFilter.dates,
  //           checkIn: value,
  //         },
  //       }));
  //       break;
  //     case "checkOut":
  //       setFilter((prevFilter) => ({
  //         ...prevFilter,
  //         dates: {
  //           ...prevFilter.dates,
  //           checkOut: value,
  //         },
  //       }));
  //       break;
  //   }
  // }

  function handleCityChange(city) {
    setFilter((prev) => ({ ...prev, city }));
  }

  function handleGuestsChange(guests) {
    setFilter((prev) => ({ ...prev, guests }));
  }

  function handleDateChange(field, date) {
    setFilter((prev) => ({
      ...prev,
      dates: { ...prev.dates, [field]: date },
    }));
  }

  function handleGuests() {
    if (!filter.guests) return "add guests";

    const guestsEntries = Object.entries(filter.guests)
      .filter(([_, value]) => value > 0)
      .map(([key, value]) => `${key}: ${value}`);

    return guestsEntries.length > 0 ? guestsEntries.join(", ") : "add guests";
  }

  function onResetFilter() {
    setFilter(getDefaultFilter());
  }

  function handleMobileFilterClick({ target }) {
    const { name } = target;
    setMobileFilterSelection({
      destination: false,
      checkIn: false,
      guests: false,
      [name]: true,
    });
  }

  if (mobileFilterOpen) {
    return (
      <ul className="mobile-filter">
        <button
          className="x-btn shadow"
          onClick={() => setMobileFilterOpen(false)}
        >
          x
        </button>
        {filterConfigs.map((config) => (
          <li key={config.name}>
            {config.selectionState ? (
              <config.Component
                handleChange={config.propHandler}
                isOpen={currentModalContent === config.name}
                onCloseModal={onCloseModal}
              />
            ) : (
              <button
                className="filter-btn flex shadow"
                name={config.name}
                onClick={handleMobileFilterClick}
              >
                <span>{config.Label}</span>
                <span>{config.Placeholder}</span>
              </button>
            )}
          </li>
        ))}
        {/* <li>
          {mobileFilterSelection.destination ? (
            <SearchDestination
              handleChange={handleCityChange}
              isOpen={currentModalContent === "destination"}
              onCloseModal={onCloseModal}
            />
          ) : (
            <button
              className="filter-btn flex shadow"
              name="destination"
              onClick={handleMobileFilterClick}
            >
              <span>Where</span>
              <span>{filter.city || "I'm flexible"}</span>
            </button>
          )}
        </li>
        <li>
          {mobileFilterSelection.checkIn ? (
            <ChooseDates
              handleChange={handleDateChange}
              isOpen={currentModalContent === "checkIn"}
              onCloseModal={onCloseModal}
            />
          ) : (
            <button
              className="filter-btn flex shadow"
              name="checkIn"
              onClick={handleMobileFilterClick}
            >
              <span>When</span>
              <span>{"Add dates"}</span>
            </button>
          )}
        </li>
        <li>
          {mobileFilterSelection.guest ? (
            <GuestsPicker
              handleChange={handleGuestsChange}
              isOpen={currentModalContent === "guest"}
              onCloseModal={onCloseModal}
            />
          ) : (
            <button
              className="filter-btn flex shadow"
              name="guest"
              onClick={handleMobileFilterClick}
            >
              <span>Who</span>
              <span>{handleGuests()}</span>
            </button>
          )}
        </li>*/}
        <li>
          <a onClick={onResetFilter}>Clear all</a>
          <button onClick={onSearchClick}>Search</button>
        </li>
      </ul>
    );
  } else if (isFilterOpen) {
    return (
      <section className="stay-filter shadow open">
        <button
          className="filter-btn flex column"
          name="destination"
          onClick={onHandleClick}
        >
          <span>Where</span>
          <input
            type="text"
            placeholder="Search destinations"
            value={filter.city}
            onChange={handleCityChange}
          />
        </button>
        {buttonDetails.map((btn) => {
          return (
            <button
              key={btn.name}
              className="filter-btn flex column"
              name={btn.name}
              onClick={onHandleClick}
            >
              <span>{btn.span}</span>
              <span className="light-color">{btn.placeholder}</span>
            </button>
          );
        })}
        <button
          className="filter-btn flex column"
          name="guest"
          onClick={onHandleClick}
        >
          <span>Who</span>
          <span className="light-color">{handleGuests()}</span>
        </button>
        <button
          className={`search-btn ${classModalOpen()}`}
          onClick={onSearchClick}
        >
          <SearchIcon />
          <span className="search-text">Search</span>
        </button>

        {isModalOpen && (
          <DynamicModalCmp
            currentModalContent={currentModalContent}
            handleCityChange={handleCityChange}
            handleGuestsChange={handleGuestsChange}
            handleDateChange={handleDateChange}
            onCloseModal={onCloseModal}
          />
        )}
      </section>
    );
  } else {
    return (
      <section className="stay-filter shadow">
        <input
          type="text"
          className="mobile-only-item search-mobile "
          placeholder="Start your search"
          onClick={() => {
            setMobileFilterOpen(true);
          }}
        />
        <div className="not-mobile-item">
          <button
            className="filter-btn flex column des"
            onClick={onHandleOpenFilter}
            name="destination"
            id="destination"
          >
            <img src="/img/house.png" alt="house" className="house-icon" />
            Anywhere
          </button>
          <button
            className="filter-btn flex column border-right"
            onClick={onHandleOpenFilter}
            name="time"
            id="time"
          >
            Any Week
          </button>
          <button
            className="filter-btn flex column"
            onClick={onHandleOpenFilter}
            name="guest"
            id="guest"
          >
            Add guests
          </button>
          <button
            className="search-btn small-search"
            onClick={() => {
              setIsFilterOpen(true);
            }}
          >
            <SearchIcon />
          </button>
        </div>
      </section>
    );
  }
}

// const [ filterToEdit, setFilterToEdit ] = useState(structuredClone(filterBy))

// useEffect(() => {
//     setFilterBy(filterToEdit)
// }, [filterToEdit])

// function handleChange(ev) {
//     const type = ev.target.type
//     const field = ev.target.name
//     let value

//     switch (type) {
//         case 'text':
//         case 'radio':
//             value = field === 'sortDir' ? +ev.target.value : ev.target.value
//             if(!filterToEdit.sortDir) filterToEdit.sortDir = 1
//             break
//         case 'number':
//             value = +ev.target.value || ''
//             break
//     }
//     setFilterToEdit({ ...filterToEdit, [field]: value })
// }

// function clearFilter() {
//     setFilterToEdit({ ...filterToEdit, txt: '', minSpeed: '', maxPrice: '' })
// }

// function clearSort() {
//     setFilterToEdit({ ...filterToEdit, sortField: '', sortDir: '' })
// }
