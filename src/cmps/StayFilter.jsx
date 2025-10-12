import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { StayFilterModal } from "./FilterCmps/StayFilterModal";
import { SearchDestination } from "./FilterCmps/SearchDestination";
import { GuestsPicker } from "./FilterCmps/GuestsPicker";
import { ChooseDates } from "./FilterCmps/ChooseDates";

export function StayFilter({ filterBy, setFilterBy }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModalContent, SetCurrentModalContent] = useState(null);
  const [filter, setFilter] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guest: "",
  });

  const modalContent = {
    destination: <SearchDestination handleChange={handleChange}/>,
    checkIn: <ChooseDates field={"checkIn"} handleChange={handleChange}/>,
    checkOut: <ChooseDates field={"checkIn"} handleChange={handleChange}/>,
    guest: <GuestsPicker handleChange={handleChange} />,
  };

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


    const {name}= currentTarget;
    SetCurrentModalContent(name);
    setIsModalOpen(true);    
  }

  function onCloseModal(){
    SetCurrentModalContent(null)
    isModalOpen(false);
  }

  function handleChange({field,value}){

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
            value={filter.destination}
            onChange={handleChange}
          />
        </button>

        <button
          className="filter-btn flex column"
          name="checkIn"
          onClick={onHandleClick}
        >
          <span>Check in</span>
          <span className="light-color">{"Add dates" || filter.checkOut}</span>
        </button>

        <button
          className="filter-btn flex column"
          name="checkOut"
          onClick={onHandleClick}
        >
          <span>Check out</span>
          <span className="light-color">{"Add dates" || filter.checkOut}</span>
        </button>

        <button
          className="filter-btn flex "
          name="guest"
          onClick={onHandleClick}
        >
            <div className="flex column">
          <span>Who</span>
          <span className="light-color">{"add guests" || filter.guest}</span>

            </div>
          <button className="search-btn">
            <SearchIcon />
          </button>
        </button>

        {isModalOpen && 
        <StayFilterModal>
         {modalContent[currentModalContent]}    
        </StayFilterModal>}
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
