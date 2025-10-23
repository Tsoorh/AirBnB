import { useState, useEffect } from "react";
import { DynamicModalCmp } from "./FilterCmps/DynamicModalCmp";
import SearchIcon from "@mui/icons-material/Search";
import { getDefaultFilter } from "../services/stay";
import { useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
// import { useObserver } from "../customHooks/useObserver";

export function StayFilter({isOnViewPort }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModalContent, SetCurrentModalContent] = useState(null);
  const [filter, setFilter] = useState(getDefaultFilter);
  const [searchParams, setSearchParams] = useSearchParams({ ...filter });
  const location = useLocation();
  // const [isOnViewPort, observeRef] = useObserver();

  useEffect(() => {
    setIsFilterOpen(false);
    setIsModalOpen(false);
    SetCurrentModalContent(null);

    // const el = document.querySelector(".stay-filter");
    // if (el) el.classList.remove("active");
  }, [location.pathname]);

  useEffect(() => {
    console.log(filter);
    setSearchParams({ ...refactorFilter(filter) });
  }, [filter]);

  useEffect(() => {
    if (isOnViewPort) {
      setIsFilterOpen(true);
    } else {
      setIsFilterOpen(false);
    }
  }, [isOnViewPort]);

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
    if (setFilterBy) {
      setFilterBy(filter);
    }
    // Update URL search params (this will trigger filtering in parent component)
    setSearchParams({ ...refactorFilter(filter) });
    // Remove active class from filter container
    const filterContainer = document.querySelector(".stay-filter");
    if (filterContainer) {
      filterContainer.classList.remove("active");
    }
  }

  function classModalOpen() {
    if (isModalOpen) return "open";
    else return "";
  }

  function handleChange(field, value) {
    switch (field) {
      case "city":
        setFilter((prevFilter) => ({
          ...prevFilter,
          city: value,
        }));
        break;
      case "guests":
        setFilter((prevFilter) => ({
          ...prevFilter,
          guests: { ...value },
        }));
        break;
      case "checkIn":
        setFilter((prevFilter) => ({
          ...prevFilter,
          dates: {
            ...prevFilter.dates,
            checkIn: value,
          },
        }));
        break;
      case "checkOut":
        setFilter((prevFilter) => ({
          ...prevFilter,
          dates: {
            ...prevFilter.dates,
            checkOut: value,
          },
        }));
        break;
    }
  }

  if (isFilterOpen) {
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
              onChange={handleChange}
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
            <span className="light-color">{"add guests" || filter.guests}</span>
          </button>
          <button
            className={`search-btn ${classModalOpen()}`}
            onClick={onSearchClick}
          >
            <SearchIcon />
            <span className="search-text">{"Search" ||filter.guests} </span>
          </button>

          {isModalOpen && (
            <DynamicModalCmp
              currentModalContent={currentModalContent}
              handleChange={handleChange}
              onCloseModal={onCloseModal}
            />
          )}
        </section>
    );
  } else {
    return (
        <section className="stay-filter">
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
