import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";

export function StayFilter({ filterBy, setFilterBy }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

  function onHandleOpenFilter(ev) {
    setIsFilterOpen(true);
    onHandleClick(ev);
  }

  function onHandleClick({ target }) {
    const filterContainer = document.querySelector(".stay-filter");
    filterContainer.classList.add("active");
    const allButtons = document.querySelectorAll(".filter-btn");
    allButtons.forEach((btn) => {
      btn.classList.remove("active");
    });
    const { name } = target;
    target.classList.add("active");
  }

  if (isFilterOpen) {
    return (
        <section className="stay-filter">
        <button
          className="filter-btn flex column"
          name="destination"
          onClick={onHandleClick}
        >
          <label htmlFor="">Where</label>
          <input type="text" placeholder="Search destinations" />
        </button>
        <button
          className="filter-btn flex column"
          name="check-in"
          onClick={onHandleClick}
        >
          <label htmlFor="">Check in</label>
          <input type="date" placeholder="Add dates" />
        </button>
        <button
          className="filter-btn flex column"
          name="check-out"
          onClick={onHandleClick}
        >
          <label htmlFor="">Check out</label>
          <input type="date" placeholder="Add dates" />
        </button>
        <button
          className="filter-btn flex column"
          name="guest"
          onClick={onHandleClick}
        >
          <label htmlFor="">Who</label>
          <input type="text" placeholder="Add guests" />
        </button>
        <button className="search-btn">
          <SearchIcon />
        </button>
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
        <button className="search-btn small-search"
        onClick={()=>{setIsFilterOpen(true)}}
        >
          <SearchIcon />
        </button>
      </section>
    );
  }
}
