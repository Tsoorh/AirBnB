import { useState, useEffect } from "react";
import { DynamicModalCmp } from "./FilterCmps/DynamicModalCmp";
import SearchIcon from "@mui/icons-material/Search";
import { getDefaultFilter } from "../services/stay";
import { useSearchParams } from "react-router-dom";
import { useParams } from "react-router-dom";


export function StayFilter({ filterBy, setFilterBy }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModalContent, SetCurrentModalContent] = useState(null);
  const [filter, setFilter] = useState(getDefaultFilter);
  const [searchParams,setSearchParams] = useSearchParams({...filter});
  

  useEffect(()=>{
    console.log(filter);
    
    setSearchParams({...(refactorFilter(filter))})
  },[filter])

  function refactorFilter(filterObj){
    let flatObj = {}
        for(const key in filterObj){
      if(typeof filterObj[key] === 'object' && filterObj[key] !== null){
        for(const nestedKey in filterObj[key]){
          flatObj = {...flatObj,[nestedKey]:filterObj[key][nestedKey]}
        }
      }else{
        flatObj = {...flatObj,[key]:filterObj[key]}
      }
    }
    return flatObj;
  }

  const buttonDetails = [
    {
      name: "checkIn",
      span: "Check in",
      placeholder:  filter.dates.checkIn || "Add dates" ,
    },
    {
      name: "checkOut",
      span: "Check out",
      placeholder:filter.dates.checkOut ||  "Add dates" ,
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

  // function onCloseAutocomplete() {
  //   // Close the autocomplete dropdown but keep the modal open
  //   SetCurrentModalContent(null);
  //   setIsModalOpen(false);
  // }

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
    setSearchParams({...(refactorFilter(filter))});

    // Remove active class from filter container
    const filterContainer = document.querySelector(".stay-filter");
    if (filterContainer) {
      filterContainer.classList.remove("active");
    }
  }

  function handleChange(field, value) {
    switch (field) {
      case "city":
        setFilter((prevFilter) => ({
          ...prevFilter,
          city: value ,
        }));
        break;
      case "guests":
        setFilter((prevFilter) => ({
          ...prevFilter,
          guests: { ...value },
        }));
        break;
        case "checkIn":
        console.log("🚀 ~ handleChange ~ field,value:", field,value)
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
      <section className="stay-filter shadow">
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
          className="filter-btn flex "
          name="guest"
          onClick={onHandleClick}
        >
          <div className="flex column">
            <span>Who</span>
            <span className="light-color">{"add guests" || filter.guests}</span>
          </div>
          <button className="search-btn" onClick={onSearchClick}>
            <SearchIcon />
          </button>
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
          className="filter-btn flex column"
          onClick={onHandleOpenFilter}
          name="destination"
          id="destination"
        >
          Anywhere
        </button>
        <button
          className="filter-btn flex column"
          onClick={onHandleOpenFilter}
          name="time"
          id="time"
        >
          AnyTime
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
